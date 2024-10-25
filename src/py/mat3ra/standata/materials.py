from typing import Dict

from .base import Standata, StandataConfig, StandataData, StandataEntity, StandataFilesMapByName
from .data.materials import materials_data


class Materials(Standata):
    def __init__(self, data: Dict = materials_data):
        """
        Initialize the Materials class with specific materials data.
        """
        super().__init__(data_dict=data)
