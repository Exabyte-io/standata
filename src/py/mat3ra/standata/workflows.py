from typing import Dict

from .base import Standata, StandataData
from .data.workflows import workflows_data


class Workflows(Standata):
    data_dict: Dict = workflows_data
    data: StandataData = StandataData(data_dict)
