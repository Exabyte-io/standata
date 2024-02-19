import yaml
import json
from express import ExPrESS

def read_manifest(manifest_path):
    with open(manifest_path, 'r') as file:
        manifest = yaml.safe_load(file)
    print(manifest['sources'])
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


def main():
    materials = []
    for source in read_manifest('materials/sources/manifest.yml'):
        with open(f"materials/sources/{source['filename']}", 'r') as file:
            poscar = file.read()
            material_config = convert_to_esse(poscar)

            name = f'{material_config["formula"]}, {source["common_name"]}, {source["lattice_type"]} ({source["space_group"]}) {source["dimensionality"]} ({source["form_factor"]}), {source["source_id"]}'

            # slugify common name
            common_name = source["common_name"].replace(' ', '_')
            # create slugified filename
            filename = f'{material_config["formula"]}-[{common_name}]-{source["lattice_type"]}_[{source["space_group"]}]_{source["dimensionality"]}_[{source["form_factor"]}]-[{source["source_id"]}]'

            # replace special carachters with URL encoding
            filename = filename.replace('/', '%2F')

            material_config["name"] = name

            # remove keys apart from name, lattice, basis. 
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
            
            print(material_config)
            with open(f'materials/{filename}.json', 'w') as file:
                json.dump(material_config, file)
            materials.append(material_config)

main()
