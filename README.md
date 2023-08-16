# template-definitions-js-py


A template for a dual repository (JavaScript and Python).

The GitHub workflow requires the following variables to be defined:

  - `secrets.BOT_GITHUB_TOKEN`
  - `secrets.BOT_GITHUB_KEY`

## Initialization

When creating a new repository from this template, follow the items on the following checklist:

  - [ ] In `pyproject.toml` update `project.name`, `project.description`, and `project.classifiers`
        (if applicable).
  - [ ] Add Python dependencies to `pyproject.toml`. The `requirements*.txt` files can be generated
        automatically using `pip-compile`.
  - [ ] In `./src/py` replace the `templator` directory with your Python package name.
  - [ ] Install `pre-commit` if not already present (e.g. `pip install pre-commit`).
  - [ ] In `package.json`, update `"name"` and `"description"`.
  - [ ] Add JS/TS dependencies as usual (`npm install <pkg>` or `npm install --save-dev <pkg>`).

### Pre-Commit Hooks

The pre-commit hooks are managed by the `pre-commit` tool (see [docs](https://pre-commit.com/)) in **both** Python
and JavaScript/TypeScript. In order to set up the pre-commit hooks in the JS/TS development flow similar to `husky`,
the `bootstrap.js` script was added. With `pre-commit` installed, running the `bootstrap.js` script is equivalent
to `husky install`. Note that the hooks are only activated when the package is installed locally (`npm install`)
and not when installed as a dependency.
