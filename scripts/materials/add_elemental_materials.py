#!/usr/bin/env python3
"""
Script to add elemental materials from exabyte-benchmarks-suite-old.

Usage:
1. To add specific elements: python add_elemental_materials.py Al Fe Ti
2. To add all elements in ELEMENT_DATA: python add_elemental_materials.py --all
3. Comment out elements in ELEMENT_DATA to skip them

This script:
- Copies POSCAR files from local cloned repo:
```
clone git@github.com:Exabyte-io/exabyte-benchmarks-suite-old.git
git fetch origin pull/9/head:feature/SOF-1409
git checkout feature/SOF-1409
```
- Appends entries directly to manifest.yml
- Appends entries to categories.yml
- Lattice types written by AI

Missing:
Alkali / alkaline earth:
Fr, Ra

Post-transition / metalloids / halogens:
Po, At

Noble gases omitted from noble list:
Rn, Og

Actinides:
Cm, Bk, Cf, Es, Fm, Md, No, Lr

Superheavy / transactinides:
Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts
"""

import yaml
from pathlib import Path
from typing import Dict
import sys

# Local repository path (cloned exabyte-benchmarks-suite-old)
LOCAL_REPO = Path.home() / "code" / "GREEN" / "exabyte-benchmarks-suite-old"
ELEMENTS_DIR = LOCAL_REPO / "structures" / "vasp" / "elements"

# Paths
SCRIPT_DIR = Path(__file__).parent
ASSETS_DIR = SCRIPT_DIR.parent.parent / "assets" / "materials"
MANIFEST_PATH = ASSETS_DIR / "manifest.yml"
CATEGORIES_PATH = ASSETS_DIR / "categories.yml"

# Elements we already have in Standata
EXISTING_ELEMENTS = {"C", "Au", "Cu", "Ge", "Ni", "Pt", "Si"}

# Molecular elements (diatomic molecules in a box - need isNonPeriodic: True)
MOLECULAR_ELEMENTS = {"H", "N", "O", "F", "Cl", "Br", "I"}

# Noble gases (separated - may need special POSCAR construction later)
NOBLE_GASES = {
    "He": {"name": "Helium", "crystal": "HEX"},
    "Ne": {"name": "Neon", "crystal": "FCC"},
    "Ar": {"name": "Argon", "crystal": "FCC"},
    "Kr": {"name": "Krypton", "crystal": "FCC"},
    "Xe": {"name": "Xenon", "crystal": "FCC"},
}

# Element metadata - comment out elements to skip them
ELEMENT_DATA = {
    "Ac": {"name": "Actinium", "crystal": "FCC"},
    "Ag": {"name": "Silver", "crystal": "FCC"},
    "Al": {"name": "Aluminum", "crystal": "FCC"},
    "Am": {"name": "Americium", "crystal": "HEX"},
    "As": {"name": "Arsenic", "crystal": "RHL"},
    "B": {"name": "Boron", "crystal": "RHL"},
    "Ba": {"name": "Barium", "crystal": "BCC"},
    "Be": {"name": "Beryllium", "crystal": "HEX"},
    "Bi": {"name": "Bismuth", "crystal": "RHL"},
    "Br": {"name": "Bromine", "crystal": "ORC"},  # Br2 molecule
    "Ca": {"name": "Calcium", "crystal": "FCC"},
    "Cd": {"name": "Cadmium", "crystal": "HEX"},
    "Ce": {"name": "Cerium", "crystal": "FCC"},
    "Cl": {"name": "Chlorine", "crystal": "ORC"},  # Cl2 molecule
    "Co": {"name": "Cobalt", "crystal": "HEX"},
    "Cr": {"name": "Chromium", "crystal": "BCC"},
    "Cs": {"name": "Cesium", "crystal": "BCC"},
    "Dy": {"name": "Dysprosium", "crystal": "HEX"},
    "Er": {"name": "Erbium", "crystal": "HEX"},
    "Eu": {"name": "Europium", "crystal": "BCC"},
    "F": {"name": "Fluorine", "crystal": "MCL"},  # F2 molecule
    "Fe": {"name": "Iron", "crystal": "BCC"},
    "Ga": {"name": "Gallium", "crystal": "ORC"},
    "Gd": {"name": "Gadolinium", "crystal": "HEX"},
    "H": {"name": "Hydrogen", "crystal": "HEX"},  # H2 molecule
    "Hf": {"name": "Hafnium", "crystal": "HEX"},
    "Hg": {"name": "Mercury", "crystal": "RHL"},
    "Ho": {"name": "Holmium", "crystal": "HEX"},
    "I": {"name": "Iodine", "crystal": "ORC"},  # I2 molecule
    "In": {"name": "Indium", "crystal": "TET"},
    "Ir": {"name": "Iridium", "crystal": "FCC"},
    "K": {"name": "Potassium", "crystal": "BCC"},
    "La": {"name": "Lanthanum", "crystal": "HEX"},
    "Li": {"name": "Lithium", "crystal": "BCC"},
    "Lu": {"name": "Lutetium", "crystal": "HEX"},
    "Mg": {"name": "Magnesium", "crystal": "HEX"},
    "Mn": {"name": "Manganese", "crystal": "CUB"},
    "Mo": {"name": "Molybdenum", "crystal": "BCC"},
    "N": {"name": "Nitrogen", "crystal": "HEX"},  # N2 molecule
    "Na": {"name": "Sodium", "crystal": "BCC"},
    "Nb": {"name": "Niobium", "crystal": "BCC"},
    "Nd": {"name": "Neodymium", "crystal": "HEX"},
    "Np": {"name": "Neptunium", "crystal": "ORC"},
    "O": {"name": "Oxygen", "crystal": "MCL"},  # O2 molecule
    "Os": {"name": "Osmium", "crystal": "HEX"},
    "P": {"name": "Phosphorus", "crystal": "CUB"},
    "Pa": {"name": "Protactinium", "crystal": "TET"},
    "Pb": {"name": "Lead", "crystal": "FCC"},
    "Pd": {"name": "Palladium", "crystal": "FCC"},
    "Pm": {"name": "Promethium", "crystal": "HEX"},
    "Pr": {"name": "Praseodymium", "crystal": "HEX"},
    "Pu": {"name": "Plutonium", "crystal": "MCL"},
    "Rb": {"name": "Rubidium", "crystal": "BCC"},
    "Re": {"name": "Rhenium", "crystal": "HEX"},
    "Rh": {"name": "Rhodium", "crystal": "FCC"},
    "Ru": {"name": "Ruthenium", "crystal": "HEX"},
    "S": {"name": "Sulfur", "crystal": "ORC"},
    "Sb": {"name": "Antimony", "crystal": "RHL"},
    "Sc": {"name": "Scandium", "crystal": "HEX"},
    "Se": {"name": "Selenium", "crystal": "HEX"},
    "Sm": {"name": "Samarium", "crystal": "RHL"},
    "Sn": {"name": "Tin", "crystal": "TET"},
    "Sr": {"name": "Strontium", "crystal": "FCC"},
    "Ta": {"name": "Tantalum", "crystal": "BCC"},
    "Tb": {"name": "Terbium", "crystal": "HEX"},
    "Tc": {"name": "Technetium", "crystal": "HEX"},
    "Te": {"name": "Tellurium", "crystal": "HEX"},
    "Th": {"name": "Thorium", "crystal": "FCC"},
    "Ti": {"name": "Titanium", "crystal": "HEX"},
    "Tl": {"name": "Thallium", "crystal": "HEX"},
    "Tm": {"name": "Thulium", "crystal": "HEX"},
    "U": {"name": "Uranium", "crystal": "ORC"},
    "V": {"name": "Vanadium", "crystal": "BCC"},
    "W": {"name": "Tungsten", "crystal": "BCC"},
    "Y": {"name": "Yttrium", "crystal": "HEX"},
    "Yb": {"name": "Ytterbium", "crystal": "FCC"},
    "Zn": {"name": "Zinc", "crystal": "HEX"},
    "Zr": {"name": "Zirconium", "crystal": "HEX"},
}


def copy_poscar_from_repo(element: str) -> str:
    """Copy POSCAR file from local cloned repo."""
    poscar_file = ELEMENTS_DIR / element.lower() / f"{element}.POSCAR"

    if not poscar_file.exists():
        raise FileNotFoundError(f"POSCAR not found: {poscar_file}")

    return poscar_file.read_text()


def generate_manifest_entry(element: str, is_molecular: bool = False) -> Dict:
    """Generate manifest.yml entry for an element."""
    elem_data = ELEMENT_DATA[element]
    crystal = elem_data["crystal"]

    entry = {
        "filename": f"{element.lower()}.poscar",
        "common_name": elem_data["name"],
        "source_id": f"elemental-{element}",
        "source": "ExabyteDB",
        "doi": "",
        "url": f"https://github.com/Exabyte-io/exabyte-benchmarks-suite-old/tree/master/structures/vasp/elements/{element.lower()}",
        "metadata": {"element": element},
        "tags": ["elemental"],
    }

    if is_molecular:
        entry.update({
            "lattice_type": "None",
            "space_group": "None",
            "dimensionality": "0D",
            "form_factor": "Molecule",
            "isNonPeriodic": True,
        })
    else:
        entry.update({
            "lattice_type": crystal,
            "space_group": "TBD",
            "dimensionality": "3D",
            "form_factor": "Bulk",
        })

    return entry


def generate_category_entry(element: str, is_molecular: bool = False) -> Dict:
    """Generate categories.yml entry for an element."""
    elem_data = ELEMENT_DATA[element]
    crystal = elem_data["crystal"]

    if is_molecular:
        filename = f"{element}-[{elem_data['name']}]-None_[None]_0D_[Molecule]-[elemental-{element}].json"
        categories = ["0D"]
    else:
        filename = f"{element}-[{elem_data['name']}]-{crystal}_[TBD]_3D_[Bulk]-[elemental-{element}].json"
        categories = ["3D", "bulk", "metal"]

    return {
        "filename": filename,
        "categories": categories
    }


def main():
    """Main function."""
    if not ELEMENTS_DIR.exists():
        print(f"❌ Local repo not found at {LOCAL_REPO}")
        print("Please clone: git clone git@github.com:Exabyte-io/exabyte-benchmarks-suite-old.git")
        sys.exit(1)

    # Parse arguments
    if len(sys.argv) == 1:
        print("Usage:")
        print("  Add specific elements:  python add_elemental_materials.py Al Fe Ti")
        print("  Add all elements:       python add_elemental_materials.py --all")
        sys.exit(0)

    # Determine which elements to process
    if sys.argv[1] == "--all":
        elements_to_add = [e for e in ELEMENT_DATA.keys() if e not in EXISTING_ELEMENTS]
    else:
        elements_to_add = [e for e in sys.argv[1:] if e in ELEMENT_DATA and e not in EXISTING_ELEMENTS]

    if not elements_to_add:
        print("❌ No valid elements specified or all already exist")
        sys.exit(1)

    print(f"Processing {len(elements_to_add)} elements: {', '.join(elements_to_add)}\n")

    # Load existing manifest and categories
    with open(MANIFEST_PATH, 'r') as f:
        manifest = yaml.safe_load(f)

    with open(CATEGORIES_PATH, 'r') as f:
        categories = yaml.safe_load(f)

    existing_ids = {s['source_id'] for s in manifest['sources']}

    # Process each element
    added = []
    for element in elements_to_add:
        try:
            is_molecular = element in MOLECULAR_ELEMENTS
            print(f"{element} ({ELEMENT_DATA[element]['name']}){' [MOLECULAR]' if is_molecular else ''}")

            # Check if already exists
            source_id = f"elemental-{element}"
            if source_id in existing_ids:
                print(f"  ⊘ Already in manifest\n")
                continue

            # Copy POSCAR
            poscar_content = copy_poscar_from_repo(element)
            poscar_path = ASSETS_DIR / f"{element.lower()}.poscar"
            poscar_path.write_text(poscar_content)
            print(f"  ✓ Copied POSCAR")

            # Add to manifest
            manifest_entry = generate_manifest_entry(element, is_molecular)
            manifest['sources'].append(manifest_entry)
            print(f"  ✓ Added to manifest")

            # Add to categories
            category_entry = generate_category_entry(element, is_molecular)
            categories['entities'].append(category_entry)
            print(f"  ✓ Added to categories")

            added.append(element)
            print()

        except Exception as e:
            print(f"  ❌ Error: {e}\n")
            continue

    # Save files
    if added:
        with open(MANIFEST_PATH, 'w') as f:
            yaml.dump(manifest, f, default_flow_style=False, sort_keys=False, allow_unicode=True)

        with open(CATEGORIES_PATH, 'w') as f:
            yaml.dump(categories, f, default_flow_style=False, sort_keys=False, allow_unicode=True)

        print(f"✓ Added {len(added)} elements: {', '.join(added)}")
        print(f"✓ Total materials: {len(manifest['sources'])}")
    else:
        print("No elements were added")


if __name__ == "__main__":
    main()
