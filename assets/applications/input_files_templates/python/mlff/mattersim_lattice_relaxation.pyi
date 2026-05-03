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
from mattersim.forcefield.potential import MatterSimCalculator
from mattersim.applications.relax import Relaxer

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
