# ---------------------------------------------------------------- #
#                                                                  #
#  Utility functions for Mat3ra.com platform Python applications.  #
#                                                                  #
#  Will be used as follows:                                        #
#                                                                  #
#    1. organize all the utility functions in this single file     #
#                                                                  #
#  Add additional utility functions as needed.                     #
#                                                                  #
# ---------------------------------------------------------------- #

import json
import matplotlib.pyplot as plt
from ase.data import covalent_radii
from ase.visualize.plot import plot_atoms


def get_material_from_context_variable() -> dict:
    """Return the job's input material as a plain Python `dict`.

    The MATERIAL Jinja2 expression below is substituted by rupy at job
    submission; the surrounding raw markers shield it from the Standata
    build's Nunjucks pass, the raw triple-quoted Python string keeps Python
    from re-parsing the JSON's backslashes, and `json.loads` converts JSON
    true/false/null to Python.
    """
    return json.loads(r"""{% raw %}{{ MATERIAL | default({}) | tojson }}{% endraw %}""")


def save_structure_png(atoms, filename):
    """Render an ASE `Atoms` object to a PNG with annotated lattice info.

    The unit cell is shown in mode `2` (all twelve edges drawn).

    Parameters
    ----------
    atoms : ase.Atoms
        Structure to visualize. Must have a defined cell for the lattice
        caption to be meaningful.
    filename : str | os.PathLike
        Output path for the rendered PNG. Saved at 150 dpi with a tight
        bounding box.
    """
    fig, ax = plt.subplots(figsize=(8, 8))

    # Use smaller radii for atoms visualization
    current_radii = [covalent_radii[a.number] * 0.5 for a in atoms]

    # Plot atoms
    plot_atoms(atoms, ax, radii=current_radii, rotation="15x,45y,15z", show_unit_cell=2)

    # View settings
    ax.set_axis_off()
    ax.autoscale_view()

    # Add atom labels
    for a in atoms:
        label = f"{a.symbol} ({a.position[0]:.3f}, {a.position[1]:.3f}, {a.position[2]:.3f})"
        x_offset = a.position[0] + 1.0
        y_offset = a.position[1] + 0.5

        ax.text(
            x_offset,
            y_offset,
            label,
            fontsize=10,
            ha="left",
            va="bottom",
            bbox=dict(facecolor="white", alpha=0.7, edgecolor="none", pad=1),
        )

    # Add Lattice Vectors below the plot
    cell = atoms.get_cell()
    lattice_text = (
        f"Lattice Vectors:\n"
        f"a: [{cell[0,0]:.4f}, {cell[0,1]:.4f}, {cell[0,2]:.4f}]\n"
        f"b: [{cell[1,0]:.4f}, {cell[1,1]:.4f}, {cell[1,2]:.4f}]\n"
        f"c: [{cell[2,0]:.4f}, {cell[2,1]:.4f}, {cell[2,2]:.4f}]"
    )

    ax.text(
        0.5,
        -0.05,
        lattice_text,
        transform=ax.transAxes,
        fontsize=10,
        ha="center",
        va="top",
        family="monospace",
        bbox=dict(facecolor="ghostwhite", alpha=0.8, edgecolor="gray", boxstyle="round"),
    )

    plt.savefig(filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
