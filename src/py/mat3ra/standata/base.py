import re
from typing import Dict, List, Optional

import pandas as pd
from pydantic import BaseModel


class StandataEntity(BaseModel):
    filename: str
    categories: List[str]


class StandataConfig(BaseModel):
    categories: Dict[str, List[str]] = {}
    entities: List[StandataEntity] = []

    def get_categories_as_list(self, separator: str = "/") -> List[str]:
        """
        Flattens categories dictionary to list of categories.

        Args:
            category_map: Dictionary mapping category types to category tags.
            separator: Separation character used to join category type and tag.

        Example::

            Standata.flatten_categories({"size": ["S", "M", "L"]})
            # returns ["size/S", "size/M", "size/L"]
        """
        category_groups = [list(map(lambda x: f"{key}{separator}{x}", val)) for key, val in self.categories.items()]
        return [item for sublist in category_groups for item in sublist]

    def convert_tags_to_categories_list(self, *tags: str):
        """
        Converts simple tags to '<category_type>/<tag>' format.

        Args:
            *tags: Category tags for the entity.

        Note:
            Some tags belong to several categories simultaneously, for instance 'semiconductor' is associated with
            'electrical_conductivity' and 'type'. This function returns all occurrences of a tag as
            '<category_type>/<tag>'.
        """
        return [cf for cf in self.categories if any([cf.split("/")[1] == t for t in tags])]

    def get_filenames_by_categories(self, *categories: str) -> List[str]:
        """
        Returns filenames that match all given categories.

        Args:
            *categories: Categories for the entity query. Note, that `categories` should be in the same format as the
            column names in the lookup table.
        """
        if len(categories) == 0:
            return []
        filenames = []
        for entity in self.entities:
            if any([category in entity.categories for category in categories]):
                filenames.append(entity.filename)
        return filenames

    def get_filenames_by_regex(self, regex: str) -> List[str]:
        """
        Returns filenames that match the regular expression.

        Args:
            regex: Regular expression for the entity query.
        """
        filenames = []
        for entity in self.entities:
            if re.match(regex, entity.filename):
                filenames.append(entity.filename)
        return filenames

    @property
    def __lookup_table(self) -> pd.DataFrame:
        """
        Creates lookup table for filenames and associated categories.

        For the lookup table category tags are first converted to the <category_type>/<tag> format, which represent the
        columns of the lookup table. The filenames represent the rows of the lookup table (DataFrame.index). The values
        in the table are either 0 or 1 depending on whether a filename is associated with a certain category (1) or
        not (0).
        """
        df = pd.DataFrame(
            0,
            columns=self.get_categories_as_list(),
            index=[entity.filename for entity in self.entities],
        )
        for entity in self.entities:
            filename = entity.filename
            categories = self.convert_tags_to_categories_list(*entity.categories)
            for category in categories:
                df.loc[filename, category] = 1
        return df


class StandataFilesMapByName(Dict[str, dict]):

    def get_objects_by_filenames(self, filenames: List[str]) -> List[dict]:
        """
        Returns entities by filenames.

        Args:
            filenames: Filenames of the entities.
        """
        matching_objects = []
        for key, entity in self.items():
            if key in filenames:
                matching_objects.append(entity)
        return matching_objects


class StandataData(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    filesMapByName: Optional[StandataFilesMapByName] = StandataFilesMapByName()
    standataConfig: Optional[StandataConfig] = StandataConfig()

    def __init__(self, /, **kwargs):
        super().__init__(**kwargs)
        self.filesMapByName = StandataFilesMapByName(kwargs.get("filesMapByName", {}))
        self.standataConfig = StandataConfig(**kwargs.get("standataConfig", {}))


class Standata(BaseModel):
    # Override in children
    data: StandataData = StandataData()

    @classmethod
    def get_as_list(cls):
        return list(cls.data.filesMapByName.values())

    @classmethod
    def get_by_name(cls, name: str) -> List[dict]:
        """
        Returns entities by name regex.

        Args:
            name: Name of the entity.
        """
        matching_filenames = cls.data.standataConfig.get_filenames_by_regex(name)
        return cls.data.filesMapByName.get_objects_by_filenames(matching_filenames)

    def get_by_categories(self, *tags: str) -> List[dict]:
        """
        Finds entities that match all specified category tags.

        Args:
            *tags: Category tags for the entity query.
        """
        categories = self.data.standataConfig.convert_tags_to_categories_list(*tags)
        matching_filenames = self.data.standataConfig.get_filenames_by_categories(*categories)
        return self.data.filesMapByName.get_objects_by_filenames(matching_filenames)