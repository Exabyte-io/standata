import json

from mat3ra.made.material import Material
from munch import Munch


def material_from_crystal(crystal):
    try:
        return Material.from_json(json.dumps(crystal))
    except Exception:
        return Material(**crystal)


slab_json = {% raw %}{{ SLAB }}{% endraw %}
bulk_metadata_id = None
bulk_hash = None
bulk_scaled_hash = None

for build_step in reversed((slab_json.get("metadata") or {}).get("build") or []):
    try:
        crystal = build_step["configuration"]["stack_components"][0]["crystal"]
    except (KeyError, IndexError, TypeError):
        continue

    bulk_metadata_id = crystal.get("_id") or bulk_metadata_id
    bulk_scaled_hash = crystal.get("scaledHash") or bulk_scaled_hash
    bulk_hash = crystal.get("hash") or bulk_hash
    if bulk_metadata_id is not None or bulk_scaled_hash is not None or bulk_hash is not None:
        break

    try:
        bulk_hash = material_from_crystal(crystal).calculate_hash()
        break
    except Exception:
        continue

print(json.dumps({"name": "BULK_METADATA_ID", "value": bulk_metadata_id, "scope": "global"}))
print(json.dumps({"name": "BULK_HASH", "value": bulk_hash, "scope": "global"}))
print(json.dumps({"name": "BULK_SCALED_HASH", "value": bulk_scaled_hash, "scope": "global"}))
