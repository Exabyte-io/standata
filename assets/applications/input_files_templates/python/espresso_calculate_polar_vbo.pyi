# ------------------------------------------------------------------ #
# Linear-fit VBO for polar interfaces                                #
# ------------------------------------------------------------------ #
# For polar slabs the macroscopic ESP is not flat in the bulk-like   #
# regions because of the internal electric field. This script fits   #
# the ESP over the slab regions and uses the fitted average values   #
# as the potential reference for the lineup term.                    #
# ------------------------------------------------------------------ #
import json
from types import SimpleNamespace

import ase.io
import matplotlib
import numpy as np
from mat3ra.made.material import Material
from mat3ra.made.tools.convert import from_ase
from scipy.stats import linregress

matplotlib.use("Agg")
import matplotlib.pyplot as plt

CHECKPOINT_FILE = "./.mat3ra/checkpoint"
INTERFACE_OUTPUT = "./pw_scf.out"
LEFT_OUTPUT = "./pw_scf.out-1"
RIGHT_OUTPUT = "./pw_scf.out-2"
PLOT_FILENAME = "polar_vbo_fit_interface.png"

{% raw %}
LEFT_SLAB_BOTTOM_Z = {{ LEFT_SLAB_BOTTOM_Z }}
LEFT_SLAB_TOP_Z = {{ LEFT_SLAB_TOP_Z }}
RIGHT_SLAB_BOTTOM_Z = {{ RIGHT_SLAB_BOTTOM_Z }}
RIGHT_SLAB_TOP_Z = {{ RIGHT_SLAB_TOP_Z }}
{% endraw %}


def load_material(path):
    atoms = ase.io.read(path, format="espresso-out")
    material = Material.create(from_ase(atoms))
    material.to_cartesian()
    return material


def auto_detect_slab_boundaries(interface_material, left_material):
    coords = interface_material.basis.coordinates.values
    elements = interface_material.basis.elements.values
    z_elements = sorted(zip([coord[2] for coord in coords], elements))
    n_left = len(left_material.basis.elements.values)

    left_bottom = z_elements[0][0]
    left_top = z_elements[n_left - 1][0]
    right_bottom = z_elements[n_left][0]
    right_top = z_elements[-1][0]
    return left_bottom, left_top, right_bottom, right_top


def get_region_indices(x_data, x_min, x_max):
    mask = (x_data >= x_min) & (x_data <= x_max)
    indices = np.where(mask)[0]
    if len(indices) == 0:
        return 0, len(x_data)
    return indices[0], indices[-1] + 1


def fit_and_average(x_data, y_data, start_idx, end_idx):
    x_region = x_data[start_idx:end_idx]
    y_region = y_data[start_idx:end_idx]

    if len(x_region) < 2:
        avg = float(np.mean(y_region)) if len(y_region) > 0 else 0.0
        return avg, 0.0, avg

    slope, intercept, _, _, _ = linregress(x_region, y_region)
    x_mid = (x_region[0] + x_region[-1]) / 2.0
    avg_value = slope * x_mid + intercept
    return float(avg_value), float(slope), float(intercept)


interface_material = load_material(INTERFACE_OUTPUT)
left_material = load_material(LEFT_OUTPUT)
right_material = load_material(RIGHT_OUTPUT)

auto_left_bottom, auto_left_top, auto_right_bottom, auto_right_top = auto_detect_slab_boundaries(
    interface_material, left_material
)

left_bottom_z = auto_left_bottom if LEFT_SLAB_BOTTOM_Z is None else float(LEFT_SLAB_BOTTOM_Z)
left_top_z = auto_left_top if LEFT_SLAB_TOP_Z is None else float(LEFT_SLAB_TOP_Z)
right_bottom_z = auto_right_bottom if RIGHT_SLAB_BOTTOM_Z is None else float(RIGHT_SLAB_BOTTOM_Z)
right_top_z = auto_right_top if RIGHT_SLAB_TOP_Z is None else float(RIGHT_SLAB_TOP_Z)

with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
    checkpoint_data = json.load(f)

local_scope = checkpoint_data["scope"]["local"]
global_scope = checkpoint_data["scope"]["global"]

profile_interface = SimpleNamespace(
    **local_scope["average-electrostatic-potential"]["average_potential_profile"]
)
profile_left = SimpleNamespace(
    **local_scope["average-electrostatic-potential-left"]["average_potential_profile"]
)
profile_right = SimpleNamespace(
    **local_scope["average-electrostatic-potential-right"]["average_potential_profile"]
)

vbm_left = global_scope.get("VBM_LEFT")
vbm_right = global_scope.get("VBM_RIGHT")

X = np.array(profile_interface.xDataArray)
Y = np.array(profile_interface.yDataSeries[1])

X_left = np.array(profile_left.xDataArray)
Y_left = np.array(profile_left.yDataSeries[1])
X_right = np.array(profile_right.xDataArray)
Y_right = np.array(profile_right.yDataSeries[1])

left_interface_start, left_interface_end = get_region_indices(X, left_bottom_z, left_top_z)
right_interface_start, right_interface_end = get_region_indices(X, right_bottom_z, right_top_z)

left_bulk_start, left_bulk_end = get_region_indices(X_left, left_bottom_z, left_top_z)
right_bulk_start, right_bulk_end = get_region_indices(X_right, right_bottom_z, right_top_z)

va_interface, slope_left, intercept_left = fit_and_average(X, Y, left_interface_start, left_interface_end)
vb_interface, slope_right, intercept_right = fit_and_average(X, Y, right_interface_start, right_interface_end)
va_bulk_left, _, _ = fit_and_average(X_left, Y_left, left_bulk_start, left_bulk_end)
vb_bulk_right, _, _ = fit_and_average(X_right, Y_right, right_bulk_start, right_bulk_end)

polar_esp_offset = (vb_interface - va_interface) - (vb_bulk_right - va_bulk_left)
vbo = polar_esp_offset if vbm_left is None or vbm_right is None else (vbm_left - vbm_right) + polar_esp_offset

plt.figure(figsize=(10, 6))
plt.plot(X, Y, label="Macroscopic Average Potential", linewidth=2)
plt.axvspan(left_bottom_z, left_top_z, color="red", alpha=0.2, label="Left Slab Region")
plt.axvspan(right_bottom_z, right_top_z, color="blue", alpha=0.2, label="Right Slab Region")

if left_interface_end > left_interface_start:
    x_fit_left = X[left_interface_start:left_interface_end]
    y_fit_left = slope_left * x_fit_left + intercept_left
    plt.plot(x_fit_left, y_fit_left, color="darkred", linestyle="--", linewidth=2, label="Fit Left Slab")

if right_interface_end > right_interface_start:
    x_fit_right = X[right_interface_start:right_interface_end]
    y_fit_right = slope_right * x_fit_right + intercept_right
    plt.plot(x_fit_right, y_fit_right, color="darkblue", linestyle="--", linewidth=2, label="Fit Right Slab")

plt.axhline(va_interface, color="red", linestyle=":", linewidth=2, label=f"Avg Left ESP = {va_interface:.3f} eV")
plt.axhline(vb_interface, color="blue", linestyle=":", linewidth=2, label=f"Avg Right ESP = {vb_interface:.3f} eV")
plt.xlabel("z-coordinate (A)", fontsize=12)
plt.ylabel("Macroscopic Average Potential (eV)", fontsize=12)
plt.title(f"Polar Interface VBO = {vbo:.3f} eV", fontsize=14, fontweight="bold")
plt.legend(loc="best", fontsize=10)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(PLOT_FILENAME, dpi=150, bbox_inches="tight")
plt.close()

result = {
    "valence_band_offset": float(vbo),
    "polar_esp_offset": float(polar_esp_offset),
    "interface_esp_left": float(va_interface),
    "interface_esp_right": float(vb_interface),
    "bulk_esp_left": float(va_bulk_left),
    "bulk_esp_right": float(vb_bulk_right),
    "vbm_left": None if vbm_left is None else float(vbm_left),
    "vbm_right": None if vbm_right is None else float(vbm_right),
    "used_auto_detected_boundaries": {
        "left_bottom": LEFT_SLAB_BOTTOM_Z is None,
        "left_top": LEFT_SLAB_TOP_Z is None,
        "right_bottom": RIGHT_SLAB_BOTTOM_Z is None,
        "right_top": RIGHT_SLAB_TOP_Z is None,
    },
    "boundaries": {
        "left_bottom_z": float(left_bottom_z),
        "left_top_z": float(left_top_z),
        "right_bottom_z": float(right_bottom_z),
        "right_top_z": float(right_top_z),
    },
}

print(json.dumps(result, indent=4))
