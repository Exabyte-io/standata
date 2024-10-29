import json
from pathlib import Path

import pytest
import yaml
from mat3ra.standata.base import StandataConfig, StandataEntity
from mat3ra.standata.build.builder import StandataBuilder

# Test data
SAMPLE_CONFIG = {
    "categories": {"dimensionality": ["2D", "3D"], "type": ["metal", "semiconductor"]},
    "entities": [
        {"filename": "material1.json", "categories": ["2D", "metal"]},
        {"filename": "material2.json", "categories": ["3D", "semiconductor"]},
    ],
}

SAMPLE_ENTITY = {"name": "Test Material", "isNonPeriodic": False, "lattice": {"a": 1.0, "b": 1.0, "c": 1.0}}


@pytest.fixture
def temp_dir(tmp_path):
    """Create a temporary directory with test files."""
    # Create config file
    config_path = tmp_path / "categories.yml"
    with open(config_path, "w") as f:
        yaml.dump(SAMPLE_CONFIG, f)

    # Create entity files
    for entity in SAMPLE_CONFIG["entities"]:
        entity_path = tmp_path / entity["filename"]
        with open(entity_path, "w") as f:
            json.dump(SAMPLE_ENTITY, f)

    return tmp_path


@pytest.fixture
def builder(temp_dir):
    """Create a StandataBuilder instance."""
    return StandataBuilder(temp_dir)


# StandataBuilder Tests
def test_builder_initialization(builder):
    """Test StandataBuilder initialization."""
    assert isinstance(builder, StandataBuilder)
    assert isinstance(builder.entity_dir, Path)
    assert builder.entity_dir.exists()


def test_load_config(temp_dir):
    """Test loading configuration from YAML file."""
    config = StandataBuilder.load_config(temp_dir / "categories.yml")
    assert isinstance(config, StandataConfig)
    assert len(config.categories) == 2
    assert len(config.entities) == 2
    assert isinstance(config.entities[0], StandataEntity)
    assert "dimensionality" in config.categories
    assert "type" in config.categories


def test_load_entity(temp_dir):
    """Test loading entity from JSON file."""
    entity_data = StandataBuilder.load_entity(temp_dir / "material1.json")
    assert isinstance(entity_data, dict)
    assert entity_data["name"] == "Test Material"
    assert entity_data["isNonPeriodic"] is False


def test_load_nonexistent_entity(temp_dir):
    """Test loading non-existent entity file."""
    entity_data = StandataBuilder.load_entity(temp_dir / "nonexistent.json")
    assert entity_data is None


def test_build_from_file(temp_dir):
    """Test building StandataConfig from config file."""
    config = StandataBuilder.build_from_file(temp_dir / "categories.yml")
    assert isinstance(config, StandataConfig)
    assert len(config.categories) == 2
    assert len(config.entities) == 2


def test_load_invalid_yaml(temp_dir):
    """Test loading invalid YAML file."""
    invalid_yaml_path = temp_dir / "invalid.yml"
    with open(invalid_yaml_path, "w") as f:
        f.write("invalid: yaml: content: {[}")

    config = StandataBuilder.load_config(invalid_yaml_path)
    assert isinstance(config, StandataConfig)
    assert len(config.categories) == 0
    assert len(config.entities) == 0
