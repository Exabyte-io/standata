from enum import Enum
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


@pytest.mark.parametrize(
    "model_type,expected_subtypes",
    [
        ("dft", {"GGA": "gga", "LDA": "lda", "HYBRID": "hybrid", "OTHER": "other"}),
        ("invalid_model", {}),
    ],
)
def test_get_subtypes_by_model_type(model_type, expected_subtypes):
    subtypes = ModelTreeStandata.get_subtypes_by_model_type(model_type)
    assert issubclass(subtypes, Enum)
    assert len(list(subtypes)) == len(expected_subtypes)
    for enum_name, expected_value in expected_subtypes.items():
        assert hasattr(subtypes, enum_name)
        assert getattr(subtypes, enum_name).value == expected_value


@pytest.mark.parametrize(
    "model_type,subtype_input,use_string,expected_functionals,excluded_functionals",
    [
        ("dft", "lda", False, {"PZ": "pz", "PW": "pw", "VWN": "vwn", "OTHER": "other"}, ["pbe"]),
        ("dft", "gga", False, {"PBE": "pbe", "PBESOL": "pbesol", "PW91": "pw91", "OTHER": "other"}, ["pz"]),
        ("dft", "lda", True, {"PZ": "pz", "PW": "pw", "VWN": "vwn", "OTHER": "other"}, ["pbe"]),
    ],
)
def test_get_functionals_by_subtype(model_type, subtype_input, use_string, expected_functionals, excluded_functionals):
    if use_string:
        subtype_arg = subtype_input
    else:
        subtypes = ModelTreeStandata.get_subtypes_by_model_type(model_type)
        subtype_arg = getattr(subtypes, subtype_input.upper())
    
    functionals = ModelTreeStandata.get_functionals_by_subtype(model_type, subtype_arg)
    assert issubclass(functionals, Enum)
    
    for enum_name, expected_value in expected_functionals.items():
        assert hasattr(functionals, enum_name)
        assert getattr(functionals, enum_name).value == expected_value
    
    functional_values = [f.value for f in functionals]
    for excluded in excluded_functionals:
        assert excluded not in functional_values


@pytest.mark.parametrize(
    "type,subtype,functional,expected",
    [
        ("dft", "gga", "pbe", {"type": "dft", "subtype": "gga", "functional": "pbe"}),
        ("dft", "lda", "pz", {"type": "dft", "subtype": "lda", "functional": "pz"}),
        ("dft", "gga", None, {"type": "dft", "subtype": "gga", "functional": "pbe"}),
        ("dft", None, None, {"type": "dft", "subtype": "gga", "functional": "pbe"}),
        ("dft", None, "pbe", {"type": "dft", "subtype": "gga", "functional": "pbe"}),
        ("dft", "lda", None, {"type": "dft", "subtype": "lda", "functional": "pz"}),
        ("invalid_type", None, None, {}),
        ("dft", "invalid_subtype", None, {"type": "dft"}),
        ("dft", "gga", "invalid_functional", {"type": "dft", "subtype": "gga"}),
    ],
)
def test_get_model_by_parameters(type, subtype, functional, expected):
    result = ModelTreeStandata.get_model_by_parameters(type, subtype, functional)
    assert result == expected
