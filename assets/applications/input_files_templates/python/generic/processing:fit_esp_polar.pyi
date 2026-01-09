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
MARGIN_FRACTION = 0.10
MIN_REGION_POINTS = 10


def detect_interface_position(y_data, x_data):
    n = len(y_data)
    margin = max(int(n * MARGIN_FRACTION), MIN_REGION_POINTS)
    if 2 * margin >= n:
        return x_data[n // 2], n // 2
    gradient = np.abs(np.gradient(y_data))
    window = max(n // 20, 3)
    smoothed = np.convolve(gradient, np.ones(window) / window, mode="same")
    search_start = margin
    search_end = n - margin
    search_region = smoothed[search_start:search_end]
    if len(search_region) == 0:
        return x_data[n // 2], n // 2
    interface_idx = search_start + np.argmax(search_region)
    return x_data[interface_idx], interface_idx


def get_bulk_regions(n_points, interface_idx):
    margin = max(int(n_points * MARGIN_FRACTION), MIN_REGION_POINTS // 2)
    left_start = margin
    left_end = max(left_start + MIN_REGION_POINTS, interface_idx - margin)
    if left_end <= left_start:
        left_end = min(interface_idx, left_start + MIN_REGION_POINTS)
    right_start = min(interface_idx + margin, n_points - margin - MIN_REGION_POINTS)
    right_end = n_points - margin
    if right_end <= right_start:
        right_start = max(interface_idx, right_end - MIN_REGION_POINTS)
    left_start = max(0, left_start)
    left_end = min(n_points, left_end)
    right_start = max(0, right_start)
    right_end = min(n_points, right_end)
    if left_end <= left_start:
        left_start = 0
        left_end = min(MIN_REGION_POINTS, interface_idx)
    if right_end <= right_start:
        right_start = max(interface_idx, n_points - MIN_REGION_POINTS)
        right_end = n_points
    return (left_start, left_end), (right_start, right_end)


def fit_linear_region(x_data, y_data, start_idx, end_idx):
    start_idx = max(0, int(start_idx))
    end_idx = min(len(x_data), int(end_idx))
    if end_idx <= start_idx:
        end_idx = start_idx + MIN_REGION_POINTS
    x_region = x_data[start_idx:end_idx]
    y_region = y_data[start_idx:end_idx]
    if len(x_region) < 2:
        return {"slope": 0.0, "intercept": float(np.mean(y_data)), "r_squared": 0.0, "std_err": 0.0}
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
