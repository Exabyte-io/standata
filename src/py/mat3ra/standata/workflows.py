import json

workflows_data = json.loads(r'''{"standataConfig":{"categories":{"application":["espresso","exabyteml","jupyterLab","nwchem","python","shell","vasp"],"property":["band_gap","band_gap_dos","band_structure","phonon_dispersions","reaction_energy_profile","total_energy"],"material_count":["single-material","multi-material"]},"entities":[{"filename":"total_energy.json","categories":["espresso","single-material","total_energy"]},{"filename":"band_gap.json","categories":["espresso","vasp","band_gap"]}]},"filesMapByName":{"total_energy.json":{"_id":"000000000000000000000000","name":"Total Energy","subworkflows":[{"_id":"000000000000000000000000","name":"Total Energy","application":{"_id":"00000000000000000","name":"espresso","version":"5.4.0","build":"Default","isDefault":true,"summary":"Quantum Espresso","updatedAt":"2023-08-17T23:02:20.494Z","shortName":"qe","hasAdvancedComputeOptions":true,"updatedBy":"0"},"properties":["atomic_forces","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force"],"model":{"type":"dft","subtype":"gga","method":{"type":"pseudopotential","subtype":"us","data":{}},"functional":{"slug":"pbe"}},"units":[{"type":"execution","name":"pw_scf","head":true,"results":[{"name":"atomic_forces"},{"name":"fermi_energy"},{"name":"pressure"},{"name":"stress_tensor"},{"name":"total_energy"},{"name":"total_energy_contributions"},{"name":"total_force"}],"monitors":[{"name":"standard_output"},{"name":"convergence_electronic"}],"flowchartId":"9c216f92-2917-47e5-8f09-8513ada8330a","preProcessors":[],"postProcessors":[],"application":{"_id":"00000000000000000","name":"espresso","version":"5.4.0","build":"Default","isDefault":true,"summary":"Quantum Espresso","updatedAt":"2023-08-17T23:02:20.494Z","shortName":"qe","hasAdvancedComputeOptions":true,"updatedBy":"0"},"executable":{"isDefault":true,"hasAdvancedComputeOptions":true,"postProcessors":["remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","charge_density_profile","density_of_states","fermi_energy","final_structure","magnetic_moments","potential_profile","pressure","reaction_energy_barrier","reaction_energy_profile","stress_tensor","total_energy","total_energy_contributions","total_force"],"name":"pw.x"},"flavor":{"isDefault":true,"input":[{"name":"pw_scf.in"}],"results":["atomic_forces","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force"],"monitors":["standard_output","convergence_electronic"],"applicationName":"espresso","executableName":"pw.x","name":"pw_scf","executable":{"isDefault":true,"hasAdvancedComputeOptions":true,"postProcessors":["remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","charge_density_profile","density_of_states","fermi_energy","final_structure","magnetic_moments","potential_profile","pressure","reaction_energy_barrier","reaction_energy_profile","stress_tensor","total_energy","total_energy_contributions","total_force"],"name":"pw.x"}},"status":"idle","statusTrack":[],"input":[{"content":"{% if subworkflowContext.MATERIAL_INDEX %}\n{%- set input = input.perMaterial[subworkflowContext.MATERIAL_INDEX] -%}\n{% endif -%}\n&CONTROL\n    calculation = 'scf'\n    title = ''\n    verbosity = 'low'\n    restart_mode = '{{ input.RESTART_MODE }}'\n    wf_collect = .true.\n    tstress = .true.\n    tprnfor = .true.\n    outdir = {% raw %}'{{ JOB_WORK_DIR }}/outdir'{% endraw %}\n    wfcdir = {% raw %}'{{ JOB_WORK_DIR }}/outdir'{% endraw %}\n    prefix = '__prefix__'\n    pseudo_dir = {% raw %}'{{ JOB_WORK_DIR }}/pseudo'{% endraw %}\n/\n&SYSTEM\n    ibrav = {{ input.IBRAV }}\n    nat = {{ input.NAT }}\n    ntyp = {{ input.NTYP }}\n    ecutwfc = {{ cutoffs.wavefunction }}\n    ecutrho = {{ cutoffs.density }}\n    occupations = 'smearing'\n    degauss = 0.005\n/\n&ELECTRONS\n    diagonalization = 'david'\n    diago_david_ndim = 4\n    diago_full_acc = .true.\n    mixing_beta = 0.3\n    startingwfc = 'atomic+random'\n/\n&IONS\n/\n&CELL\n/\nATOMIC_SPECIES\n{{ input.ATOMIC_SPECIES }}\nATOMIC_POSITIONS crystal\n{{ input.ATOMIC_POSITIONS }}\nCELL_PARAMETERS angstrom\n{{ input.CELL_PARAMETERS }}\nK_POINTS automatic\n{% for d in kgrid.dimensions %}{{d}} {% endfor %}{% for s in kgrid.shifts %}{{s}} {% endfor %}","name":"pw_scf.in","contextProviders":[{"name":"KGridFormDataManager"},{"name":"QEPWXInputDataManager"},{"name":"PlanewaveCutoffDataManager"}],"applicationName":"espresso","executableName":"pw.x","updatedAt":"2023-08-17T23:02:17.337Z","updatedBy":"0","rendered":"&CONTROL\n    calculation = 'scf'\n    title = ''\n    verbosity = 'low'\n    restart_mode = 'from_scratch'\n    wf_collect = .true.\n    tstress = .true.\n    tprnfor = .true.\n    outdir = '{{ JOB_WORK_DIR }}/outdir'\n    wfcdir = '{{ JOB_WORK_DIR }}/outdir'\n    prefix = '__prefix__'\n    pseudo_dir = '{{ JOB_WORK_DIR }}/pseudo'\n/\n&SYSTEM\n    ibrav = 0\n    nat = 2\n    ntyp = 1\n    ecutwfc = 40\n    ecutrho = 200\n    occupations = 'smearing'\n    degauss = 0.005\n/\n&ELECTRONS\n    diagonalization = 'david'\n    diago_david_ndim = 4\n    diago_full_acc = .true.\n    mixing_beta = 0.3\n    startingwfc = 'atomic+random'\n/\n&IONS\n/\n&CELL\n/\nATOMIC_SPECIES\nSi 28.0855 \nATOMIC_POSITIONS crystal\nSi  0.000000000 0.000000000 0.000000000 \nSi  0.250000000 0.250000000 0.250000000 \nCELL_PARAMETERS angstrom\n3.348920236 0.000000000 1.933500000\n1.116306745 3.157392278 1.933500000\n0.000000000 0.000000000 3.867000000\nK_POINTS automatic\n2 2 2 0 0 0 "}]}],"compute":null,"isDraft":false}],"units":[{"name":"Total Energy","type":"subworkflow","_id":"000000000000000000000000","flowchartId":"e9109d498900aad592ba68b5","status":"idle","statusTrack":[],"results":[],"monitors":[],"preProcessors":[],"postProcessors":[],"head":true,"schemaVersion":"2022.8.16","isDefault":false}],"properties":["atomic_forces","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force"],"isDefault":true,"hash":"b5ed1cf151e828dfec234c5bf1be5b02","isOutdated":false,"createdAt":"2017-11-04T06:32:04.926Z","updatedAt":"2023-08-17T23:05:45.202Z","workflows":[],"schemaVersion":"2022.8.16","tags":[],"owner":{"_id":"00000000000000000","slug":"user-000000","cls":"Account"},"creator":{"_id":"00000000000000000","slug":"exadmin","cls":"User"},"compute":null,"exabyteId":"00000000000000000","isEntitySet":false},"band_gap.json":{"_id":"00000000000000000","name":"Band Gap","subworkflows":[{"_id":"000000000000000000000000","name":"Band Gap","application":{"_id":"00000000000000000","name":"vasp","version":"5.3.5","build":"Default","isDefault":true,"summary":"Vienna Ab-initio Simulation Package","updatedAt":"2023-08-17T23:02:32.576Z","shortName":"vasp","isLicensed":true,"updatedBy":"0"},"properties":["total_energy","total_energy_contributions","pressure","fermi_energy","atomic_forces","total_force","stress_tensor","band_gaps","fermi_energy"],"model":{"type":"dft","subtype":"gga","method":{"type":"pseudopotential","subtype":"us","data":{}},"functional":{"slug":"pbe"}},"units":[{"type":"execution","name":"vasp","head":true,"results":[{"name":"total_energy"},{"name":"total_energy_contributions"},{"name":"pressure"},{"name":"fermi_energy"},{"name":"atomic_forces"},{"name":"total_force"},{"name":"stress_tensor"}],"monitors":[{"name":"standard_output"},{"name":"convergence_electronic"}],"flowchartId":"0d35c419-ba29-44e7-94f0-690ff1f7976b","preProcessors":[],"postProcessors":[],"application":{"_id":"00000000000000000","name":"vasp","version":"5.3.5","build":"Default","isDefault":true,"summary":"Vienna Ab-initio Simulation Package","updatedAt":"2023-08-17T23:02:32.576Z","shortName":"vasp","isLicensed":true,"updatedBy":"0"},"executable":{"isDefault":true,"postProcessors":["error_handler","prepare_restart","remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","band_structure","density_of_states","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force","zero_point_energy","final_structure","magnetic_moments","reaction_energy_barrier","reaction_energy_profile","potential_profile","charge_density_profile"],"name":"vasp"},"flavor":{"isDefault":true,"input":[{"name":"INCAR"},{"name":"KPOINTS"},{"name":"POSCAR"}],"results":["total_energy","total_energy_contributions","pressure","fermi_energy","atomic_forces","total_force","stress_tensor"],"monitors":["standard_output","convergence_electronic"],"applicationName":"vasp","executableName":"vasp","name":"vasp","executable":{"isDefault":true,"postProcessors":["error_handler","prepare_restart","remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","band_structure","density_of_states","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force","zero_point_energy","final_structure","magnetic_moments","reaction_energy_barrier","reaction_energy_profile","potential_profile","charge_density_profile"],"name":"vasp"}},"status":"idle","statusTrack":[],"input":[{"content":"ISMEAR = 0\nSIGMA  = 0.05\nLORBIT = 11","name":"INCAR","contextProviders":[{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.614Z","updatedBy":"0","rendered":"ISMEAR = 0\nSIGMA  = 0.05\nLORBIT = 11"},{"content":"Automatic mesh\n0\nGamma\n  {% for d in kgrid.dimensions %}{{d}} {% endfor %}\n  {% for s in kgrid.shifts %}{{s}} {% endfor %}","name":"KPOINTS","contextProviders":[{"name":"KGridFormDataManager"},{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.670Z","updatedBy":"0","rendered":"Automatic mesh\n0\nGamma\n  2 2 2 \n  0 0 0 "},{"content":"{{ input.POSCAR }}","name":"POSCAR","contextProviders":[{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.693Z","updatedBy":"0","rendered":"Silicon FCC\n1.0\n   3.348920000\t   0.000000000\t   1.933500000\n   1.116307000\t   3.157392000\t   1.933500000\n   0.000000000\t   0.000000000\t   3.867000000\nSi\n2\ndirect\n   0.000000000    0.000000000    0.000000000  Si\n   0.250000000    0.250000000    0.250000000  Si"}],"next":"061929a3-368a-4c42-95fd-4144d31b6692"},{"type":"execution","name":"vasp_nscf","head":false,"results":[{"name":"band_gaps"},{"name":"fermi_energy"}],"monitors":[{"name":"standard_output"},{"name":"convergence_electronic"}],"flowchartId":"061929a3-368a-4c42-95fd-4144d31b6692","preProcessors":[],"postProcessors":[],"application":{"_id":"00000000000000000","name":"vasp","version":"5.3.5","build":"Default","isDefault":true,"summary":"Vienna Ab-initio Simulation Package","updatedAt":"2023-08-17T23:02:32.576Z","shortName":"vasp","isLicensed":true,"updatedBy":"0"},"executable":{"isDefault":true,"postProcessors":["error_handler","prepare_restart","remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","band_structure","density_of_states","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force","zero_point_energy","final_structure","magnetic_moments","reaction_energy_barrier","reaction_energy_profile","potential_profile","charge_density_profile"],"name":"vasp"},"flavor":{"input":[{"name":"INCAR","templateName":"INCAR_BANDS"},{"name":"KPOINTS","templateName":"KPOINTS"},{"name":"POSCAR","templateName":"POSCAR"}],"results":["band_gaps","fermi_energy"],"monitors":["standard_output","convergence_electronic"],"applicationName":"vasp","executableName":"vasp","name":"vasp_nscf","executable":{"isDefault":true,"postProcessors":["error_handler","prepare_restart","remove_non_zero_weight_kpoints"],"monitors":["standard_output","convergence_ionic","convergence_electronic"],"results":["atomic_forces","band_gaps","band_structure","density_of_states","fermi_energy","pressure","stress_tensor","total_energy","total_energy_contributions","total_force","zero_point_energy","final_structure","magnetic_moments","reaction_energy_barrier","reaction_energy_profile","potential_profile","charge_density_profile"],"name":"vasp"}},"status":"idle","statusTrack":[],"input":[{"content":"ISMEAR = 0\nSIGMA = 0.05\nISTART = 1\nICHARG = 11","name":"INCAR","contextProviders":[{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.622Z","updatedBy":"0","rendered":"ISMEAR = 0\nSIGMA = 0.05\nISTART = 1\nICHARG = 11"},{"content":"Automatic mesh\n0\nGamma\n  {% for d in kgrid.dimensions %}{{d}} {% endfor %}\n  {% for s in kgrid.shifts %}{{s}} {% endfor %}","name":"KPOINTS","contextProviders":[{"name":"KGridFormDataManager"},{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.670Z","updatedBy":"0","rendered":"Automatic mesh\n0\nGamma\n  2 2 2 \n  0 0 0 "},{"content":"{{ input.POSCAR }}","name":"POSCAR","contextProviders":[{"name":"VASPInputDataManager"}],"applicationName":"vasp","executableName":"vasp","updatedAt":"2023-08-17T23:02:18.693Z","updatedBy":"0","rendered":"Silicon FCC\n1.0\n   3.348920000\t   0.000000000\t   1.933500000\n   1.116307000\t   3.157392000\t   1.933500000\n   0.000000000\t   0.000000000\t   3.867000000\nSi\n2\ndirect\n   0.000000000    0.000000000    0.000000000  Si\n   0.250000000    0.250000000    0.250000000  Si"}]}],"compute":null,"isDraft":false}],"units":[{"name":"Band Gap","type":"subworkflow","_id":"000000000000000000000000","flowchartId":"509bb16a21dfb6806cbf4022","status":"idle","statusTrack":[],"results":[],"monitors":[],"preProcessors":[],"postProcessors":[],"head":true,"schemaVersion":"2022.8.16","isDefault":false}],"properties":["total_energy","total_energy_contributions","pressure","fermi_energy","atomic_forces","total_force","stress_tensor","band_gaps","fermi_energy"],"hash":"9a0499d15894c106d6115c132f67b47c","isOutdated":false,"workflows":[],"schemaVersion":"2022.8.16","tags":[],"owner":{"_id":"00000000000000000","slug":"user-000000","cls":"Account"},"creator":{"_id":"00000000000000000","slug":"user-000000","cls":"User"},"compute":null,"exabyteId":"00000000000000000","isDefault":false,"isEntitySet":false,"createdAt":"2023-08-23T02:56:18.620Z","createdBy":"00000000000000000","updatedAt":"2023-08-23T02:56:18.894Z","updatedBy":"00000000000000000"}}}''')