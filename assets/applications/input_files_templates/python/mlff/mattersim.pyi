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
from ase.units import GPa
from mat3ra.made.tools.convert import to_ase
from mattersim.forcefield import MatterSimCalculator
from munch import Munch

os.environ['PYTORCH_KERNEL_CACHE_PATH'] = os.path.expanduser('~/pytorch_kernel_cache')
os.makedirs(os.environ['PYTORCH_KERNEL_CACHE_PATH'], exist_ok=True)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Running MatterSim on {device}")

# this way material is obtained from the job context
material_json = {% raw %}{{ MATERIAL }}{% endraw %}
material = to_ase(dict(material_json))

# alternatively, material can be defined via ase, e.g.:
# from ase.build import bulk
# material = bulk("Si", "diamond", a=5.43)

material.calc = MatterSimCalculator(device=device)
print(f"Energy (eV)                 = {material.get_potential_energy()}")
print(f"Energy per atom (eV/atom)   = {material.get_potential_energy()/len(material)}")
print(f"Forces of first atom (eV/A) = {material.get_forces()[0]}")
print(f"Stress[0][0] (eV/A^3)       = {material.get_stress(voigt=False)[0][0]}")
print(f"Stress[0][0] (GPa)          = {material.get_stress(voigt=False)[0][0] / GPa}")
