# ---------------------------------------------------------------- #
#                                                                  #
#  Example MatterSim calculation on Mat3ra.com platform            #
#                                                                  #
#  Will be used as follows:                                        #
#                                                                  #
#    1. runtime directory for this calculation is created          #
#    2. requirements.txt is used to create a virtual environment   #
#    3. virtual environment is activated                           #
#    4. python process running this script is started              #
#                                                                  #
#  Adjust the content below to include your code.                  #
#                                                                  #
# ---------------------------------------------------------------- #

import os
import torch
from munch import Munch
from mat3ra.made.tools.convert import to_ase
from mattersim.forcefield.potential import MatterSimCalculator
from mattersim.applications.relax import Relaxer
import matplotlib.pyplot as plt
from ase.visualize.plot import plot_atoms
from ase.data import covalent_radii

if torch.cuda.is_available():
    device = "cuda"
    os.environ["PYTORCH_KERNEL_CACHE_PATH"] = os.path.expanduser("~/pytorch_kernel_cache")
    os.makedirs(os.environ["PYTORCH_KERNEL_CACHE_PATH"], exist_ok=True)
else:
    device = "cpu"
print(f"Running MatterSim on {device}")

# this way material is obtained from the job context
material_json = {% raw %}{{ MATERIAL }}{% endraw %}
initial_structure = to_ase(dict(material_json))

# alternatively, material can be defined via ase, e.g.:
# from ase.build import bulk
# initial_structure = bulk("Si", "diamond", a=5.43)

initial_structure.calc = MatterSimCalculator(device=device)

# initialize the relaxation object
relaxer = Relaxer(
    optimizer="BFGS", # the optimization method
    filter="ExpCellFilter", # filter to apply to the cell
    constrain_symmetry=True, # whether to constrain the symmetry
)

is_converged, relaxed_structure = relaxer.relax(initial_structure, steps=500, fmax=0.01)

# save the structures to file
initial_structure.write("initial_structure.cif")
initial_structure.write("initial_structure.poscar")

relaxed_structure.write("relaxed_structure.cif")
relaxed_structure.write("relaxed_structure.poscar")

# save a comparison plot of the initial and final structures
def save_labeled_structure(atoms, filename):
    fig, ax = plt.subplots(figsize=(8, 8))

    # Use smaller radii for atoms visualization
    current_radii = [covalent_radii[a.number] * 0.5 for a in atoms]

    # Plot atoms
    plot_atoms(atoms, ax, radii=current_radii, rotation='0x,0y,0z', show_unit_cell=2)

    # View settings
    ax.set_axis_off()
    ax.autoscale_view()

    # Add atom labels
    for a in atoms:
        label = f"{a.symbol} ({a.position[0]:.3f}, {a.position[1]:.3f}, {a.position[2]:.3f})"
        x_offset = a.position[0] + 0.8
        y_offset = a.position[1] + 0.3

        ax.text(x_offset, y_offset, label,
                fontsize=10, ha='left', va='bottom',
                bbox=dict(facecolor='white', alpha=0.7, edgecolor='none', pad=1))

    # Add Lattice Vectors below the plot
    cell = atoms.get_cell()
    lattice_text = (
        f"Lattice Vectors:\n"
        f"a: [{cell[0,0]:.4f}, {cell[0,1]:.4f}, {cell[0,2]:.4f}]\n"
        f"b: [{cell[1,0]:.4f}, {cell[1,1]:.4f}, {cell[1,2]:.4f}]\n"
        f"c: [{cell[2,0]:.4f}, {cell[2,1]:.4f}, {cell[2,2]:.4f}]"
    )

    ax.text(0.5, -0.05, lattice_text, transform=ax.transAxes,
            fontsize=10, ha='center', va='top', family='monospace',
            bbox=dict(facecolor='ghostwhite', alpha=0.8, edgecolor='gray', boxstyle='round'))

    # Save with your specific filenames
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close(fig)
    print(f"Saved: {filename}")

save_labeled_structure(initial_structure, 'initial_structure.png')
save_labeled_structure(relaxed_structure, 'relaxed_structure.png')
