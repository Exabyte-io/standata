# ------------------------------------------------------------------ #
# Linear Fit of ESP for Polar Interface VBO Calculation              #
# ------------------------------------------------------------------ #
# Reference: Choudhary & Garrity, arXiv:2401.02021 (InterMat)        #
#                                                                    #
# For polar interfaces, ESP shows linear gradient in bulk regions    #
# due to internal electric field. We fit each slab region and use    #
# the average value of the fit as the bulk ESP reference.            #
#                                                                    #
# Input: Coordinates defining slab regions (from structure data)     #
#   - slab1_min, slab1_max: z-coordinates of first material region   #
#   - slab2_min, slab2_max: z-coordinates of second material region  #
#                                                                    #
# Output: Va, Vb - average ESP values for each slab region           #
# ------------------------------------------------------------------ #
import json

import numpy as np
from scipy.stats import linregress

# Data from context: macroscopic average potential profile
{% raw %}profile = {{average_potential_profile}}{% endraw %}

X = np.array(profile["xDataSeries"])  # z-coordinates (angstrom)
Y = np.array(profile["yDataSeries"][1])  # Macroscopic average V̄(z)

# Slab region coordinates (passed from workflow, set by user based on structure)
# These define z-coordinate ranges for fitting in each material region
{% raw %}SLAB1_MIN = float({{slab1_min}}){% endraw %}
{% raw %}SLAB1_MAX = float({{slab1_max}}){% endraw %}
{% raw %}SLAB2_MIN = float({{slab2_min}}){% endraw %}
{% raw %}SLAB2_MAX = float({{slab2_max}}){% endraw %}


def get_region_indices(x_data, x_min, x_max):
    """Get array indices corresponding to coordinate range."""
    mask = (x_data >= x_min) & (x_data <= x_max)
    indices = np.where(mask)[0]
    if len(indices) == 0:
        return 0, len(x_data)
    return indices[0], indices[-1] + 1


def fit_and_average(x_data, y_data, start_idx, end_idx):
    """
    Fit linear regression to region and return average value.
    
    The average of the fitted line equals the mean of y-values,
    but fitting helps smooth out oscillations and validates linearity.
    """
    x_region = x_data[start_idx:end_idx]
    y_region = y_data[start_idx:end_idx]
    
    if len(x_region) < 2:
        return float(np.mean(y_region)) if len(y_region) > 0 else 0.0
    
    slope, intercept, r_value, _, _ = linregress(x_region, y_region)
    
    # Average value of linear fit over the region
    # V_avg = (1/L) * integral(slope*x + intercept) = slope*x_mid + intercept
    x_mid = (x_region[0] + x_region[-1]) / 2.0
    avg_value = slope * x_mid + intercept
    
    return float(avg_value)


# Get indices for each slab region
slab1_start, slab1_end = get_region_indices(X, SLAB1_MIN, SLAB1_MAX)
slab2_start, slab2_end = get_region_indices(X, SLAB2_MIN, SLAB2_MAX)

# Fit and get average ESP for each slab
Va = fit_and_average(X, Y, slab1_start, slab1_end)
Vb = fit_and_average(X, Y, slab2_start, slab2_end)

# Output compatible with VBO workflow (same format as find_extrema.pyi)
result = {
    "minima": [Va, Vb],
    "maxima": [],
}

print(json.dumps(result, indent=4))
