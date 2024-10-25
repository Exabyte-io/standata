import json
import yaml
from pathlib import Path
from typing import Dict, List, Optional, TypedDict, Union


from ..base import StandataConfig

EntityItem = TypedDict("EntityItem", {"filename": str, "categories": List[str]})

EntityConfig = TypedDict("EntityConfig", {"categories": Dict[str, List[str]], "entities": List[EntityItem]})


class StandataBuilder:
    """The Standata class associates the entity data files with categories and allows for tag-based queries.

    Attributes:
        entity_dir: Path to the folder containing entity data files.
    """

    def __init__(self, entity_config: EntityConfig, entity_dir: Union[str, Path]):
        """Initializes categories and the entity list.

        Args:
             entity_config: The contents of the entity config file (`categories.yml`).
             entity_dir: The path to the directory containing all entities.
        """
        self.entity_dir: Path = Path(entity_dir).resolve()

    @classmethod
    def build_from_file(cls, entity_config_path: Union[Path, str]) -> "StandataConfig":
        """Creates Standata class instance from entity config file (categories.yml).

        Args:
            entity_config_path: The path to the entity config file `categories.yml`.

        Note:
            Here, we assume that the entity config file is located in the same directory as all entity files.
        """
        filepath = Path(entity_config_path)
        config = StandataBuilder.load_config(filepath)
        return StandataConfig(**config)

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
