# Standata


Examples of entity data structures in the [ESSE](https://github.com/Exabyte-io/esse) data format (Essential Source
of Schemas and Examples).

## Installation

### Python

The `standata` package is compatible with Python 3.8+. It can be installed as a Python package either via PyPI
or as an editable local installation as below.

```shell
pip install standata
```

Editable local installation in a virtual environment:
```shell
virtualenv .venv
source .venv/bin/activate
pip install -e PATH_TO_STANDATA_REPOSITORY
```

### Node

Standata can be installed as a Node.js package via NPM (node package manager).

```shell
npm install @exabyte-io/standata
```

## Script

### Python
The Python package adds a command line script `standata-symlinks` that creates a category-based file tree where
entity data files are symbolically linked in directories named after the categories associated with the entity.
The resulting file tree will be contained in a directory names `by_category`.
The script expects the (relative or absolute) path to an entity config file (`categories.yml`). The destination
of the file tree can be modified by passing the `--destination`/`-d` option.
```shell
# consult help page to view all options
standata-symlinks --help

# creates symbolic links in materials/by_category
standata-symlinks materials/categories.yml

# creates symbolic links for materials in tmp/by_category
standata-symlinks materials/categories.yml
```

### Node
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
