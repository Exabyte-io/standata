from collections import defaultdict
from typing import Dict, List

from .base import Standata, StandataData
from .data.applications import applications_data


class ApplicationStandata(Standata):
    data_dict: Dict = applications_data
    data: StandataData = StandataData(data_dict)

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


