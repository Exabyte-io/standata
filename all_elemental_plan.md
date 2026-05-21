# Elemental Materials + Total Energy for Defect Formation Energy

## High-Level Plan
### 1. Add elemental materials to Standata
Only 1 in phase 1
Then 20 most used elements.
Then the rest

#### How to deal with molecules?
**Issue:** H2, O2, N2, F2, Cl2 exist as molecules
**Solution:** Molecule in a 10x10x10 Angstrom box (let's check for H2, O2 if WFN doesn't spill beyond PBC)

### 2. Upload materials to Platform 
#### When to upload?
**Issue:** Upon DB startup? Whenver it is added from Standata and saved to the platform?
**Solution:** We can save the top 20 most used elements to the platform manually (or with NB) as we debug it. Then they will be added as we or users load them from Standata and save to the platform.

#### Multiple Stable Phases
**Issue:** Some elements have multiple phases (C: graphite vs diamond, Fe: BCC vs FCC)
**Solution:** Use most stable at standard conditions, flag with `metadata.stable_phase: "BCC"`

### 3. Run "Total Energy" jobs for each
#### Settings Consistency
**Issue:** Elemental energies MUST use identical DFT settings as defect calculations
**Solution:** Version tag (`espresso:elemental:v1`) + documented standard settings for workflow (AI suggestion)

#### Convergence Criteria
**Issue:** What precision is "good enough" for reference energies?
**Solution:** EDIFF=1e-7, PREC=Accurate, KPPRA≥8000, verify |dE|<1meV (AI suggestion)

#### Magnetic Elements calculation (AI suggestion)
**Issue:** Fe, Ni, Co, Mn need spin-polarization
**Solution:** ISPIN=2, element-specific MAGMOM in workflow (AI suggestion)

#### Store job results on Platform
#### How to find the property for element?
**Issue:** Need to mark the elemental materials properties
**Solution:**  with a tag `curators` + `elemental_material`, group `espresso:elemental:v1` 

### 5. Other workflows query elemental energies by `element` in each material to find reference energies
#### How to use in the target WF?
Unit gets the ELEMENT_NAME from the material, uses it to find ELEMENT.exabyteId and then queries the Platform for the total energy:
QUERY= `{'exabyteId': ELEMENT.exabyteId, 'data.name': 'total_energy', 'group': {'$regex': 'espresso:elemental:v1'}}`

