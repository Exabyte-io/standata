from typing import Dict

from .base import Standata, StandataConfig, StandataData, StandataEntity, StandataFilesMapByName
from .data.materials import materials_data


class Materials(Standata):
    def __init__(self, data: Dict = materials_data):
        standata_data = StandataData(
            filesMapByName=StandataFilesMapByName(dictionary=data.get("filesMapByName", {})),
            standataConfig=StandataConfig(
                categories=data.get("standataConfig", {}).get("categories", {}),
                entities=[
                    StandataEntity(filename=entity["filename"], categories=entity["categories"])
                    for entity in data.get("standataConfig", {}).get("entities", [])
                ],
            ),
        )
        super().__init__(data=standata_data)
