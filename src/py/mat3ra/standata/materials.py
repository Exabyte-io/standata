from .base import Standata, StandataData, StandataFilesMapByName
from .data.materials import materials_data


class Materials(Standata):
    data: StandataData = StandataData(
        filesMapByName=StandataFilesMapByName(materials_data["filesMapByName"]),
        standataConfig=materials_data.get("standataConfig", {}),
    )
