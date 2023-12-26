import json
from pathlib import Path
from typing import Dict, List, Optional, TypedDict, Union

import pandas as pd
import yaml

EntityItem = TypedDict("EntityItem", {"filename": str, "categories": List[str]})

EntityConfig = TypedDict("EntityConfig", {"categories": Dict[str, List[str]], "entities": List[EntityItem]})


class Standata:
    """The Standata class associates the entity data files with categories and allows for tag-based queries.

    Attributes:
        entity_dir: Path to the folder containing entity data files.
        entities: List of entity items specifying filename and categories.
        category_map: Dictionary mapping category types to category tags.
        categories: List of unique categories from flattening the category_map dictionary.
        lookup_table: Category-filename lookup table.
    """

    def __init__(self, entity_config: EntityConfig, entity_dir: Union[str, Path]):
        """Initializes categories and the entity list.

        Args:
             entity_config: The contents of the entity config file (`categories.yml`).
             entity_dir: The path to the directory containing all entities.
        """
        self.entity_dir: Path = Path(entity_dir).resolve()
        self.category_map: Dict[str, List[str]] = entity_config["categories"]
        self.entities: List[EntityItem] = entity_config["entities"]

        self.categories: List[str] = Standata.flatten_categories(entity_config["categories"])
        self.lookup_table: pd.DataFrame = self.__create_table()

    @classmethod
    def from_file(cls, entity_config_path: Union[Path, str]) -> "Standata":
        """Creates Standata class instance from entity config file (categories.yml).

        Args:
            entity_config_path: The path to the entity config file `categories.yml`.

        Note:
            Here, we assume that the entity config file is located in the same directory as all entity files.
        """
        filepath = Path(entity_config_path)
        cfg: EntityConfig = Standata.load_config(filepath)
        instance = cls(entity_config=cfg, entity_dir=filepath.parent)
        return instance

    @staticmethod
    def load_config(entity_config_path: Path) -> EntityConfig:
        """Loads entity config from file (Yaml).

        Args:
            entity_config_path: The path to the entity config file `categories.yml`.
        """
        entity_config: EntityConfig = {"categories": {}, "entities": []}
        try:
            with open(entity_config_path.resolve(), "r") as stream:
                entity_config = yaml.safe_load(stream)
        except yaml.YAMLError as e:
            print(e)
        return entity_config

    @staticmethod
    def flatten_categories(category_map: Dict[str, List[str]], separator: str = "/") -> List[str]:
        """Flattens categories dictionary to list of categories.

        Args:
            category_map: Dictionary mapping category types to category tags.
            separator: Separation character used to join category type and tag.

        Example::

            Standata.flatten_categories({"size": ["S", "M", "L"]})
            # returns ["size/S", "size/M", "size/L"]
        """
        category_groups = [list(map(lambda x: f"{key}{separator}{x}", val)) for key, val in category_map.items()]
        return [item for sublist in category_groups for item in sublist]

    def convert_tag_to_category(self, *tags: str):
        """Converts simple tags to '<category_type>/<tag>' format.

        Args:
            *tags: Category tags for the entity.

        Note:
            Some tags belong to several categories simultaneously, for instance 'semiconductor' is associated with
            'electrical_conductivity' and 'type'. This function returns all occurrences of a tag as
            '<category_type>/<tag>'.
        """
        return [cf for cf in self.categories if any([cf.split("/")[1] == t for t in tags])]

    def __create_table(self) -> pd.DataFrame:
        """Creates lookup table for filenames and associated categories.

        For the lookup table category tags are first converted to the <category_type>/<tag> format, which represent the
        columns of the lookup table. The filenames represent the rows of the lookup table (DataFrame.index). The values
        in the table are either 0 or 1 depending on whether a filename is associated with a certain category (1) or
        not (0).
        """
        df = pd.DataFrame(0, columns=self.categories, index=[entity["filename"] for entity in self.entities])
        for entity in self.entities:
            filename = entity["filename"]
            categories = self.convert_tag_to_category(*entity["categories"])
            for category in categories:
                df.loc[filename, category] = 1
        return df

    def __get_filenames(self, *categories: str) -> List[Path]:
        """Returns filepaths to entities that match all given categories.

        Args:
            *categories: Categories for the entity query. Note, that `categories` should be in the same format as the
            column names in the lookup table.
        """
        if len(categories) == 0:
            return []
        mask = pd.Series([True] * len(self.lookup_table), index=self.lookup_table.index)
        for category in categories:
            mask = mask & (self.lookup_table[category] == 1)
            print(category, mask)
        return [self.entity_dir / f for f in self.lookup_table[mask].index.tolist()]

    @staticmethod
    def load_entity(filepath: Path) -> Optional[dict]:
        """Loads entity config from file (JSON).

        Args:
            filepath: Path to entity data file (JSON).
        """
        entity = None
        if not filepath.resolve().exists():
            print(f"Could not find entity file: {filepath.resolve()}")
            return entity
        try:
            with open(filepath.resolve(), "r") as f:
                entity = json.load(f)
        except json.JSONDecodeError as e:
            print(e)
        return entity

    def find_entities(self, *tags: str) -> List[dict]:
        """Finds entities that match all specified category tags.

        Args:
            *tags: Category tags for the entity query.
        """
        categories = self.convert_tag_to_category(*tags)
        filenames = list(map(Path, self.__get_filenames(*categories)))
        entities = []
        for filepath in filenames:
            entity = Standata.load_entity(filepath)
            if entity:
                entities.append(entity)
        return entities
