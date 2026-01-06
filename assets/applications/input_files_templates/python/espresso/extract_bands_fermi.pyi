# ---------------------------------------------------------------- #
# Extract band indices near Fermi energy from band_structure       #
# This script expects fermi_energy and band_structure results      #
# ---------------------------------------------------------------- #
import json
from munch import Munch

# Data From Context
# -----------------
# fermi_energy: float (in eV) - from pw_scf result
# band_structure: Munch object with band energies - from pw_bands result

{% raw %}fermi_energy_value = {{ fermi_energy }}{% endraw %}
{% raw %}band_structure_data = {{ band_structure }}{% endraw %}

# Extract band energies at Gamma point (first k-point)
# band_structure format from QE parser:
# {
#   "name": "band_structure",
#   "xDataArray": [[kx, ky, kz], ...],  # k-points
#   "yDataSeries": [[e1_k1, e1_k2, ...], [e2_k1, e2_k2, ...], ...]  # energies per band
# }
# yDataSeries[band_index][kpoint_index] = energy

# Get energies at first k-point (Gamma, index 0) for all bands
y_data = band_structure_data.get('yDataSeries', [])
band_energies = [band_data[0] for band_data in y_data] if y_data else []

# Find bands near Fermi energy (1-based indices as QE expects)
valence_bands = [(i + 1, e) for i, e in enumerate(band_energies) if e <= fermi_energy_value]
conduction_bands = [(i + 1, e) for i, e in enumerate(band_energies) if e > fermi_energy_value]

if valence_bands:
    valence_index, valence_energy = max(valence_bands, key=lambda x: x[1])
else:
    valence_index = 1
    valence_energy = band_energies[0] if band_energies else 0.0

if conduction_bands:
    conduction_index, conduction_energy = min(conduction_bands, key=lambda x: x[1])
else:
    conduction_index = len(band_energies)
    conduction_energy = band_energies[-1] if band_energies else 0.0

result = {
    "band_below_fermi": valence_index,
    "band_above_fermi": conduction_index,
    "fermi_energy": fermi_energy_value,
    "valence_energy": valence_energy,
    "conduction_energy": conduction_energy,
    "total_bands": len(band_energies)
}

# Print to STDOUT for subsequent assignment unit
print(json.dumps(result, indent=4))
