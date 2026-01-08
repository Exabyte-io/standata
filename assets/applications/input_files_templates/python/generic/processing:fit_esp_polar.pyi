# ------------------------------------------------------------------ #
# This script fits linear regression to macroscopically averaged ESP #
# for polar interfaces, detecting interface position and calculating #
# ΔV by extrapolating fitted lines to the interface.                 #
#                                                                    #
# For polar interfaces (e.g., AlN/GaN (001), GaAs (001)), the ESP    #
# profile shows a slope due to internal electric field.              #
# Reference: Choudhary & Garrity, arXiv:2401.02021 (InterMat)        #
# ------------------------------------------------------------------ #
import json

import numpy as np
from scipy.stats import linregress


{% raw %}Y = np.array({{array_from_context}}){% endraw %}
{% raw %}{% if x_positions_from_context is defined %}
X = np.array({{x_positions_from_context}})
{% else %}
X = np.linspace(0, 1, len(Y))
{% endif %}{% endraw %}

N = len(Y)
MARGIN_FRACTION = 0.15
BULK_REGION_FRACTION = 0.30


def detect_interface_position(y_data, x_data):
    gradient = np.abs(np.gradient(y_data))
    window = max(len(gradient) // 20, 5)
    smoothed = np.convolve(gradient, np.ones(window) / window, mode="same")
    margin = int(len(y_data) * MARGIN_FRACTION)
    search_region = smoothed[margin:-margin]
    interface_idx = margin + np.argmax(search_region)
    return x_data[interface_idx], interface_idx


def get_bulk_regions(n_points, interface_idx):
    bulk_size = int(n_points * BULK_REGION_FRACTION)
    margin = int(n_points * MARGIN_FRACTION)
    left_end = max(margin, interface_idx - margin)
    left_start = max(margin, left_end - bulk_size)
    right_start = min(n_points - margin, interface_idx + margin)
    right_end = min(n_points - margin, right_start + bulk_size)
    return (left_start, left_end), (right_start, right_end)


def fit_linear_region(x_data, y_data, start_idx, end_idx):
    x_region = x_data[start_idx:end_idx]
    y_region = y_data[start_idx:end_idx]
    slope, intercept, r_value, _, std_err = linregress(x_region, y_region)
    return {"slope": slope, "intercept": intercept, "r_squared": r_value**2, "std_err": std_err}


interface_x, interface_idx = detect_interface_position(Y, X)
left_region, right_region = get_bulk_regions(N, interface_idx)
left_fit = fit_linear_region(X, Y, left_region[0], left_region[1])
right_fit = fit_linear_region(X, Y, right_region[0], right_region[1])
left_value_at_interface = left_fit["slope"] * interface_x + left_fit["intercept"]
right_value_at_interface = right_fit["slope"] * interface_x + right_fit["intercept"]
delta_v = left_value_at_interface - right_value_at_interface
left_electric_field = -left_fit["slope"]
right_electric_field = -right_fit["slope"]

result = {
    "interface_position": float(interface_x),
    "interface_index": int(interface_idx),
    "delta_v": float(delta_v),
    "left_value_at_interface": float(left_value_at_interface),
    "right_value_at_interface": float(right_value_at_interface),
    "left_fit": {
        "slope": float(left_fit["slope"]),
        "intercept": float(left_fit["intercept"]),
        "r_squared": float(left_fit["r_squared"]),
        "electric_field_eV_per_angstrom": float(left_electric_field),
    },
    "right_fit": {
        "slope": float(right_fit["slope"]),
        "intercept": float(right_fit["intercept"]),
        "r_squared": float(right_fit["r_squared"]),
        "electric_field_eV_per_angstrom": float(right_electric_field),
    },
    "left_region_indices": [int(left_region[0]), int(left_region[1])],
    "right_region_indices": [int(right_region[0]), int(right_region[1])],
}

print(json.dumps(result, indent=4))

