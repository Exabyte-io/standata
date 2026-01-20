#!/usr/bin/env python3
import glob
import os

template_dir = "assets/applications/input_files_templates/espresso"
files = glob.glob(f"{template_dir}/*.j2.in")

# Pattern 1: Standard pattern - add space before each item except first
old_pattern1 = "{% for d in kgrid.dimensions %}{{d}} {% endfor %}{% for s in kgrid.shifts %}{{s}} {% endfor %}"
new_pattern1 = "{%- for d in kgrid.dimensions -%}{% if not loop.first %} {% endif %}{{d}}{%- endfor -%} {%- for s in kgrid.shifts -%}{% if not loop.first %} {% endif %}{{s}}{%- endfor -%}"

# Pattern 2: pw_scf_hse.j2.in has conditional logic
old_pattern2 = "{% for d in kgrid.dimensions %}{% if d%2 == 0 %}{{d}} {% else %}{{d+1}} {% endif %}{% endfor %}{% for s in kgrid.shifts %}{{s}} {% endfor %}"
new_pattern2 = "{%- for d in kgrid.dimensions -%}{% if not loop.first %} {% endif %}{% if d%2 == 0 %}{{d}}{% else %}{{d+1}}{% endif %}{%- endfor -%} {%- for s in kgrid.shifts -%}{% if not loop.first %} {% endif %}{{s}}{%- endfor -%}"

updated = 0
for filepath in sorted(files):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Fix pattern 2 first (more specific)
    if old_pattern2 in content:
        content = content.replace(old_pattern2, new_pattern2)
        updated += 1
        print(f"Updated (pattern2): {os.path.basename(filepath)}")
    # Fix pattern 1
    elif old_pattern1 in content:
        content = content.replace(old_pattern1, new_pattern1)
        updated += 1
        print(f"Updated (pattern1): {os.path.basename(filepath)}")
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

print(f"\nTotal files updated: {updated}")
