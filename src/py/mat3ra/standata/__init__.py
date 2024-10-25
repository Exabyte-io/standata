import re
from typing import Dict, List


class Standata:

    # Override in children
    data: dict = {"filesMapByName": []}

    @classmethod
    def files_map_by_name(cls) -> Dict[str, dict]:
        return cls.data["filesMapByName"]

    @classmethod
    def get_as_list(cls):
        return list(cls.files_map_by_name().values())

    @classmethod
    def get_by_name(cls, name: str) -> List[dict]:
        """Returns entity by name.

        Args:
            name: Name of the entity.
        """
        matching_entities = []
        for key, entity in cls.files_map_by_name().items():
            regex = re.compile(name, re.IGNORECASE)
            if re.match(regex, key):
                matching_entities.append(entity)
        return matching_entities
