import json

from mat3ra.made.material import Material
from munch import Munch


def material_from_crystal(crystal):
    try:
        return Material.from_json(json.dumps(crystal))
    except Exception:
        return Material(**crystal)


slab_json = {% raw %}{{ SLAB }}{% endraw %}
bulk_query = None

metadata = slab_json.get("metadata") or {}
if metadata.get("bulkId") is not None:
    bulk_query = {"_id": metadata["bulkId"]}

if bulk_query is None:
    for build_step in reversed(metadata.get("build") or []):
        try:
            crystal = build_step["configuration"]["stack_components"][0]["crystal"]
        except (KeyError, IndexError, TypeError):
            continue

        if crystal.get("_id") is not None:
            bulk_query = {"_id": crystal["_id"]}
            break
        if crystal.get("scaledHash") is not None:
            bulk_query = {"scaledHash": crystal["scaledHash"]}
            break
        if crystal.get("hash") is not None:
            bulk_query = {"hash": crystal["hash"]}
            break

        try:
            bulk_query = {"hash": material_from_crystal(crystal).calculate_hash()}
            break
        except Exception:
            continue

print(json.dumps({"name": "BULK_QUERY", "value": bulk_query, "scope": "global"}))
