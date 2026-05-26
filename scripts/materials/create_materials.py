import json
import re
from typing import Dict

import yaml
from express import ExPrESS

# Paths configured in build-config.js: BUILD_CONFIG.materials.*
MANIFEST_PATH = 'assets/materials/manifest.yml'  # BUILD_CONFIG.materials.assets.path + manifest
SOURCES_PATH = 'assets/materials'                 # BUILD_CONFIG.materials.assets.path
DESTINATION_PATH = 'data/materials'                # BUILD_CONFIG.materials.data.path

def read_build_config():
    """
    Read formatting settings from build-config.js
    """
    with open('build-config.ts', 'r') as f:
        content = f.read()
        # Extract jsonFormat.spaces value
        match = re.search(r'jsonFormat:\s*{\s*spaces:\s*(\d+)', content)
        if match:
            return int(match.group(1))
    return 2  # Default fallback

JSON_INDENT = read_build_config()

def read_manifest(manifest_path: str):
    """
    Reads the manifest file and returns the sources list.

    Args:
        manifest_path (str): Path to the manifest file.

    Returns:
        list: List of sources.
    """
    with open(manifest_path, 'r') as file:
        manifest = yaml.safe_load(file)
    return manifest['sources']


def strip_poscar_comments(poscar: str) -> str:
    """
    Removes inline comments from POSCAR file content.

    Args:
        poscar (str): Raw POSCAR file content.

    Returns:
        str: POSCAR content with inline comments removed.
    """
    cleaned_lines = []
    for line in poscar.split('\n'):
        if '!' in line:
            line = line.split('!')[0].rstrip()
        cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)


def convert_to_esse(poscar: str):
    """
    Converts a POSCAR structure to ESSE format.

    Args:
        poscar (str): POSCAR structure.

    Returns:
        dict: ESSE material configuration.
    """
    cleaned_poscar = strip_poscar_comments(poscar)

    kwargs = {
        "structure_string": cleaned_poscar,
        "cell_type": "original",
        "structure_format": "poscar",
    }
    handler = ExPrESS("structure", **kwargs)
    esse = handler.property("material", **kwargs)
    return esse



def construct_name(material_config: Dict[str, str], source: Dict[str, str]) -> str:
    """
    Constructs the name of the material for use as a property in the ESSE material configuration.

    Args:
        material_config (dict): ESSE material configuration.
        source (dict): Source information.

    Returns:
        str: Name of the material.
    """
    name_parts = [
        material_config["formula"],
        source["common_name"],
        f'{source["lattice_type"]} ({source["space_group"]}) {source["dimensionality"]} ({source["form_factor"]})',
        source["source_id"]
    ]
    return ', '.join(name_parts)


def construct_filename(material_config: Dict[str, str], source: Dict[str, str]) -> str:
    """
    Constructs the filename of the JSON file used to store the ESSE material configuration.

    Args:
        material_config (dict): ESSE material configuration.
        source (dict): Source information.

    Returns:
        str: Filename of the JSON file.
    """

    # Noble gases (monoatomic gases)
    NOBLE_GASES = {"He", "Ne", "Ar", "Kr", "Xe"}

    # For molecular structures, use unitCellFormula which gives molecular formula (e.g., Br2)
    # instead of reduced formula (e.g., Br)
    # Exception: noble gases should use just element symbol (He, Ne, etc.), not He2, Ne1, etc.
    if source.get("isNonPeriodic", False):
        element = source.get("metadata", {}).get("element", "")
        if element in NOBLE_GASES:
            formula = element
        else:
            formula = material_config.get("unitCellFormula", material_config["formula"])
    else:
        formula = material_config["formula"]

    # Slugify the common name
    common_name = source["common_name"].replace(' ', '_')
    # Create slugified filename
    filename_parts = [
        formula,
        f'[{common_name}]',
        f'{source["lattice_type"]}_[{source["space_group"]}]_{source["dimensionality"]}_[{source["form_factor"]}]',
        f'[{source["source_id"]}]'
    ]
    filename = '-'.join(filename_parts)
    # replace special characters with URL encoding
    filename = filename.replace('/', '%2F')

    return filename

def create_material_config(material_config: Dict, source: Dict) -> Dict:
    """
    Creates the final material configuration by adding name, external info, and metadata.

    Args:
        material_config (dict): Base ESSE material configuration.
        source (dict): Source information including metadata.

    Returns:
        dict: Complete material configuration.
    """
    name = construct_name(material_config, source)

    final_config = {
        "name": name,
        "lattice": material_config["lattice"],
        "basis": material_config["basis"],
        "external": {
            "id": source["source_id"],
            "source": source["source"],
            "doi": source["doi"],
            "url": source["url"],
            "origin": True
        },
        "isNonPeriodic": source.get("isNonPeriodic", False),
    }

    if "metadata" in source:
        final_config["metadata"] = source["metadata"]

    if "tags" in source:
        final_config["tags"] = source["tags"]

    return final_config

def main():
    """
    Main function to create materials listed in the sources manifest.
    """
    materials = []
    for source in read_manifest(MANIFEST_PATH):
        with open(f"{SOURCES_PATH}/{source['filename']}", 'r') as file:
            poscar = file.read()
            material_config = convert_to_esse(poscar)
            final_config = create_material_config(material_config, source)
            filename = construct_filename(material_config, source)

            # Write JSON file with formatting from build-config.js
            with open(f'{DESTINATION_PATH}/{filename}.json', 'w') as file:
                json.dump(final_config, file, indent=JSON_INDENT)
                file.write('\n')
            materials.append(final_config)
        print(f'Created {filename}.json')
    print(f'Total materials created: {len(materials)}')


main()
