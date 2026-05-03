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
import shutil
from pathlib import Path
import numpy as np
import torch
from munch import Munch
from mat3ra.made.tools.convert import to_ase
from mattersim.forcefield.potential import MatterSimCalculator
from mattersim.applications.phonon import PhononWorkflow


if torch.cuda.is_available():
    device = "cuda"
    os.environ["PYTORCH_KERNEL_CACHE_PATH"] = os.path.expanduser("~/pytorch_kernel_cache")
    os.makedirs(os.environ["PYTORCH_KERNEL_CACHE_PATH"], exist_ok=True)
else:
    device = "cpu"
print(f"Running MatterSim on {device}")

# this way material is obtained from the job context
material_json = {% raw %}{{ MATERIAL }}{% endraw %}
material = to_ase(dict(material_json))

# alternatively, material can be defined via ase, e.g.:
# from ase.build import bulk
# material = bulk("Si", "diamond", a=5.43)

material.calc = MatterSimCalculator(device=device)

# Configure the Phonon Workflow
work_dir = "./"

ph = PhononWorkflow(
    atoms=material,
    find_prim = False,
    work_dir = work_dir,
    amplitude = 0.01,
    supercell_matrix = np.diag([4, 4, 4]),
)

has_imag, phonons = ph.run()
print(f"Has imaginary phonon: {has_imag}")

# Files: work_dir/Si2_phonon_dos.png -> ./phonon_dos.png
for f in Path(work_dir).glob("*_phonon_*.png"):
    new_name = f.name.split('_', 1)
    shutil.copy2(f, new_name)
