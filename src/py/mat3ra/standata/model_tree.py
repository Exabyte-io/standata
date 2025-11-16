from typing import Any, Dict, List, Optional

from mat3ra.esse.models.method.categorized_method import SlugifiedEntry

from .base import Standata, StandataData
from .data.model_tree import MODEL_NAMES, MODEL_TREE, model_tree_data
from .data.models_tree_config_by_application import models_tree_config_by_application


class ModelTree(Standata):
    data_dict: Dict = model_tree_data
    data: StandataData = StandataData(data_dict)

    def get_pseudopotential_types_from_tree(self) -> List[str]:
        methods_tree = MODEL_TREE.get("dft", {}).get("gga", {}).get("methods", {})
        return methods_tree.get("pseudopotential", [])

    def tree_slug_to_named_object(self, slug: str) -> SlugifiedEntry:
        name = MODEL_NAMES.get(slug, slug)
        return SlugifiedEntry(slug=slug, name=name)

    def get_tree_by_application_name_and_version(self, name: str, version: str) -> Dict[str, Any]:
        # TODO: add logic to filter by version when necessary
        return models_tree_config_by_application.get(name, {})

    def get_default_model_type_for_application(self, application: Dict[str, Any]) -> Optional[str]:
        name = application.get("name")
        if not name:
            return None
        tree = self.get_tree_by_application_name_and_version(name, application.get("version", ""))
        keys = list(tree.keys())
        return keys[0] if keys else None
