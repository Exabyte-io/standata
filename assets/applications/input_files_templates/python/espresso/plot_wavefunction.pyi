# ---------------------------------------------------------------- #
#  Generate wavefunction plot from pp.x output                     #
#  And saves static                                                #
# ---------------------------------------------------------------- #

import json

import matplotlib
import numpy as np

matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt

# Load wavefunction data from pp.x output
data = np.loadtxt('wf_r.dat')
z = data[:, 0]
psi_r = data[:, 1]

# Calculate wavefunction amplitude
psi_amplitude = np.abs(psi_r)

# Create static PNG plot
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(z, psi_amplitude, 'b-', linewidth=2)
ax.set_xlabel('Position z (Å)', fontsize=12)
ax.set_ylabel('Wavefunction amplitude |ψ| (a.u.)', fontsize=12)
ax.set_title('Wavefunction along z-axis', fontsize=14)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('wf_r.png', dpi=150, bbox_inches='tight')
plt.close()

# Create potential_profile JSON for platform rendering
wavefunction_data = {
    "name": "wavefunction_amplitude",
    "xAxis": {
        "label": "Position",
        "units": "angstrom"
    },
    "xDataArray": z.tolist(),
    "yAxis": {
        "label": "Wavefunction Amplitude",
        "units": "a.u."
    },
    "yDataSeries": [psi_amplitude.tolist()]
}

# Print JSON to STDOUT (will be captured as potential_profile result)
print(json.dumps(wavefunction_data, indent=2))
