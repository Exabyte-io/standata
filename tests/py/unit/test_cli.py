import json
import os
from pathlib import Path
from unittest.mock import patch

import pytest
import yaml
from mat3ra.standata.build.cli import main

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


def test_create_category_structure(temp_dir):
    """Test creation of category structure."""
    # Pass None as destination to avoid typer.Option issue
    main(yaml_config=str(temp_dir / "categories.yml"), destination=None)

    # Verify the structure was created correctly
    categories_root = temp_dir / "by_category"
    assert (categories_root / "dimensionality/2D").exists()
    assert (categories_root / "dimensionality/3D").exists()
    assert (categories_root / "type/metal").exists()
    assert (categories_root / "type/semiconductor").exists()


def test_custom_destination(temp_dir):
    """Test creating category structure in custom destination."""
    custom_dest = temp_dir / "custom_dest"
    custom_dest.mkdir()

    # Use explicit keyword arguments
    main(yaml_config=str(temp_dir / "categories.yml"), destination=str(custom_dest))

    # Verify the structure was created in custom destination
    categories_root = custom_dest / "by_category"
    assert (categories_root / "dimensionality/2D").exists()
    assert (categories_root / "type/metal").exists()


def test_symlink_creation(temp_dir):
    """Test if symlinks are created correctly."""
    main(yaml_config=str(temp_dir / "categories.yml"), destination=None)

    # Verify symlinks
    metal_link = temp_dir / "by_category/type/metal/material1.json"
    assert metal_link.exists()
    assert metal_link.is_symlink()
    assert metal_link.resolve() == (temp_dir / "material1.json").resolve()


@pytest.mark.skipif(os.name == "nt", reason="Symlinks might not work on Windows without admin privileges")
def test_permission_error(temp_dir):
    """Test handling of permission errors during symlink creation."""
    with patch("pathlib.Path.symlink_to", side_effect=PermissionError):
        with pytest.raises(PermissionError):
            main(yaml_config=str(temp_dir / "categories.yml"), destination=None)


def test_nonexistent_config(temp_dir):
    """Test handling of non-existent config file."""
    with pytest.raises(FileNotFoundError):
        main(yaml_config=str(temp_dir / "nonexistent.yml"), destination=None)


def test_duplicate_run(temp_dir):
    """Test running the command twice (should handle existing symlinks)."""
    # Run twice with explicit keyword arguments
    main(yaml_config=str(temp_dir / "categories.yml"), destination=None)
    main(yaml_config=str(temp_dir / "categories.yml"), destination=None)

    # Verify structure is still correct
    categories_root = temp_dir / "by_category"
    assert (categories_root / "dimensionality/2D").exists()
    metal_link = categories_root / "type/metal/material1.json"
    assert metal_link.is_symlink()
