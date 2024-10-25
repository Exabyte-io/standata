from .base import Standata, StandataData
from .data.materials import materials_data


class Materials(Standata):
    data = StandataData(**materials_data)
