# Elemental Materials + Total Energy for Defect Formation Energy

## High-Level Plan
### 1. Add elemental materials to Standata
Only 1 in phase 1
Then 20 most used elements.
Then the rest
Myabe they should be marked with a tag or in metadata`elemental`?

#### 1.1.How to deal with molecules?
**Issue:** H2, O2, N2, F2, Cl2 exist as molecules
**Solution:** Molecule in a 10x10x10 Angstrom box (let's check for H2, O2 if WFN doesn't spill beyond PBC)

### 2. Upload materials to Platform 
#### 2.1.When to upload?
**Issue:** Upon DB startup? Whenver it is added from Standata and saved to the platform?
**Solution:** We can save the top 20 most used elements to the platform manually (or with NB) as we debug it. Then they will be added as we or users load them from Standata and save to the platform.

#### 2.2. Multiple Stable Phases
**Issue:** Some elements have multiple phases (C: graphite vs diamond, Fe: BCC vs FCC)
**Solution:** Use most stable at standard conditions, flag with `metadata.stable_phase: "BCC"`

### 3. Run "Total Energy" jobs for each
#### 3.1. Settings Consistency
**Issue:** Elemental energies MUST use identical DFT settings as defect calculations
**Solution:** Version tag (`espresso:elemental:v1`) + documented standard settings for workflow (AI suggestion)

#### 3.2. Convergence Criteria
**Issue:** What precision is "good enough" for reference energies?
**Solution:** EDIFF=1e-7, PREC=Accurate, KPPRA≥8000, verify |dE|<1meV (AI suggestion)

#### 3.3. Magnetic Elements calculation (AI suggestion)
**Issue:** Fe, Ni, Co, Mn need spin-polarization
**Solution:** ISPIN=2, element-specific MAGMOM in workflow (AI suggestion)

#### 3.4. Store job results on Platform
#### How to find the property for element?
**Issue:** Need to mark the elemental materials properties
**Solution:**  with a tag `curators` + `elemental_material`, group `espresso:elemental:v1` 

### 5. Other workflows query elemental energies by `element` in each material to find reference energies
#### 5.1. How to use in the target WF?
Unit gets the ELEMENT_NAME from the material, uses it to find ELEMENT.exabyteId (maybe it should have the metadata entry `elemental`?) and then queries the Platform for the total energy:
QUERY= `{'exabyteId': ELEMENT.exabyteId, 'data.name': 'total_energy', 'group': {'$regex': 'espresso:elemental:v1'}}`

## Detailed Plan

### 5. Get Elemental Energies
In the workflow:
```yaml
# shell/utils/get_elemental_energies.yml
name: Get Elemental Chemical Potentials
units:
  # 1. Extract unique elements from material
  - type: assignment
    config:
      name: extract-elements
      operand: ELEMENTS
      # MATERIAL.basis.elements is a list like [{"value": "Si"}, {"value": "O"}, {"value": "O"}]
      value: "list(set([e['value'] for e in MATERIAL.basis.elements]))"
      # Result: ELEMENTS = ["Si", "O"]
  
  # 2. Loop through each element and query for its energy
  - type: for_each
    config:
      name: query-elemental-energies
      iterator: ELEMENTS
      variable: ELEMENT
      units:
        - type: io
          config:
            name: io-elemental-energy
            source: api
            input:
              - endpoint: refined-properties
                endpoint_options:
                  params:
                    query: "{'metadata.element': ELEMENT, 'data.name': 'total_energy', 'group': {'$regex': 'espresso:elemental:v1'}}"
                    projection: "{'sort': {'precision.value': -1}, 'limit': 1}"
                name: DATA
        
        - type: assignment
          config:
            name: assign-mu
            operand: f"MU_{ELEMENT}"  # Creates MU_Si, MU_O, etc.
            value: "DATA[0].data.value if DATA else None"
  
  # 3. Assert all energies found
  - type: assertion
    config:
      statement: "all([f'MU_{e}' in globals() and globals()[f'MU_{e}'] is not None for e in ELEMENTS])"
      errorMessage: "Not all elemental energies found. Missing elements need total energy calculations."
```