# Standata

Standard data for digital materials R&D entities in the [ESSE](https://github.com/Exabyte-io/esse) data format.


## 1. Installation

### 1.1. Python

The package is compatible with Python 3.8+. It can be installed as a Python package either via PyPI:
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


## 5. Links

To be added here.
