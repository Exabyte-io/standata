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

# Molecular elements (diatomic molecules - need isNonPeriodic: True)
MOLECULAR_ELEMENTS = {"H", "N", "O", "F", "Cl", "Br", "I"}

# Noble gases (monoatomic gases - also need isNonPeriodic: True and form_factor: Molecule)
NOBLE_GASES = {
    "He": {"name": "Helium", "crystal": "None"},
    "Ne": {"name": "Neon", "crystal": "None"},
    "Ar": {"name": "Argon", "crystal": "None"},
    "Kr": {"name": "Krypton", "crystal": "None"},
    "Xe": {"name": "Xenon", "crystal": "None"},
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


def generate_noble_gas_poscar(element: str) -> str:
    """Generate POSCAR for noble gas (single atom in cubic box)."""
    elem_data = NOBLE_GASES[element]
    poscar = f"""{element} atom in a box
1.0
12.0 0.0 0.0
0.0 12.0 0.0
0.0 0.0 12.0
{element}
1
cart
6.0 6.0 6.0
"""
    return poscar


def copy_poscar_from_repo(element: str) -> str:
    """Copy POSCAR file from local cloned repo."""
    poscar_file = ELEMENTS_DIR / element.lower() / f"{element}.POSCAR"

    if not poscar_file.exists():
        raise FileNotFoundError(f"POSCAR not found: {poscar_file}")

    return poscar_file.read_text()


def generate_manifest_entry(element: str, is_molecular: bool = False, is_noble_gas: bool = False) -> Dict:
    """Generate manifest.yml entry for an element."""
    # Get element data from appropriate dict
    if is_noble_gas:
        elem_data = NOBLE_GASES[element]
    else:
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

    if is_molecular or is_noble_gas:
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


def generate_category_entry(element: str, is_molecular: bool = False, is_noble_gas: bool = False) -> Dict:
    """Generate categories.yml entry for an element."""
    # Get element data from appropriate dict
    if is_noble_gas:
        elem_data = NOBLE_GASES[element]
    else:
        elem_data = ELEMENT_DATA[element]
    crystal = elem_data["crystal"]

    if is_molecular:
        # Diatomic molecules (H2, N2, O2, F2, Cl2, Br2, I2)
        # The unitCellFormula from ExPrESS will be X2, so filename uses X2
        filename = f"{element}2-[{elem_data['name']}]-None_[None]_0D_[Molecule]-[elemental-{element}].json"
        categories = ["0D"]
    elif is_noble_gas:
        # Monoatomic gases (He, Ne, Ar, Kr, Xe)
        # Single atom, so filename uses X (not X2)
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
        print("  Add only crystals:      python add_elemental_materials.py --crystal")
        print("  Add only noble gases:   python add_elemental_materials.py --noble")
        print("  Add only diatomic:      python add_elemental_materials.py --diatomic")
        sys.exit(0)

    # Determine which elements to process
    arg = sys.argv[1]

    if arg == "--all":
        # All elements: crystals + noble gases + diatomic molecules
        crystal_elements = [e for e in ELEMENT_DATA.keys() if e not in EXISTING_ELEMENTS and e not in MOLECULAR_ELEMENTS]
        molecular_elements = [e for e in MOLECULAR_ELEMENTS if e not in EXISTING_ELEMENTS]
        noble_elements = [e for e in NOBLE_GASES.keys() if e not in EXISTING_ELEMENTS]
        elements_to_add = crystal_elements + molecular_elements + noble_elements
    elif arg == "--crystal":
        # Only crystalline elements (exclude diatomic molecules)
        elements_to_add = [e for e in ELEMENT_DATA.keys()
                          if e not in EXISTING_ELEMENTS and e not in MOLECULAR_ELEMENTS]
    elif arg == "--noble":
        # Only noble gases
        elements_to_add = [e for e in NOBLE_GASES.keys() if e not in EXISTING_ELEMENTS]
    elif arg == "--diatomic":
        # Only diatomic molecules
        elements_to_add = [e for e in MOLECULAR_ELEMENTS if e not in EXISTING_ELEMENTS]
    else:
        # Specific elements by name
        elements_to_add = [e for e in sys.argv[1:]
                          if (e in ELEMENT_DATA or e in NOBLE_GASES) and e not in EXISTING_ELEMENTS]

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
            is_noble_gas = element in NOBLE_GASES
            elem_name = NOBLE_GASES[element]['name'] if is_noble_gas else ELEMENT_DATA[element]['name']
            label = ' [DIATOMIC]' if is_molecular else ' [NOBLE GAS]' if is_noble_gas else ''
            print(f"{element} ({elem_name}){label}")

            # Check if already exists
            source_id = f"elemental-{element}"
            if source_id in existing_ids:
                print(f"  ⊘ Already in manifest\n")
                continue

            # Generate or copy POSCAR
            if is_noble_gas:
                poscar_content = generate_noble_gas_poscar(element)
                print(f"  ✓ Generated POSCAR (12×12×12 box)")
            else:
                poscar_content = copy_poscar_from_repo(element)
                print(f"  ✓ Copied POSCAR")

            poscar_path = ASSETS_DIR / f"{element.lower()}.poscar"
            poscar_path.write_text(poscar_content)

            # Add to manifest
            manifest_entry = generate_manifest_entry(element, is_molecular, is_noble_gas)
            manifest['sources'].append(manifest_entry)
            print(f"  ✓ Added to manifest")

            # Add to categories
            category_entry = generate_category_entry(element, is_molecular, is_noble_gas)
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
