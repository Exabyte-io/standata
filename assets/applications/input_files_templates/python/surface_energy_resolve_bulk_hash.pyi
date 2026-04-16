import json

from mat3ra.made.material import Material
from munch import Munch


def material_from_crystal(crystal):
    try:
        return Material.from_json(json.dumps(crystal))
    except Exception:
        return Material(**crystal)


slab_json = {% raw %}{{ SLAB }}{% endraw %}
bulk_resolution = None

for build_step in reversed((slab_json.get("metadata") or {}).get("build") or []):
    try:
        crystal = build_step["configuration"]["stack_components"][0]["crystal"]
    except (KeyError, IndexError, TypeError):
        continue

    if crystal.get("_id") is not None:
        bulk_resolution = {"kind": "id", "value": crystal["_id"]}
        break
    if crystal.get("scaledHash") is not None:
        bulk_resolution = {"kind": "scaledHash", "value": crystal["scaledHash"]}
        break
    if crystal.get("hash") is not None:
        bulk_resolution = {"kind": "hash", "value": crystal["hash"]}
        break

    try:
        bulk_resolution = {"kind": "hash", "value": material_from_crystal(crystal).calculate_hash()}
        break
    except Exception:
        continue

print(json.dumps({"name": "BULK_RESOLUTION", "value": bulk_resolution, "scope": "global"}))
