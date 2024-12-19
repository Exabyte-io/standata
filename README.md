# Standata

Standard data for digital materials R&D entities in the [ESSE](https://github.com/Exabyte-io/esse) data format.

## 1. Installation

### 1.1. Python

The package is compatible with Python 3.10+. It can be installed as a Python package either via PyPI:

```shell
pip install mat3ra-standata
```

Or as an editable local installation in a virtual environment after cloning the repository:

```shell
virtualenv .venv
source .venv/bin/activate
pip install -e PATH_TO_STANDATA_REPOSITORY
```

### 1.2. JavaScript

Standata can be installed as a Node.js package via NPM (node package manager).

```shell
npm install @mat3ra/standata
```

## 2. Usage

### 2.1. Python

```python
from mat3ra.standata.materials import materials_data
# This returns a list of JSON configs for all materials.
materialConfigs = materials_data["filesMapByName"].values();
```

### 2.2. JavaScript

```javascript
// Direct import can be used to avoid importing all data at once.
import data from "@mat3ra/standata/lib/runtime_data/materials";
// This creates a list of JSON configs for all materials.
const materialConfigs = Object.values(data.filesMapByName);
```

## 3. Conventions

#### 3.1. Runtime Modules

To avoid file system calls on the client, the entity categories and data structures are made available at runtime via
the files in `src/js/runtime_data`. These files are generated automatically using the following command:

```shell
npm run build:runtime-data
```

## 3.2. CLI Scripts for Creating Symlinks

### 3.2.1. Python

The Python package adds a command line script `create-symlinks` that creates a category-based file tree where
entity data files are symbolically linked in directories named after the categories associated with the entity.
The resulting file tree will be contained in a directory names `by_category`.
The script expects the (relative or absolute) path to an entity config file (`categories.yml`). The destination
of the file tree can be modified by passing the `--destination`/`-d` option.

```shell
# consult help page to view all options
create-symlinks --help
# creates symbolic links in materials/by_category
create-symlinks materials/categories.yml
# creates symbolic links for materials in tmp/by_category
create-symlinks materials/categories.yml -d tmp
```

### 3.2.1 JavaScript/Node

Analogous to the command line script in Python, the repository also features a script in
TypeScript (`src/js/cli.ts`) and (after transpiling) in JavaScript (`lib/cli.js`).
The script takes the entity config file as a mandatory positional argument and the
alternative location for the directory containing the symbolic links (`--destination`/`-d`).

```shell
# creates symbolic links in materials/by_category (node)
node lib/cli.js materials/categories.yml
# creates symbolic links in materials/by_category (ts-node)
ts-node src/js/cli.ts materials/categories.yml
# creates symbolic links for materials in tmp/by_category
ts-node src/js/cli.ts -d tmp materials/categories.yml
# run via npm
npm run build:categories -- materials/categories.yml
```

## 4. Development

See [ESSE](https://github.com/Exabyte-io/esse) for the notes about development and testing.

To develop, first, create a virtual environment and install the dev dependencies:

```shell
python -m venv .venv
source .venv/bin/activate
pip install ".[dev]"
```

### 4.1. Materials Source

The materials data is sourced from the [Materials Project](https://next-gen.materialsproject.org) for 3D materials and [2dmatpedia](http://www.2dmatpedia.org) for 2D materials. The structural data in POSCAR format is stored in the `materials/sources` directory alongside the `manifest.yml` file that contains the additional description and metadata for each material.

To add new materials to Standata, place the POSCAR file in the `materials/sources` directory and update the `manifest.yml` file with the new material's metadata. Then run to create the materials data:

```shell
python create_materials.py
```

### 4.2. Materials Naming Conventions

Our dataset's naming convention for materials is designed to provide a comprehensive description of each material, incorporating essential attributes such as chemical composition, common name, crystal structure, and unique identifiers.

### 4.2.1. Name Property Format

The format for the material name property is a structured representation that includes the chemical formula, common name, crystal system, space group, dimensionality, specific structure details, and a unique identifier. Each element in the name is separated by a comma and space.

Format:

```
{Chemical Formula}, {Common Name}, {Crystal System} ({Space Group}) {Dimensionality} ({Structure Detail}), {Unique Identifier}
```

**Examples**:

- Ni, Nickel, FCC (Fm-3m) 3D (Bulk), mp-23
- ZrO2, Zirconium Dioxide, MCL (P2_1/c) 3D (Bulk), mp-2858
- C, Graphite, HEX (P6_3/mmc) 3D (Bulk), mp-48
- C, Graphene, HEX (P6/mmm) 2D (Monolayer), mp-1040425

### 4.2.2. Filename Format

Filenames are derived from the name property through a slugification process, ensuring they are filesystem-friendly and easily accessible via URLs or command-line interfaces. This process involves converting the structured name into a standardized, URL-safe format that reflects the material's attributes.

Format:

```
{Chemical_Formula}-[{Common_Name}]-{Crystal_System}_[{Space_Group}]_
{Dimensionality}_[{Structure_Detail}]-[{Unique_Identifier}]
```

**Transformation Rules**:

Commas and Spaces: Replace `, ` (comma and space) with `-` (hyphen) and ` ` (space) with `_` (underscore).
Parentheses: Convert `(` and `)` into `[` and `]` respectively.
Special Characters: Encode characters such as `/` into URL-safe representations (e.g., `%2F`).
Brackets: Wrap common name and identifier parts in square brackets `[]`.

**Filename Examples**:

- Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23]
- ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858]
- C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48]
- C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[mp-1040425]

## 5. Links
