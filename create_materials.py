import json
from typing import Dict

import yaml
from express import ExPrESS

MANIFEST_PATH = 'materials/sources/manifest.yml'
SOURCES_PATH = 'materials/sources'
DESTINATION_PATH = 'materials'

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


def convert_to_esse(poscar: str):
    """
    Converts a POSCAR structure to ESSE format.

    Args:
        poscar (str): POSCAR structure.

    Returns:
        dict: ESSE material configuration.
    """
    kwargs = {
        "structure_string": poscar,
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

    # Slugify the common name
    common_name = source["common_name"].replace(' ', '_')
    # Create slugified filename
    filename_parts = [
        material_config["formula"],
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
        "isNonPeriodic": False
    }

    if "metadata" in source:
        final_config["metadata"] = source["metadata"]

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

            with open(f'{DESTINATION_PATH}/{filename}.json', 'w') as file:
                json.dump(final_config, file)
                file.write('\n')
            materials.append(final_config)
        print(f'Created {filename}.json')
    print(f'Total materials created: {len(materials)}')


main()
