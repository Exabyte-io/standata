import json
from pathlib import Path
from typing import List, Optional, TypedDict, Union

import pandas as pd
import yaml

EntityItem = TypedDict("EntityItem", {"filename": str, "categories": List[str]})

EntityConfig = TypedDict("EntityConfig", {"categories": dict, "entities": List[EntityItem]})


class Standata:
    def __init__(self, entity_config_path: Union[str, Path]):
        self.entity_config_path = Path(entity_config_path).resolve()
        self.entity_dir = self.entity_config_path.parent

        cfg = self.__load_config()
        self.entities = cfg["entities"]
        self.category_map = cfg["categories"]
        self.categories = self.__flatten_categories()
        self.lookup_table = self.__create_table()

    def __load_config(self) -> EntityConfig:
        entity_config: EntityConfig = {"categories": {}, "entities": []}
        try:
            with open(self.entity_config_path, "r") as stream:
                entity_config = yaml.safe_load(stream)
        except yaml.YAMLError as e:
            print(e)
        return entity_config

    def __flatten_categories(self, separator: str = "/") -> List[str]:
        category_groups = [list(map(lambda x: f"{key}{separator}{x}", val)) for key, val in self.category_map.items()]
        return [item for sublist in category_groups for item in sublist]

    def convert_tag_to_category(self, *tags):
        return [cf for cf in self.categories if any([cf.endswith(t) for t in tags])]

    def __create_table(self) -> pd.DataFrame:
        df = pd.DataFrame(0, columns=self.categories, index=[entity["filename"] for entity in self.entities])
        for entity in self.entities:
            filename = entity["filename"]
            categories = self.convert_tag_to_category(*entity["categories"])
            for category in categories:
                df.loc[filename, category] = 1
        return df

    def __get_filenames(self, *categories) -> List[Path]:
        if len(categories) == 0:
            return []
        mask = pd.Series([True] * len(self.lookup_table), index=self.lookup_table.index)
        for category in categories:
            mask = mask & (self.lookup_table[category] == 1)
            print(category, mask)
        return [self.entity_dir / f for f in self.lookup_table[mask].index.tolist()]

    @staticmethod
    def load_entity(filepath: Path) -> Optional[dict]:
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

    def find_entities(self, *tags) -> List[dict]:
        categories = self.convert_tag_to_category(*tags)
        filenames = list(map(Path, self.__get_filenames(*categories)))
        entities = []
        for filepath in filenames:
            entity = Standata.load_entity(filepath)
            if entity:
                entities.append(entity)
        return entities
