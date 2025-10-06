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

The materials data is sourced from the [Materials Project](https://next-gen.materialsproject.org) for 3D materials and [2dmatpedia](http://www.2dmatpedia.org) for 2D materials. The structural data in POSCAR format is stored in the `sources/materials` directory alongside the `manifest.yml` file that contains the additional description and metadata for each material.

To add new materials to Standata, place the POSCAR file in the `sources/materials` directory and update the `manifest.yml` file with the new material's metadata. Then run to create the materials data:

```shell
python scripts/materials/create_materials.py
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

### 4.3. Adding New Entities (Models, Methods, Applications, Workflows)

Entity definitions (models, methods, applications, workflows) are compiled from YAML source files using custom YAML types such as `!combine` to generate multiple entity configurations from a single definition.
Source files are located in `{entity-type}/sources/` directories, and build scripts generate JSON files in corresponding `{entity-type}/data/` directories.

#### 4.3.1. Models

Models are defined in `models/sources/` directory. To add a new model:

1. Create or edit a YAML file in `models/sources/` (e.g., `models/sources/lda.yml`)
2. Use the `!combine` type to generate model configurations:

```yaml
modelConfigs: !combine
  name:
    template: 'DFT {{ categories.subtype | upper }} {{ parameters.functional }}'
  forEach:
    - !parameter
      key: parameters.functional
      values: ["pz", "pw", "vwn"]
  config:
    tags:
      - dft
      - lda
    categories:
      tier1: pb
      tier2: qm
      tier3: dft
      type: ksdft
      subtype: lda
```

3. Run the build command:

```shell
npm run build:models
```

#### 4.3.2. Methods

Methods are defined in `methods/sources/` directory with support for unit composition. To add a new method:

1. Create or edit a YAML file in `methods/sources/` (e.g., `methods/sources/pw_methods.yml`)
2. Define method units in `methods/sources/units/` if needed
3. Use `!combine` with `!parameter` to compose methods from units:

```yaml
!combine
name:
  template: '{{ units[0]["name"] }} Method'
forEach:
  - !parameter
    key: units
    action: push
    ref: methods/sources/units/pw.yml
config:
  categories:
    tier1: qm
    tier2: wf
```

4. Run the build command:

```shell
npm run build:methods
```

#### 4.3.3. Model-Method Compatibility

The model-method compatibility map is defined in `models/sources/modelMethodMap.yml`. To add compatibility rules:

1. Edit `models/sources/modelMethodMap.yml`
2. Define filter rules for model categories using nested structure:

```yaml
pb:
  qm:
    dft:
      ksdft:
        lda:
          - path: /qm/wf/none/pw/none
          - regex: /qm/wf/none/psp/.*
```

3. Run the build command:

```shell
npm run build:model-method-map
```

#### 4.3.4. Applications

Applications are defined in `applications/sources/` directory. To add a new application:

1. Add application configuration to `applications/sources/applications/application_data.yml`
2. Define templates in `applications/sources/templates/`
3. Run the build command:

```shell
npm run build:applications
```

#### 4.3.5. Workflows

Workflows and subworkflows are defined in `workflows/sources/` directory. To add new workflows:

1. Create YAML files in `workflows/sources/workflows/{application}/` for workflows
2. Create YAML files in `workflows/sources/subworkflows/{application}/` for subworkflows
3. Run the build command:

```shell
npm run build:workflows
```

#### 4.3.6. Custom YAML Types

The following custom YAML types are available for entity definitions:

- `!combine`: Creates multiple entity configurations from parameter combinations
- `!parameter`: Defines a parameter to iterate over with optional exclusions
- `!esse`: References ESSE schema definitions for validation and enum values
- `isOptional: true`: Makes a parameter optional, creating entities with and without it

For complete examples, see the source files in each entity's `sources/` directory.

For definitions of custom directives go to [code.js](https://github.com/Exabyte-io/code.js).

#### 4.3.7. Building All Entities

To rebuild all entities at once:

```shell
npm run build
```

## 5. Links
