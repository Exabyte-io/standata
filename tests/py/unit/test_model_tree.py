from types import SimpleNamespace

import pytest
from mat3ra.standata.model_tree import ModelTreeStandata

MODEL = SimpleNamespace(DFT="dft", INVALID="invalid_model")
METHOD = SimpleNamespace(PSEUDOPOTENTIAL="pseudopotential", INVALID="invalid_method")
SLUG = SimpleNamespace(DFT="dft", DFT_NAME="density functional theory", UNKNOWN="unknown_slug")
APP = SimpleNamespace(VASP="vasp", INVALID="invalid_app")
VERSION = SimpleNamespace(V6_0="6.0", V1_0="1.0")
PSEUDOPOTENTIAL_TYPE = SimpleNamespace(PAW="paw", NC="nc", NC_FR="nc-fr", US="us")
MODEL_TYPE = SimpleNamespace(DFT="dft")


@pytest.mark.parametrize(
    "model_shortname,method_shortname,expected",
    [
        (MODEL.DFT, METHOD.PSEUDOPOTENTIAL, list),
        (MODEL.INVALID, METHOD.PSEUDOPOTENTIAL, []),
        (MODEL.DFT, METHOD.INVALID, []),
    ],
)
def test_get_method_types_by_model(model_shortname, method_shortname, expected):
    model_tree = ModelTreeStandata()
    result = model_tree.get_method_types_by_model(model_shortname, method_shortname)
    if isinstance(expected, type):
        assert isinstance(result, expected)
    else:
        assert result == expected


def test_get_pseudopotential_types_from_tree():
    model_tree = ModelTreeStandata()
    result = model_tree.get_pseudopotential_types_from_tree()
    assert isinstance(result, list)
    assert PSEUDOPOTENTIAL_TYPE.PAW in result
    assert PSEUDOPOTENTIAL_TYPE.NC in result
    assert PSEUDOPOTENTIAL_TYPE.NC_FR in result
    assert PSEUDOPOTENTIAL_TYPE.US in result


@pytest.mark.parametrize(
    "slug,expected_slug,expected_name",
    [
        (SLUG.DFT, SLUG.DFT, SLUG.DFT_NAME),
        (SLUG.UNKNOWN, SLUG.UNKNOWN, SLUG.UNKNOWN),
    ],
)
def test_tree_slug_to_named_object(slug, expected_slug, expected_name):
    model_tree = ModelTreeStandata()
    result = model_tree.tree_slug_to_named_object(slug)
    assert result.slug == expected_slug
    assert result.name == expected_name


@pytest.mark.parametrize(
    "name,version,expected_type,expected_key",
    [
        (APP.VASP, VERSION.V6_0, dict, MODEL_TYPE.DFT),
        (APP.INVALID, VERSION.V1_0, dict, None),
    ],
)
def test_get_tree_by_application_name_and_version(name, version, expected_type, expected_key):
    model_tree = ModelTreeStandata()
    result = model_tree.get_tree_by_application_name_and_version(name, version)
    assert isinstance(result, expected_type)
    if expected_key:
        assert expected_key in result
    else:
        assert result == {}


@pytest.mark.parametrize(
    "application,expected",
    [
        ({"name": APP.VASP, "version": VERSION.V6_0}, MODEL_TYPE.DFT),
        ({"version": VERSION.V6_0}, None),
        ({"name": "", "version": VERSION.V6_0}, None),
        ({"name": APP.INVALID, "version": VERSION.V1_0}, None),
    ],
)
def test_get_default_model_type_for_application(application, expected):
    model_tree = ModelTreeStandata()
    result = model_tree.get_default_model_type_for_application(application)
    if expected:
        assert isinstance(result, str)
        assert result == expected
    else:
        assert result is None
