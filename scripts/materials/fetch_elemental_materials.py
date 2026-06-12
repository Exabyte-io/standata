import os
from collections import defaultdict
from typing import Dict, List, Optional, Tuple

import requests
import typer
import yaml

MANIFEST_PATH = "assets/materials/manifest.yml"
SOURCES_PATH = "assets/materials"
MP_SUMMARY_URL = "https://api.materialsproject.org/materials/summary/"
MP_DOI_URL = "https://api.materialsproject.org/doi/"
MP_BASE_URL = "https://next-gen.materialsproject.org/materials"
MP_SOURCE = "MaterialsProject"
LEGACY_MPID_MAX = 3347529

added_elements = [
    # "Ni",
    # "Cu",
    # "Si",
    # "C",
    # "Ge",
    # "Pt",
    # "Au",
]

PHASE_1_ELEMENTS = [
    "Al",
    "As",
    "B",
    "Ga",
    "Hf",
    "Mo",
    "Na",
    "Nb",
    "S",
    "Se",
    "Sn",
    "Sr",
    "Te",
    "Ti",
    "V",
    "W",
    "Y",
    "Zn",
    "Zr",
]

PHASE_2_ELEMENTS = [
    # "Li",
    # "Be",
    # "Mg",
    # "P",
    # "K",
    # "Ca",
    # "Sc",
    # "Cr",
    # "Mn",
    # "Fe",
    # "Co",
    # "Rb",
    # "Ru",
    # "Rh",
    # "Pd",
    # "Ag",
    # "Cd",
    # "In",
    # "Sb",
    # "Cs",
    # "Ba",
    # "La",
    # "Ce",
    # "Re",
    # "Os",
    # "Ir",
    # "Hg",
    # "Tl",
    # "Pb",
     # "Bi",
]

NOBLE_DIATOMIC_ELEMENTS = [
    "O",
    "Cl",
    "N",
    # "H",
    # "F",
    # "Br",
    # "I",
    # "He",
    # "Ne",
    # "Ar",
    # "Kr",
    # "Xe",
    # "Rn",
]

ELEMENT_PHASES = {
    "phase_1": PHASE_1_ELEMENTS,
    "phase_2": PHASE_2_ELEMENTS,
    "noble_diatomic": NOBLE_DIATOMIC_ELEMENTS,
}

SUMMARY_FIELDS = [
    "material_id",
    "energy_above_hull",
    "structure",
    "symmetry",
    "formula_pretty",
    "nelements",
]

ELEMENT_NAMES = {
    "H": "Hydrogen",
    "He": "Helium",
    "Li": "Lithium",
    "Be": "Beryllium",
    "B": "Boron",
    "C": "Carbon",
    "N": "Nitrogen",
    "O": "Oxygen",
    "F": "Fluorine",
    "Ne": "Neon",
    "Na": "Sodium",
    "Mg": "Magnesium",
    "Al": "Aluminum",
    "Si": "Silicon",
    "P": "Phosphorus",
    "S": "Sulfur",
    "Cl": "Chlorine",
    "Ar": "Argon",
    "K": "Potassium",
    "Ca": "Calcium",
    "Sc": "Scandium",
    "Ti": "Titanium",
    "V": "Vanadium",
    "Cr": "Chromium",
    "Mn": "Manganese",
    "Fe": "Iron",
    "Co": "Cobalt",
    "Ni": "Nickel",
    "Cu": "Copper",
    "Zn": "Zinc",
    "Ga": "Gallium",
    "Ge": "Germanium",
    "As": "Arsenic",
    "Se": "Selenium",
    "Br": "Bromine",
    "Kr": "Krypton",
    "Rb": "Rubidium",
    "Sr": "Strontium",
    "Y": "Yttrium",
    "Zr": "Zirconium",
    "Nb": "Niobium",
    "Mo": "Molybdenum",
    "Tc": "Technetium",
    "Ru": "Ruthenium",
    "Rh": "Rhodium",
    "Pd": "Palladium",
    "Ag": "Silver",
    "Cd": "Cadmium",
    "In": "Indium",
    "Sn": "Tin",
    "Sb": "Antimony",
    "Te": "Tellurium",
    "I": "Iodine",
    "Xe": "Xenon",
    "Cs": "Cesium",
    "Ba": "Barium",
    "La": "Lanthanum",
    "Ce": "Cerium",
    "Pr": "Praseodymium",
    "Nd": "Neodymium",
    "Pm": "Promethium",
    "Sm": "Samarium",
    "Eu": "Europium",
    "Gd": "Gadolinium",
    "Tb": "Terbium",
    "Dy": "Dysprosium",
    "Ho": "Holmium",
    "Er": "Erbium",
    "Tm": "Thulium",
    "Yb": "Ytterbium",
    "Lu": "Lutetium",
    "Hf": "Hafnium",
    "Ta": "Tantalum",
    "W": "Tungsten",
    "Re": "Rhenium",
    "Os": "Osmium",
    "Ir": "Iridium",
    "Pt": "Platinum",
    "Au": "Gold",
    "Hg": "Mercury",
    "Tl": "Thallium",
    "Pb": "Lead",
    "Bi": "Bismuth",
    "Po": "Polonium",
    "At": "Astatine",
    "Rn": "Radon",
    "Fr": "Francium",
    "Ra": "Radium",
    "Ac": "Actinium",
    "Th": "Thorium",
    "Pa": "Protactinium",
    "U": "Uranium",
    "Np": "Neptunium",
    "Pu": "Plutonium",
    "Am": "Americium",
    "Cm": "Curium",
    "Bk": "Berkelium",
    "Cf": "Californium",
    "Es": "Einsteinium",
    "Fm": "Fermium",
    "Md": "Mendelevium",
    "No": "Nobelium",
    "Lr": "Lawrencium",
    "Rf": "Rutherfordium",
    "Db": "Dubnium",
    "Sg": "Seaborgium",
    "Bh": "Bohrium",
    "Hs": "Hassium",
    "Mt": "Meitnerium",
    "Ds": "Darmstadtium",
    "Rg": "Roentgenium",
    "Cn": "Copernicium",
    "Nh": "Nihonium",
    "Fl": "Flerovium",
    "Mc": "Moscovium",
    "Lv": "Livermorium",
    "Ts": "Tennessine",
    "Og": "Oganesson",
}

app = typer.Typer(add_completion=False)


def parse_elements(elements: Optional[str], phase: str) -> List[str]:
    if elements:
        return [symbol.strip() for symbol in elements.split(",") if symbol.strip()]
    if phase == "all":
        merged = []
        for phase_elements in ELEMENT_PHASES.values():
            merged.extend(phase_elements)
        return list(dict.fromkeys(merged))
    if phase not in ELEMENT_PHASES:
        raise typer.BadParameter(f"Unknown phase {phase!r}. Choose from: {', '.join(ELEMENT_PHASES)}, all")
    return ELEMENT_PHASES[phase]


def read_manifest_sources(manifest_path: str) -> List[Dict]:
    with open(manifest_path, "r") as file:
        manifest = yaml.safe_load(file)
    return manifest["sources"]


def write_manifest_sources(manifest_path: str, sources: List[Dict]) -> None:
    with open(manifest_path, "w") as file:
        yaml.safe_dump({"sources": sources}, file, sort_keys=False)


def get_existing_elemental_elements(sources: List[Dict]) -> Dict[str, Dict]:
    existing = {}
    for source in sources:
        element = source.get("metadata", {}).get("element")
        if element:
            existing[element] = source
    return existing


def alpha_id_to_int(alpha: str) -> int:
    value = 0
    for char in alpha.lower():
        value = value * 26 + (ord(char) - ord("a"))
    return value


def normalize_material_id(material_id: str) -> str:
    suffix = material_id.removeprefix("mp-")
    if suffix.isdigit():
        return material_id
    numeric = alpha_id_to_int(suffix)
    if numeric <= LEGACY_MPID_MAX:
        return f"mp-{numeric}"
    return material_id


def infer_lattice_type(crystal_system: str, space_group: str) -> str:
    if crystal_system == "cubic":
        if space_group.startswith(("Fm", "Fd", "F-")):
            return "FCC"
        if space_group.startswith(("Im", "Ia", "I-")):
            return "BCC"
        if space_group == "Pm-3m":
            return "CUB"
        return "FCC"
    mapping = {
        "hexagonal": "HEX",
        "trigonal": "RHL",
        "tetragonal": "TET",
        "orthorhombic": "ORC",
        "triclinic": "TRI",
    }
    if crystal_system == "monoclinic":
        return "MCLC" if space_group.startswith("C") else "MCL"
    return mapping.get(crystal_system, "ORC")


def get_site_element(site: Dict) -> str:
    species = site["species"]
    if isinstance(species, list):
        return species[0]["element"]
    return species["element"]


def get_site_abc(site: Dict) -> List[float]:
    return site.get("abc") or site["xyz"]


def structure_dict_to_poscar(material_id: str, structure: Dict) -> str:
    matrix = structure["lattice"]["matrix"]
    element_coords = defaultdict(list)
    for site in structure["sites"]:
        element_coords[get_site_element(site)].append(get_site_abc(site))

    elements = sorted(element_coords)
    lines = [material_id, "1.0"]
    for row in matrix:
        lines.append(f"{row[0]:18.9f} {row[1]:18.9f} {row[2]:18.9f}")
    lines.append(" ".join(elements))
    lines.append(" ".join(str(len(element_coords[element])) for element in elements))
    lines.append("direct")
    for element in elements:
        for abc in element_coords[element]:
            lines.append(f"{abc[0]:18.9f} {abc[1]:18.9f} {abc[2]:18.9f}")
    return "\n".join(lines)


def build_manifest_entry(
    material_id: str,
    element: str,
    lattice_type: str,
    space_group: str,
    doi: Optional[str],
) -> Dict:
    return {
        "filename": f"{material_id}.poscar",
        "common_name": ELEMENT_NAMES.get(element, element),
        "lattice_type": lattice_type,
        "space_group": space_group,
        "dimensionality": "3D",
        "form_factor": "Bulk",
        "source_id": material_id,
        "source": MP_SOURCE,
        "doi": doi,
        "url": f"{MP_BASE_URL}/{material_id}",
        "metadata": {"element": element},
        "tags": ["elemental"],
    }


def query_elemental_summaries(api_key: str, element: str) -> List[Dict]:
    response = requests.get(
        MP_SUMMARY_URL,
        headers={"X-API-KEY": api_key},
        params={
            "elements": element,
            "nelements": 1,
            "deprecated": False,
            "_fields": ",".join(SUMMARY_FIELDS),
            "_limit": 1000,
        },
        timeout=60,
    )
    response.raise_for_status()
    return response.json()["data"]


def material_id_sort_key(material_id: str) -> int:
    suffix = material_id.removeprefix("mp-")
    if suffix.isdigit():
        return int(suffix)
    return alpha_id_to_int(suffix)


def fetch_ground_state_element(api_key: str, element: str) -> Optional[Dict]:
    docs = query_elemental_summaries(api_key, element)
    if not docs:
        return None
    min_hull = min(doc["energy_above_hull"] for doc in docs)
    candidates = [doc for doc in docs if doc["energy_above_hull"] == min_hull]
    return min(candidates, key=lambda doc: material_id_sort_key(doc["material_id"]))


def fetch_material_doi(api_key: str, material_id: str, api_material_id: str) -> Optional[str]:
    for candidate in {material_id, api_material_id}:
        response = requests.get(
            MP_DOI_URL,
            headers={"X-API-KEY": api_key},
            params={"material_ids": candidate, "_fields": "doi,material_id"},
            timeout=60,
        )
        response.raise_for_status()
        data = response.json()["data"]
        if data and data[0].get("doi"):
            return data[0]["doi"]
    return None


def fetch_elemental_material(api_key: str, element: str) -> Tuple[str, str, Dict, float, str]:
    doc = fetch_ground_state_element(api_key, element)
    if doc is None:
        raise ValueError(f"No Materials Project entry found for element {element}")

    api_material_id = doc["material_id"]
    material_id = normalize_material_id(api_material_id)
    symmetry = doc["symmetry"]
    crystal_system = symmetry["crystal_system"].lower()
    space_group = symmetry["symbol"]
    lattice_type = infer_lattice_type(crystal_system, space_group)
    doi = fetch_material_doi(api_key, material_id, api_material_id)
    poscar = structure_dict_to_poscar(material_id, doc["structure"])
    manifest_entry = build_manifest_entry(material_id, element, lattice_type, space_group, doi)
    return material_id, poscar, manifest_entry, doc["energy_above_hull"], api_material_id


def write_poscar(sources_path: str, material_id: str, poscar: str) -> str:
    poscar_path = os.path.join(sources_path, f"{material_id}.poscar")
    with open(poscar_path, "w") as file:
        file.write(poscar)
        file.write("\n")
    return poscar_path


def remove_element_from_manifest(sources: List[Dict], element: str) -> List[Dict]:
    return [source for source in sources if source.get("metadata", {}).get("element") != element]


def process_element(
    api_key: str,
    element: str,
    sources_path: str,
    existing_elements: Dict[str, Dict],
    force: bool,
    dry_run: bool,
) -> Optional[Dict]:
    if element in existing_elements and not force:
        existing = existing_elements[element]
        typer.echo(f"Skipping {element}: already in manifest as {existing['source_id']}")
        return None

    material_id, poscar, manifest_entry, energy_above_hull, api_material_id = fetch_elemental_material(
        api_key, element
    )
    id_note = f" ({api_material_id})" if api_material_id != material_id else ""
    doi_note = f", DOI={manifest_entry['doi']}" if manifest_entry["doi"] else ", DOI=none"
    if dry_run:
        typer.echo(
            f"Would fetch {element} -> {material_id}{id_note} "
            f"({manifest_entry['lattice_type']} {manifest_entry['space_group']}, "
            f"E_hull={energy_above_hull:.4f} eV/atom{doi_note})"
        )
        return None

    poscar_path = write_poscar(sources_path, material_id, poscar)
    typer.echo(f"Wrote {poscar_path} (E_hull={energy_above_hull:.4f} eV/atom{doi_note})")
    return manifest_entry


def require_api_key() -> str:
    api_key = os.environ.get("MP_API_KEY")
    if not api_key:
        raise typer.BadParameter("Set MP_API_KEY environment variable with a Materials Project API key")
    return api_key


@app.command()
def main(
    elements: Optional[str] = typer.Option(
        None,
        "--elements",
        "-e",
        help="Comma-separated element symbols (overrides --phase)",
    ),
    phase: str = typer.Option(
        "all",
        "--phase",
        "-p",
        help="Element group: phase_1, phase_2, noble_diatomic, or all active phases",
    ),
    sources_path: str = typer.Option(SOURCES_PATH, help="Directory for POSCAR files"),
    manifest_path: str = typer.Option(MANIFEST_PATH, help="Path to materials manifest"),
    update_manifest: bool = typer.Option(
        True,
        "--update-manifest",
        help="Append new entries to manifest.yml",
    ),
    dry_run: bool = typer.Option(False, "--dry-run", help="Print actions without writing files"),
    force: bool = typer.Option(False, "--force", help="Replace existing POSCAR/manifest entries"),
):
    """
    Fetch ground-state elemental structures from Materials Project (next-gen API)
    and write POSCAR files for use with create_materials.py.
    """
    api_key = require_api_key()
    element_symbols = parse_elements(elements, phase)
    manifest_sources = read_manifest_sources(manifest_path)
    existing_elements = get_existing_elemental_elements(manifest_sources)
    new_entries = []

    for element in element_symbols:
        manifest_entry = process_element(
            api_key, element, sources_path, existing_elements, force, dry_run
        )
        if manifest_entry is None:
            continue
        if update_manifest:
            manifest_sources = remove_element_from_manifest(manifest_sources, element)
            manifest_sources.append(manifest_entry)
        else:
            new_entries.append(manifest_entry)

    if update_manifest and not dry_run:
        write_manifest_sources(manifest_path, manifest_sources)
        typer.echo(f"Updated {manifest_path}")
    elif new_entries and not dry_run:
        typer.echo("\nAdd the following entries to manifest.yml:\n")
        typer.echo(yaml.safe_dump(new_entries, sort_keys=False))

    if not dry_run:
        typer.echo("\nRun `python scripts/materials/create_materials.py` to generate material JSON files.")


if __name__ == "__main__":
    app()
