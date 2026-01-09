# ------------------------------------------------------------------ #
# This script fits linear regression to macroscopically averaged ESP #
# for polar interfaces, detecting interface position and calculating #
# ESP values by extrapolating fitted lines to the interface.         #
#                                                                    #
# Output format is compatible with find_extrema.pyi to enable        #
# drop-in replacement in VBO workflows.                              #
#                                                                    #
# For polar interfaces (e.g., AlN/GaN (001), GaAs (001)), the ESP    #
# profile shows a slope due to internal electric field.              #
# For non-polar interfaces, slope ≈ 0 and this reduces to flat avg. #
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
MARGIN_FRACTION = 0.10  # Exclude 10% from edges to avoid surface effects
MIN_REGION_POINTS = 10  # Minimum points needed for linear fit


def detect_interface_position(y_data, x_data):
    """Find interface position by locating maximum gradient in ESP profile.
    
    Uses gradient smoothing to identify the steepest change, which indicates
    the interface between two materials.
    """
    n = len(y_data)
    margin = max(int(n * MARGIN_FRACTION), MIN_REGION_POINTS)
    if 2 * margin >= n:
        return x_data[n // 2], n // 2
    
    # Calculate smoothed gradient to find interface
    gradient = np.abs(np.gradient(y_data))
    window = max(n // 20, 3)
    smoothed = np.convolve(gradient, np.ones(window) / window, mode="same")
    
    # Search for maximum gradient (interface) excluding margins
    search_start = margin
    search_end = n - margin
    search_region = smoothed[search_start:search_end]
    if len(search_region) == 0:
        return x_data[n // 2], n // 2
    interface_idx = search_start + np.argmax(search_region)
    return x_data[interface_idx], interface_idx


def get_bulk_regions(n_points, interface_idx):
    """Determine bulk-like regions on left and right sides for linear fitting.
    
    Ensures regions are far enough from interface and edges to capture
    representative bulk behavior.
    """
    margin = max(int(n_points * MARGIN_FRACTION), MIN_REGION_POINTS // 2)
    
    # Left bulk region: between left margin and interface
    left_start = margin
    left_end = max(left_start + MIN_REGION_POINTS, interface_idx - margin)
    if left_end <= left_start:
        left_end = min(interface_idx, left_start + MIN_REGION_POINTS)
    
    # Right bulk region: between interface and right margin
    right_start = min(interface_idx + margin, n_points - margin - MIN_REGION_POINTS)
    right_end = n_points - margin
    if right_end <= right_start:
        right_start = max(interface_idx, right_end - MIN_REGION_POINTS)
    
    # Ensure bounds are valid
    left_start = max(0, left_start)
    left_end = min(n_points, left_end)
    right_start = max(0, right_start)
    right_end = min(n_points, right_end)
    
    # Final fallback for edge cases
    if left_end <= left_start:
        left_start = 0
        left_end = min(MIN_REGION_POINTS, interface_idx)
    if right_end <= right_start:
        right_start = max(interface_idx, n_points - MIN_REGION_POINTS)
        right_end = n_points
    
    return (left_start, left_end), (right_start, right_end)


def fit_linear_region(x_data, y_data, start_idx, end_idx):
    """Fit linear regression to ESP data in specified region.
    
    Returns slope and intercept. For non-polar materials, slope ≈ 0.
    For polar materials, slope represents internal electric field.
    """
    start_idx = max(0, int(start_idx))
    end_idx = min(len(x_data), int(end_idx))
    if end_idx <= start_idx:
        end_idx = start_idx + MIN_REGION_POINTS
    
    x_region = x_data[start_idx:end_idx]
    y_region = y_data[start_idx:end_idx]
    
    # Fallback for insufficient data: return flat line at mean
    if len(x_region) < 2:
        return {"slope": 0.0, "intercept": float(np.mean(y_data)), "r_squared": 0.0}
    
    slope, intercept, r_value, _, _ = linregress(x_region, y_region)
    return {"slope": slope, "intercept": intercept, "r_squared": r_value**2}


# Main calculation: fit lines to bulk regions and extrapolate to interface
interface_x, interface_idx = detect_interface_position(Y, X)
left_region, right_region = get_bulk_regions(N, interface_idx)
left_fit = fit_linear_region(X, Y, left_region[0], left_region[1])
right_fit = fit_linear_region(X, Y, right_region[0], right_region[1])

# Extrapolate fitted lines to interface position to get ESP values
left_value_at_interface = left_fit["slope"] * interface_x + left_fit["intercept"]
right_value_at_interface = right_fit["slope"] * interface_x + right_fit["intercept"]

# Output in same format as find_extrema.pyi for compatibility
result = {
    "minima": [float(left_value_at_interface), float(right_value_at_interface)],
    "maxima": [],
}

print(json.dumps(result, indent=4))
