import json

from mat3ra.made.material import Material


def material_from_crystal(crystal):
    try:
        return Material.from_json(json.dumps(crystal))
    except Exception:
        return Material(**crystal)


slab_json = {% raw %}{{ SLAB }}{% endraw %}
bulk_hash = None

for build_step in reversed((slab_json.get("metadata") or {}).get("build") or []):
    try:
        crystal = build_step["configuration"]["stack_components"][0]["crystal"]
    except (KeyError, IndexError, TypeError):
        continue

    try:
        bulk_hash = material_from_crystal(crystal).calculate_hash()
        break
    except Exception:
        continue

print(json.dumps({"name": "BULK_HASH", "value": bulk_hash, "scope": "global"}))
