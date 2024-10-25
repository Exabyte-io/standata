import re
from typing import List

from .base import Standata
from .materials import materials_data


class Standata:

    # Override in children
    data = {"filesMapByName": []}
    files_map_by_name = data["filesMapByName"]

    @classmethod
    def get_as_list(cls):
        return cls.files_map_by_name

    @classmethod
    def get_by_name(cls, name: str) -> List[dict]:
        """Returns entity by name.

        Args:
            name: Name of the entity.
        """
        matching_entities = []
        for key, entity in cls.files_map_by_name.items():
            regex = re.compile(name, re.IGNORECASE)
            if re.match(regex, key):
                matching_entities.append(entity)
        return matching_entities
