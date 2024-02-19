import yaml
import json
from express import ExPrESS

def read_manifest(manifest_path):
    with open(manifest_path, 'r') as file:
        manifest = yaml.safe_load(file)
    return manifest['sources']


def convert_to_esse(poscar):
    kwargs = {
        "structure_string": poscar,
        "cell_type": "original",
        "structure_format": "poscar",
    }
    handler = ExPrESS("structure", **kwargs)
    esse = handler.property("material", **kwargs)
    return esse

def construct_name(material_config, source):
    name_parts = [
        material_config["formula"],
        source["common_name"],
        f'{source["lattice_type"]} ({source["space_group"]}) {source["dimensionality"]} ({source["form_factor"]})',
        source["source_id"]
    ]
    return ', '.join(name_parts)

def construct_filename(material_config, source):
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

def main():
    materials = []
    for source in read_manifest('materials/sources/manifest.yml'):
        with open(f"materials/sources/{source['filename']}", 'r') as file:
            poscar = file.read()
            material_config = convert_to_esse(poscar)
            name = construct_name(material_config, source)
            filename = construct_filename(material_config, source)

            material_config["name"] = name

            # remove all keys except for name, lattice, basis.
            material_config = {k: material_config[k] for k in ('name', 'lattice', 'basis')}

            # add "external" property
            material_config['external'] = {
                "id": source["source_id"],
                "source": source["source"],
                "doi": source["doi"],
                "url": source["url"],
                "origin": True
            }

            # add "isNonPeriodic" property
            material_config['isNonPeriodic'] = False

            with open(f'materials/{filename}.json', 'w') as file:
                json.dump(material_config, file)
            materials.append(material_config)
        print(f'Created {filename}.json')
    print(f'Total materials created: {len(materials)}')


main()
