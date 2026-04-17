# ---------------------------------------------------------- #
#                                                            #
#  This script builds the query used to locate the bulk      #
#  structure corresponding to a slab material.               #
#  SLAB comes from the workflow scope and is expected        #
#  to be a JSON representation of the slab material.         #
#                                                            #
#  Resolution order:                                         #
#  1. slab metadata bulkId                                   #
#  2. build metadata crystal _id                             #
#  3. build metadata crystal scaledHash                      #
#  4. build metadata crystal hash                            #
#  5. recalculated hash from the embedded crystal            #
#                                                            #
#  Emits BULK_QUERY to the workflow scope.                   #
#                                                            #
# ---------------------------------------------------------- #
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
