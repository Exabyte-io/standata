from collections import defaultdict
from typing import Any, Dict, List

from .base import Standata, StandataData
from .data.applications import applications_data
from .data.executable_flavor_map_by_application import (
    executable_flavor_map_by_application_data as EXECUTABLE_FLAVOR_MAP_BY_APPLICATION,
)


class ApplicationStandata(Standata):
    data_dict: Dict = applications_data
    data: StandataData = StandataData(data_dict)

    @classmethod
    def get_app_tree_for_application(cls, app_name: str) -> Dict[str, Any]:
        executable_data = EXECUTABLE_FLAVOR_MAP_BY_APPLICATION
        if app_name not in executable_data:
            raise ValueError(f"{app_name} is not a known application with executable tree.")
        return executable_data[app_name]

    @classmethod
    def get_all_app_tree(cls) -> Dict[str, Any]:
        return EXECUTABLE_FLAVOR_MAP_BY_APPLICATION

    @classmethod
    def list_all(cls) -> Dict[str, List[dict]]:
        """
        Lists all applications with their versions and build information and prints in a human-readable format.
        Returns a dict grouped by application name.
        """
        grouped = defaultdict(list)
        for app in cls.get_as_list():
            version_info = {
                "version": app.get("version"),
                "build": app.get("build"),
            }
            if app.get("isLicensed"):
                version_info["isLicensed"] = True
            grouped[app.get("name")].append(version_info)

        lines = []
        for app_name in sorted(grouped.keys()):
            for info in grouped[app_name]:
                licensed = " (licensed)" if info.get("isLicensed") else ""
                lines.append(f"{app_name}:\n      version: {info['version']}, build: {info['build']}{licensed}")

        print("\n".join(lines))
        return dict(grouped)
