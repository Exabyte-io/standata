import re
from typing import List

from .base import Standata
from .materials import materials_data


class StandataMaterials:

    def __init__(self):
        self.entities = materials_data

    def get_json(self):
        return self.entities["filesMapByName"]

    def get_by_name(self, name: str) -> List[dict]:
        """Returns entity by name.

        Args:
            name: Name of the entity.
        """
        matching_entities = []
        for key, entity in self.entities["filesMapByName"].items():
            regex = re.compile(name, re.IGNORECASE)
            if re.match(regex, key):
                matching_entities.append(entity)
        return matching_entities
