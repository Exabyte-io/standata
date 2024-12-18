import json

materials_data = json.loads(r'''{"standataConfig":{"categories":{"type":["semiconductor","solar energy material","storage medium","organic electronics","battery/energy storage","composite","polymer","metals & alloys","solvent","catalysis","consumer packaged goods","glass","ceramic"],"form_factor":["bulk","layer","interface"],"dimensionality":["0D","1D","2D","3D","4D"],"electrical_conductivity":["metal","semi-metal","semiconductor","insulator"],"magnetism":["ferromagnetic","anti-ferromagnetic","paramagnetic","diamagnetic","non-magnetic"],"superconductivity":["type I","type II"],"composition":["oxide","nitride","carbide"]},"entities":[{"filename":"C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json","categories":["2D","layer","semi-metal","non-magnetic"]},{"filename":"C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48].json","categories":["3D","bulk","semi-metal","non-magnetic","battery/energy storage"]},{"filename":"BN-[Hexagonal_Boron_Nitride]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-4991].json","categories":["2D","layer","insulator","non-magnetic"]},{"filename":"BN-[Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-7991].json","categories":["3D","bulk","insulator","non-magnetic"]},{"filename":"NaCl-[Sodium_Chloride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-22862].json","categories":["3D","bulk","insulator","non-magnetic"]},{"filename":"Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"Si-[Silicene]-HEX_[P-3m1]_2D_[Monolayer]-[2dm-5934].json","categories":["2D","layer","semiconductor","non-magnetic"]},{"filename":"WS2-[Tungsten_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-224].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3749].json","categories":["2D","layer","semiconductor","non-magnetic"]},{"filename":"Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23].json","categories":["3D","bulk","metal","ferromagnetic"]},{"filename":"Cu-[Copper]-FCC_[Fm-3m]_3D_[Bulk]-[mp-30].json","categories":["3D","bulk","metal","non-magnetic","metals & alloys"]},{"filename":"Au-[Gold]-FCC_[Fm-3m]_3D_[Bulk]-[mp-81].json","categories":["3D","bulk","metal","non-magnetic","metals & alloys"]},{"filename":"ZnO-[Zinc_Oxide]-HEX_[P6_3mc]_3D_[Bulk]-[mp-2133].json","categories":["3D","bulk","semiconductor","non-magnetic","oxide"]},{"filename":"Al2O3-[Sapphire]-RHL_[R-3c]_3D_[Bulk]-[mp-1143].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"SiO2-[Quartz]-HEX_[P3_121]_3D_[Bulk]-[mp-7000].json","categories":["3D","bulk","insulator","non-magnetic","oxide","glass"]},{"filename":"ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"HfO2-[Hafnium_IV_Oxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-352].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"Y2O3-[Yttrium_III_Oxide]-MCLC_[C2%2Fm]_3D_[Bulk]-[mp-558573].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"VO2-[Vanadium_IV_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-19094].json","categories":["3D","bulk","semiconductor","ferromagnetic","oxide"]},{"filename":"TiO2-[Titanium_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-2657].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"MoS2-[Molybdenum_Disulfide]-HEX_[P_3%2Fmmc]_3D_[Bulk]-[mp-2815].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"MoS2-[Molybdenum_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3150].json","categories":["2D","layer","semiconductor","non-magnetic"]},{"filename":"Te2Mo-[Molybdenum_Telluride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-602].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"Te2Mo-[Molybdenum_Telluride]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-5370].json","categories":["2D","layer","semiconductor","non-magnetic"]},{"filename":"WSe2-[Tungsten_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-1821].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"WSe2-[Tungsten_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3594].json","categories":["2D","layer","semiconductor","non-magnetic"]},{"filename":"GaN-[Gallium_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-804].json","categories":["3D","bulk","semiconductor","non-magnetic","nitride"]},{"filename":"GaAs-[Gallium_Arsenide]-FCC_[F-43m]_3D_[Bulk]-[mp-2534].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"AlN-[Aluminum_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-661].json","categories":["3D","bulk","insulator","non-magnetic","nitride","ceramic"]},{"filename":"TiN-[Titanium_Nitride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-492].json","categories":["3D","bulk","metal","non-magnetic","nitride","ceramic"]},{"filename":"C-[Diamond]-FCC_[Fd-3m]_3D_[Bulk]-[mp-66].json","categories":["3D","bulk","insulator","non-magnetic"]},{"filename":"Pt-[Platinum]-FCC_[Fm-3m]_3D_[Bulk]-[mp-126].json","categories":["3D","bulk","metal","non-magnetic","catalysis"]},{"filename":"SrTiO3-[Strontium_Titanate]-CUB_[Pm-3m]_3D_[Bulk]-[mp-5229].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"SiO2-[Cristobalite]-TET_[I-42d]_3D_[Bulk]-[mp-546794].json","categories":["3D","bulk","insulator","non-magnetic","oxide","glass"]},{"filename":"Si-[Silicon_(100)_surface_(reconstructed)]-TRI_[P1]_2D_[Surface]-[mavrl-si-100-r].json","categories":["2D","layer","semiconductor","non-magnetic"]}]},"filesMapByName":{"C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json":{"name":"C, Graphene, HEX (P6/mmm) 2D (Monolayer), 2dm-3993","lattice":{"type":"HEX","a":2.464955,"b":2.464956,"c":19.996729,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"C"},{"id":1,"value":"C"}],"coordinates":[{"id":0,"value":[0.333333,0.666667,0.5]},{"id":1,"value":[0.666667,0.333333,0.5]}]},"external":{"id":"2dm-3993","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-3993","origin":true},"isNonPeriodic":false},"C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48].json":{"name":"C, Graphite, HEX (P6_3/mmc) 3D (Bulk), mp-48","lattice":{"type":"HEX","a":2.467291,"b":2.467291,"c":7.803073,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"C"},{"id":1,"value":"C"},{"id":2,"value":"C"},{"id":3,"value":"C"}],"coordinates":[{"id":0,"value":[0,0,0.25]},{"id":1,"value":[0,0,0.75]},{"id":2,"value":[0.3333333,0.6666667,0.25]},{"id":3,"value":[0.6666667,0.3333333,0.75]}]},"external":{"id":"mp-48","source":"Materials Project","doi":"10.17188/1208406","url":"https://next-gen.materialsproject.org/materials/mp-48","origin":true},"isNonPeriodic":false},"BN-[Hexagonal_Boron_Nitride]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-4991].json":{"name":"BN, Hexagonal Boron Nitride, HEX (P6/mmm) 2D (Monolayer), 2dm-4991","lattice":{"type":"HEX","a":2.508995,"b":2.508996,"c":20,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"B"},{"id":1,"value":"N"}],"coordinates":[{"id":0,"value":[0,0,0.5]},{"id":1,"value":[0.333333,0.666667,0.5]}]},"external":{"id":"2dm-4991","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-4991","origin":true},"isNonPeriodic":false},"BN-[Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-7991].json":{"name":"BN, Boron Nitride, HEX (P6_3/mmc) 3D (Bulk), mp-7991","lattice":{"type":"HEX","a":2.5116,"b":2.5116,"c":8.267796,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"B"},{"id":1,"value":"B"},{"id":2,"value":"N"},{"id":3,"value":"N"}],"coordinates":[{"id":0,"value":[0.3333333,0.6666667,0.25]},{"id":1,"value":[0.6666667,0.3333333,0.75]},{"id":2,"value":[0,0,0.25]},{"id":3,"value":[0,0,0.75]}]},"external":{"id":"mp-7991","source":"Materials Project","doi":null,"url":"https://next-gen.materialsproject.org/materials/mp-7991","origin":true},"isNonPeriodic":false},"NaCl-[Sodium_Chloride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-22862].json":{"name":"NaCl, Sodium Chloride, FCC (Fm-3m) 3D (Bulk), mp-22862","lattice":{"type":"FCC","a":4.024635,"b":4.024635,"c":4.024635,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Na"},{"id":1,"value":"Cl"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.5,0.5,0.5]}]},"external":{"id":"mp-22862","source":"Materials Project","doi":"10.17188/1199028","url":"https://next-gen.materialsproject.org/materials/mp-22862","origin":true},"isNonPeriodic":false},"Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json":{"name":"Si, Silicon, FCC (Fd-3m) 3D (Bulk), mp-149","lattice":{"type":"FCC","a":3.866976,"b":3.866975,"c":3.866975,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"}],"coordinates":[{"id":0,"value":[0.875,0.875,0.875]},{"id":1,"value":[0.125,0.125,0.125]}]},"external":{"id":"mp-149","source":"Materials Project","doi":"10.17188/1190959","url":"https://next-gen.materialsproject.org/materials/mp-149","origin":true},"isNonPeriodic":false},"Si-[Silicene]-HEX_[P-3m1]_2D_[Monolayer]-[2dm-5934].json":{"name":"Si, Silicene, HEX (P-3m1) 2D (Monolayer), 2dm-5934","lattice":{"type":"HEX","a":3.875909,"b":3.875457,"c":20.688228,"alpha":90,"beta":90,"gamma":120.0039,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"}],"coordinates":[{"id":0,"value":[0.833322,0.666644,0.487728]},{"id":1,"value":[0.166679,0.333356,0.512272]}]},"external":{"id":"2dm-5934","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-5934","origin":true},"isNonPeriodic":false},"WS2-[Tungsten_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-224].json":{"name":"WS2, Tungsten Disulfide, HEX (P6_3/mmc) 3D (Bulk), mp-224","lattice":{"type":"HEX","a":3.190731,"b":3.19073,"c":14.2024,"alpha":90,"beta":90,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"W"},{"id":1,"value":"W"},{"id":2,"value":"S"},{"id":3,"value":"S"},{"id":4,"value":"S"},{"id":5,"value":"S"}],"coordinates":[{"id":0,"value":[0.6666667,0.6666667,0.75]},{"id":1,"value":[0.3333333,0.3333333,0.25]},{"id":2,"value":[0.6666667,0.6666667,0.139241]},{"id":3,"value":[0.3333333,0.3333333,0.639241]},{"id":4,"value":[0.6666667,0.6666667,0.360759]},{"id":5,"value":[0.3333333,0.3333333,0.860759]}]},"external":{"id":"mp-224","source":"Materials Project","doi":"10.17188/1197614","url":"https://next-gen.materialsproject.org/materials/mp-224","origin":true},"isNonPeriodic":false},"WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3749].json":{"name":"WS2, Tungsten Disulfide, HEX (P-6m2) 2D (Monolayer), 2dm-3749","lattice":{"type":"HEX","a":3.193434,"b":3.193434,"c":23.131045,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"W"},{"id":1,"value":"S"},{"id":2,"value":"S"}],"coordinates":[{"id":0,"value":[0,0,0.5]},{"id":1,"value":[0.333333,0.666667,0.568029]},{"id":2,"value":[0.333333,0.666667,0.431971]}]},"external":{"id":"2dm-3749","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-3749","origin":true},"isNonPeriodic":false},"Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23].json":{"name":"Ni, Nickel, FCC (Fm-3m) 3D (Bulk), mp-23","lattice":{"type":"FCC","a":2.478974,"b":2.478974,"c":2.478974,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Ni"}],"coordinates":[{"id":0,"value":[0,0,0]}]},"external":{"id":"mp-23","source":"Materials Project","doi":"10.17188/1199153","url":"https://next-gen.materialsproject.org/materials/mp-23","origin":true},"isNonPeriodic":false},"Cu-[Copper]-FCC_[Fm-3m]_3D_[Bulk]-[mp-30].json":{"name":"Cu, Copper, FCC (Fm-3m) 3D (Bulk), mp-30","lattice":{"type":"FCC","a":2.560619,"b":2.56062,"c":2.560619,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Cu"}],"coordinates":[{"id":0,"value":[0,0,0]}]},"external":{"id":"mp-30","source":"Materials Project","doi":"10.17188/1204433","url":"https://next-gen.materialsproject.org/materials/mp-30s","origin":true},"isNonPeriodic":false},"Au-[Gold]-FCC_[Fm-3m]_3D_[Bulk]-[mp-81].json":{"name":"Au, Gold, FCC (Fm-3m) 3D (Bulk), mp-81","lattice":{"type":"FCC","a":2.949546,"b":2.949546,"c":2.949546,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Au"}],"coordinates":[{"id":0,"value":[0,0,0]}]},"external":{"id":"mp-81","source":"Materials Project","doi":"10.17188/1307925","url":"https://next-gen.materialsproject.org/materials/mp-81","origin":true},"isNonPeriodic":false},"ZnO-[Zinc_Oxide]-HEX_[P6_3mc]_3D_[Bulk]-[mp-2133].json":{"name":"ZnO, Zinc Oxide, HEX (P6_3mc) 3D (Bulk), mp-2133","lattice":{"type":"HEX","a":3.289103,"b":3.289103,"c":5.306821,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Zn"},{"id":1,"value":"Zn"},{"id":2,"value":"O"},{"id":3,"value":"O"}],"coordinates":[{"id":0,"value":[0.6666667,0.3333333,0.500548]},{"id":1,"value":[0.3333333,0.6666667,0]},{"id":2,"value":[0.6666667,0.3333333,0.879762]},{"id":3,"value":[0.3333333,0.6666667,0.379762]}]},"external":{"id":"mp-2133","source":"Materials Project","doi":"10.17188/1196748","url":"https://next-gen.materialsproject.org/materials/mp-2133","origin":true},"isNonPeriodic":false},"Al2O3-[Sapphire]-RHL_[R-3c]_3D_[Bulk]-[mp-1143].json":{"name":"Al2O3, Sapphire, RHL (R-3c) 3D (Bulk), mp-1143","lattice":{"type":"RHL","a":5.177955,"b":5.177954,"c":5.177956,"alpha":55.2896,"beta":55.2896,"gamma":55.2896,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Al"},{"id":1,"value":"Al"},{"id":2,"value":"Al"},{"id":3,"value":"Al"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"}],"coordinates":[{"id":0,"value":[0.647904,0.647903,0.647903]},{"id":1,"value":[0.852097,0.852097,0.852097]},{"id":2,"value":[0.147904,0.147903,0.147903]},{"id":3,"value":[0.352097,0.352096,0.352096]},{"id":4,"value":[0.443855,0.056145,0.750001]},{"id":5,"value":[0.943855,0.250001,0.556145]},{"id":6,"value":[0.056144,0.75,0.443855]},{"id":7,"value":[0.750001,0.443856,0.056144]},{"id":8,"value":[0.25,0.556144,0.943855]},{"id":9,"value":[0.556144,0.943856,0.249999]}]},"external":{"id":"mp-1143","source":"Materials Project","doi":"10.17188/1187823","url":"https://next-gen.materialsproject.org/materials/mp-1143","origin":true},"isNonPeriodic":false},"SiO2-[Quartz]-HEX_[P3_121]_3D_[Bulk]-[mp-7000].json":{"name":"SiO2, Quartz, HEX (P3_121) 3D (Bulk), mp-7000","lattice":{"type":"HEX","a":5.021502,"b":5.021502,"c":5.51057,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"},{"id":2,"value":"Si"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"}],"coordinates":[{"id":0,"value":[0.523695,0.523695,0]},{"id":1,"value":[0,0.476305,0.6666667]},{"id":2,"value":[0.476305,0,0.3333333]},{"id":3,"value":[0.256094,0.414854,0.794543]},{"id":4,"value":[0.585146,0.84124,0.127877]},{"id":5,"value":[0.15876,0.743906,0.46121]},{"id":6,"value":[0.414854,0.256094,0.205457]},{"id":7,"value":[0.743906,0.15876,0.53879]},{"id":8,"value":[0.84124,0.585146,0.872123]}]},"external":{"id":"mp-7000","source":"Materials Project","doi":"10.17188/1272685","url":"https://next-gen.materialsproject.org/materials/mp-7000","origin":true},"isNonPeriodic":false},"ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858].json":{"name":"ZrO2, Zirconium Dioxide, MCL (P2_1/c) 3D (Bulk), mp-2858","lattice":{"type":"MCL","a":5.233649,"b":5.26846,"c":5.418476,"alpha":90,"beta":100.0548,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Zr"},{"id":1,"value":"Zr"},{"id":2,"value":"Zr"},{"id":3,"value":"Zr"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"}],"coordinates":[{"id":0,"value":[0.724019,0.95582,0.789744]},{"id":1,"value":[0.724019,0.54418,0.289744]},{"id":2,"value":[0.275981,0.45582,0.710256]},{"id":3,"value":[0.275981,0.04418,0.210256]},{"id":4,"value":[0.061015,0.180178,0.854613]},{"id":5,"value":[0.061015,0.319822,0.354613]},{"id":6,"value":[0.54701,0.255674,0.021936]},{"id":7,"value":[0.45299,0.755674,0.478064]},{"id":8,"value":[0.54701,0.244326,0.521936]},{"id":9,"value":[0.45299,0.744326,0.978064]},{"id":10,"value":[0.938985,0.680178,0.645387]},{"id":11,"value":[0.938985,0.819822,0.145387]}]},"external":{"id":"mp-2858","source":"Materials Project","doi":"10.17188/1202679","url":"https://next-gen.materialsproject.org/materials/mp-2858","origin":true},"isNonPeriodic":false},"HfO2-[Hafnium_IV_Oxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-352].json":{"name":"HfO2, Hafnium IV Oxide, MCL (P2_1/c) 3D (Bulk), mp-352","lattice":{"type":"MCL","a":5.142319,"b":5.195148,"c":5.326038,"alpha":90,"beta":99.6745,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Hf"},{"id":1,"value":"Hf"},{"id":2,"value":"Hf"},{"id":3,"value":"Hf"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"}],"coordinates":[{"id":0,"value":[0.275959,0.457319,0.707891]},{"id":1,"value":[0.724041,0.957319,0.792109]},{"id":2,"value":[0.724041,0.542681,0.292109]},{"id":3,"value":[0.275959,0.042681,0.207891]},{"id":4,"value":[0.448887,0.742603,0.977708]},{"id":5,"value":[0.551113,0.242603,0.522292]},{"id":6,"value":[0.551113,0.257397,0.022292]},{"id":7,"value":[0.448887,0.757397,0.477708]},{"id":8,"value":[0.067849,0.330122,0.347094]},{"id":9,"value":[0.932151,0.830122,0.152906]},{"id":10,"value":[0.932151,0.669878,0.652906]},{"id":11,"value":[0.067849,0.169878,0.847094]}]},"external":{"id":"mp-352","source":"Materials Project","doi":"10.17188/1206948","url":"https://next-gen.materialsproject.org/materials/mp-352","origin":true},"isNonPeriodic":false},"Y2O3-[Yttrium_III_Oxide]-MCLC_[C2%2Fm]_3D_[Bulk]-[mp-558573].json":{"name":"Y2O3, Yttrium III Oxide, MCLC (C2/m) 3D (Bulk), mp-558573","lattice":{"type":"MCLC","a":3.515998,"b":7.276947,"c":8.695337,"alpha":100.1007,"beta":90,"gamma":103.9801,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Y"},{"id":1,"value":"Y"},{"id":2,"value":"Y"},{"id":3,"value":"Y"},{"id":4,"value":"Y"},{"id":5,"value":"Y"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"},{"id":12,"value":"O"},{"id":13,"value":"O"},{"id":14,"value":"O"}],"coordinates":[{"id":0,"value":[0.635175,0.27035,0.488039]},{"id":1,"value":[0.364825,0.72965,0.511961]},{"id":2,"value":[0.032014,0.064029,0.814048]},{"id":3,"value":[0.691364,0.382729,0.137328]},{"id":4,"value":[0.308636,0.617271,0.862672]},{"id":5,"value":[0.967986,0.935971,0.185952]},{"id":6,"value":[0.127996,0.255992,0.281772]},{"id":7,"value":[0.825532,0.651064,0.030517]},{"id":8,"value":[0.793308,0.586615,0.37737]},{"id":9,"value":[0.470963,0.941926,0.342856]},{"id":10,"value":[0.529037,0.058074,0.657144]},{"id":11,"value":[0.5,0,0]},{"id":12,"value":[0.174468,0.348936,0.969483]},{"id":13,"value":[0.206692,0.413385,0.62263]},{"id":14,"value":[0.872004,0.744008,0.718228]}]},"external":{"id":"mp-558573","source":"Materials Project","doi":"10.17188/1272685","url":"https://next-gen.materialsproject.org/materials/mp-558573","origin":true},"isNonPeriodic":false},"VO2-[Vanadium_IV_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-19094].json":{"name":"VO2, Vanadium IV Oxide, TET (P4_2/mnm) 3D (Bulk), mp-19094","lattice":{"type":"TET","a":3.038141,"b":4.51531,"c":4.51531,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"V"},{"id":1,"value":"V"},{"id":2,"value":"O"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"}],"coordinates":[{"id":0,"value":[0.5,0.5,0.5]},{"id":1,"value":[0,0,0]},{"id":2,"value":[0.5,0.799236,0.200764]},{"id":3,"value":[0.5,0.200764,0.799236]},{"id":4,"value":[0,0.700764,0.700764]},{"id":5,"value":[0,0.299236,0.299236]}]},"external":{"id":"mp-19094","source":"Materials Project","doi":null,"url":"https://next-gen.materialsproject.org/materials/mp-19094","origin":true},"isNonPeriodic":false},"TiO2-[Titanium_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-2657].json":{"name":"TiO2, Titanium Oxide, TET (P4_2/mnm) 3D (Bulk), mp-2657","lattice":{"type":"TET","a":2.969203,"b":4.653272,"c":4.653272,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Ti"},{"id":1,"value":"Ti"},{"id":2,"value":"O"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"}],"coordinates":[{"id":0,"value":[0.5,0.5,0.5]},{"id":1,"value":[0,0,0]},{"id":2,"value":[0.5,0.19542,0.80458]},{"id":3,"value":[0.5,0.80458,0.19542]},{"id":4,"value":[0,0.30458,0.30458]},{"id":5,"value":[0,0.69542,0.69542]}]},"external":{"id":"mp-2657","source":"Materials Project","doi":null,"url":"https://next-gen.materialsproject.org/materials/mp-2657","origin":true},"isNonPeriodic":false},"MoS2-[Molybdenum_Disulfide]-HEX_[P_3%2Fmmc]_3D_[Bulk]-[mp-2815].json":{"name":"MoS2, Molybdenum Disulfide, HEX (P_3/mmc) 3D (Bulk), mp-2815","lattice":{"type":"HEX","a":3.192238,"b":3.192238,"c":13.37829,"alpha":90,"beta":90,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Mo"},{"id":1,"value":"Mo"},{"id":2,"value":"S"},{"id":3,"value":"S"},{"id":4,"value":"S"},{"id":5,"value":"S"}],"coordinates":[{"id":0,"value":[0.3333333,0.3333333,0.75]},{"id":1,"value":[0.6666667,0.6666667,0.25]},{"id":2,"value":[0.3333333,0.3333333,0.133082]},{"id":3,"value":[0.6666667,0.6666667,0.866914]},{"id":4,"value":[0.3333333,0.3333333,0.366918]},{"id":5,"value":[0.6666667,0.6666667,0.633086]}]},"external":{"id":"mp-2815","source":"Materials Project","doi":"10.17188/1202268","url":"https://next-gen.materialsproject.org/materials/mp-2815","origin":true},"isNonPeriodic":false},"MoS2-[Molybdenum_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3150].json":{"name":"MoS2, Molybdenum Disulfide, HEX (P-6m2) 2D (Monolayer), 2dm-3150","lattice":{"type":"HEX","a":3.196223,"b":3.196223,"c":23.12983,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Mo"},{"id":1,"value":"S"},{"id":2,"value":"S"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.5]},{"id":1,"value":[0.333333,0.666667,0.432137]},{"id":2,"value":[0.333333,0.666667,0.567863]}]},"external":{"id":"2dm-3150","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-3150","origin":true},"isNonPeriodic":false},"Te2Mo-[Molybdenum_Telluride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-602].json":{"name":"Te2Mo, Molybdenum Telluride, HEX (P6_3/mmc) 3D (Bulk), mp-602","lattice":{"type":"HEX","a":3.558711,"b":3.558711,"c":15.34665,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Te"},{"id":1,"value":"Te"},{"id":2,"value":"Te"},{"id":3,"value":"Te"},{"id":4,"value":"Mo"},{"id":5,"value":"Mo"}],"coordinates":[{"id":0,"value":[0.3333333,0.6666667,0.63208]},{"id":1,"value":[0.6666667,0.3333333,0.13208]},{"id":2,"value":[0.6666667,0.3333333,0.36792]},{"id":3,"value":[0.3333333,0.6666667,0.86792]},{"id":4,"value":[0.3333333,0.6666667,0.25]},{"id":5,"value":[0.6666667,0.3333333,0.75]}]},"external":{"id":"mp-602","source":"Materials Project","doi":null,"url":"https://next-gen.materialsproject.org/materials/mp-602","origin":true},"isNonPeriodic":false},"Te2Mo-[Molybdenum_Telluride]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-5370].json":{"name":"Te2Mo, Molybdenum Telluride, HEX (P-6m2) 2D (Monolayer), 2dm-5370","lattice":{"type":"HEX","a":3.567851,"b":3.56785,"c":23.619353,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Te"},{"id":1,"value":"Te"},{"id":2,"value":"Mo"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.576748]},{"id":1,"value":[0.666667,0.333333,0.423252]},{"id":2,"value":[0,0,0.5]}]},"external":{"id":"2dm-5370","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-5370","origin":true},"isNonPeriodic":false},"WSe2-[Tungsten_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-1821].json":{"name":"WSe2, Tungsten Diselenide, HEX (P6_3/mmc) 3D (Bulk), mp-1821","lattice":{"type":"HEX","a":3.327069,"b":3.327069,"c":15.06895,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"W"},{"id":1,"value":"W"},{"id":2,"value":"Se"},{"id":3,"value":"Se"},{"id":4,"value":"Se"},{"id":5,"value":"Se"}],"coordinates":[{"id":0,"value":[0.6666667,0.3333333,0.75]},{"id":1,"value":[0.3333333,0.6666667,0.25]},{"id":2,"value":[0.3333333,0.6666667,0.861569]},{"id":3,"value":[0.6666667,0.3333333,0.361569]},{"id":4,"value":[0.3333333,0.6666667,0.638431]},{"id":5,"value":[0.6666667,0.3333333,0.138431]}]},"external":{"id":"mp-1821","source":"Materials Project","doi":"10.17188/1192989","url":"https://next-gen.materialsproject.org/materials/mp-1821","origin":true},"isNonPeriodic":false},"WSe2-[Tungsten_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3594].json":{"name":"WSe2, Tungsten Diselenide, HEX (P-6m2) 2D (Monolayer), 2dm-3594","lattice":{"type":"HEX","a":3.330619,"b":3.330619,"c":23.362456,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"W"},{"id":1,"value":"Se"},{"id":2,"value":"Se"}],"coordinates":[{"id":0,"value":[0.333333,0.666667,0.5]},{"id":1,"value":[0,0,0.427982]},{"id":2,"value":[0,0,0.572018]}]},"external":{"id":"2dm-3594","source":"2dmatpedia","doi":"10.1038/s41597-019-0097-3","url":"http://www.2dmatpedia.org/2dmaterials/doc/2dm-3594","origin":true},"isNonPeriodic":false},"GaN-[Gallium_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-804].json":{"name":"GaN, Gallium Nitride, HEX (P6_3mc) 3D (Bulk), mp-804","lattice":{"type":"HEX","a":3.21629,"b":3.21629,"c":5.239962,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Ga"},{"id":1,"value":"Ga"},{"id":2,"value":"N"},{"id":3,"value":"N"}],"coordinates":[{"id":0,"value":[0.6666667,0.3333333,0.49912]},{"id":1,"value":[0.3333333,0.6666667,0]},{"id":2,"value":[0.6666667,0.3333333,0.87588]},{"id":3,"value":[0.3333333,0.6666667,0.37588]}]},"external":{"id":"mp-804","source":"Materials Project","doi":"10.17188/1268467","url":"https://next-gen.materialsproject.org/materials/mp-804","origin":true},"isNonPeriodic":false},"GaAs-[Gallium_Arsenide]-FCC_[F-43m]_3D_[Bulk]-[mp-2534].json":{"name":"GaAs, Gallium Arsenide, FCC (F-43m) 3D (Bulk), mp-2534","lattice":{"type":"FCC","a":4.065993,"b":4.065993,"c":4.065993,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Ga"},{"id":1,"value":"As"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.25,0.25,0.25]}]},"external":{"id":"mp-2534","source":"Materials Project","doi":"10.17188/1200591","url":"https://next-gen.materialsproject.org/materials/mp-2534","origin":true},"isNonPeriodic":false},"AlN-[Aluminum_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-661].json":{"name":"AlN, Aluminum Nitride, HEX (P6_3mc) 3D (Bulk), mp-661","lattice":{"type":"HEX","a":3.128588,"b":3.128588,"c":5.016955,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Al"},{"id":1,"value":"Al"},{"id":2,"value":"N"},{"id":3,"value":"N"}],"coordinates":[{"id":0,"value":[0.6666667,0.3333333,0.499287]},{"id":1,"value":[0.3333333,0.6666667,0]},{"id":2,"value":[0.6666667,0.3333333,0.880713]},{"id":3,"value":[0.3333333,0.6666667,0.380713]}]},"external":{"id":"mp-661","source":"Materials Project","doi":"10.17188/1268470","url":"https://next-gen.materialsproject.org/materials/mp-661","origin":true},"isNonPeriodic":false},"TiN-[Titanium_Nitride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-492].json":{"name":"TiN, Titanium Nitride, FCC (Fm-3m) 3D (Bulk), mp-492","lattice":{"type":"CUB","a":4.241247,"b":4.241247,"c":4.241247,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Ti"},{"id":1,"value":"Ti"},{"id":2,"value":"Ti"},{"id":3,"value":"Ti"},{"id":4,"value":"N"},{"id":5,"value":"N"},{"id":6,"value":"N"},{"id":7,"value":"N"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0,0.5,0.5]},{"id":2,"value":[0.5,0,0.5]},{"id":3,"value":[0.5,0.5,0]},{"id":4,"value":[0,0.5,0]},{"id":5,"value":[0,0,0.5]},{"id":6,"value":[0.5,0.5,0.5]},{"id":7,"value":[0.5,0,0]}]},"external":{"id":"mp-492","source":"Materials Project","doi":null,"url":"https://next-gen.materialsproject.org/materials/mp-492","origin":true},"isNonPeriodic":false},"C-[Diamond]-FCC_[Fd-3m]_3D_[Bulk]-[mp-66].json":{"name":"C, Diamond, FCC (Fd-3m) 3D (Bulk), mp-66","lattice":{"type":"CUB","a":3.560745,"b":3.560745,"c":3.560745,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"C"},{"id":1,"value":"C"},{"id":2,"value":"C"},{"id":3,"value":"C"},{"id":4,"value":"C"},{"id":5,"value":"C"},{"id":6,"value":"C"},{"id":7,"value":"C"}],"coordinates":[{"id":0,"value":[0,0,0.5]},{"id":1,"value":[0.25,0.25,0.75]},{"id":2,"value":[0,0.5,0]},{"id":3,"value":[0.25,0.75,0.25]},{"id":4,"value":[0.5,0,0]},{"id":5,"value":[0.75,0.25,0.25]},{"id":6,"value":[0.5,0.5,0.5]},{"id":7,"value":[0.75,0.75,0.75]}]},"external":{"id":"mp-66","source":"Materials Project","doi":"10.1063/1.4812323","url":"https://next-gen.materialsproject.org/materials/mp-66","origin":true},"isNonPeriodic":false},"Pt-[Platinum]-FCC_[Fm-3m]_3D_[Bulk]-[mp-126].json":{"name":"Pt, Platinum, FCC (Fm-3m) 3D (Bulk), mp-126","lattice":{"type":"CUB","a":3.94315,"b":3.94315,"c":3.94315,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Pt"},{"id":1,"value":"Pt"},{"id":2,"value":"Pt"},{"id":3,"value":"Pt"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0,0.5,0.5]},{"id":2,"value":[0.5,0,0.5]},{"id":3,"value":[0.5,0.5,0]}]},"external":{"id":"mp-126","source":"Materials Project","doi":"10.17188/1204433","url":"https://next-gen.materialsproject.org/materials/mp-126","origin":true},"isNonPeriodic":false},"SrTiO3-[Strontium_Titanate]-CUB_[Pm-3m]_3D_[Bulk]-[mp-5229].json":{"name":"SrTiO3, Strontium Titanate, CUB (Pm-3m) 3D (Bulk), mp-5229","lattice":{"type":"CUB","a":3.912701,"b":3.912701,"c":3.912701,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Sr"},{"id":1,"value":"Ti"},{"id":2,"value":"O"},{"id":3,"value":"O"},{"id":4,"value":"O"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.5,0.5,0.5]},{"id":2,"value":[0.5,0,0.5]},{"id":3,"value":[0.5,0.5,0]},{"id":4,"value":[0,0.5,0.5]}]},"external":{"id":"mp-5229","source":"Materials Project","doi":"10.17188/1263154","url":"https://next-gen.materialsproject.org/materials/mp-5229","origin":true},"isNonPeriodic":false},"SiO2-[Cristobalite]-TET_[I-42d]_3D_[Bulk]-[mp-546794].json":{"name":"SiO2, Cristobalite, TET (I-42d) 3D (Bulk), mp-546794","lattice":{"type":"TET","a":4.954581,"b":4.954581,"c":7.311342,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"},{"id":2,"value":"Si"},{"id":3,"value":"Si"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.5,0,0.75]},{"id":2,"value":[0.5,0.5,0.5]},{"id":3,"value":[0,0.5,0.25]},{"id":4,"value":[0.59678613,0.75,0.625]},{"id":5,"value":[0.75,0.09678613,0.875]},{"id":6,"value":[0.25,0.90321387,0.875]},{"id":7,"value":[0.40321387,0.25,0.625]},{"id":8,"value":[0.09678613,0.25,0.125]},{"id":9,"value":[0.25,0.59678613,0.375]},{"id":10,"value":[0.75,0.40321387,0.375]},{"id":11,"value":[0.90321387,0.75,0.125]}]},"external":{"id":"mp-546794","source":"Materials Project","doi":"10.17188/1267252","url":"https://next-gen.materialsproject.org/materials/mp-546794","origin":true},"isNonPeriodic":false},"Si-[Silicon_(100)_surface_(reconstructed)]-TRI_[P1]_2D_[Surface]-[mavrl-si-100-r].json":{"name":"Si, Silicon (100) surface (reconstructed), TRI (P1) 2D (Surface), mavrl-si-100-r","lattice":{"type":"ORC","a":7.733949,"b":3.866975,"c":21.874912,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"}},"basis":{"units":"crystal","elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"},{"id":2,"value":"Si"},{"id":3,"value":"Si"},{"id":4,"value":"Si"},{"id":5,"value":"Si"},{"id":6,"value":"Si"},{"id":7,"value":"Si"},{"id":8,"value":"Si"},{"id":9,"value":"Si"},{"id":10,"value":"Si"},{"id":11,"value":"Si"},{"id":12,"value":"Si"},{"id":13,"value":"Si"},{"id":14,"value":"Si"},{"id":15,"value":"Si"}],"coordinates":[{"id":0,"value":[0.991208,0,0.786609]},{"id":1,"value":[0.508313,0,0.775584]},{"id":2,"value":[0.997425,0.5,0.850596]},{"id":3,"value":[0.498162,0.5,0.83682]},{"id":4,"value":[0.264643,0.5,0.907008]},{"id":5,"value":[0.736349,0.5,0.90915]},{"id":6,"value":[0.307094,0,0.970707]},{"id":7,"value":[0.592885,0,0.941019]},{"id":8,"value":[0.157115,0,0.558981]},{"id":9,"value":[0.442906,0,0.529293]},{"id":10,"value":[0.013651,0.5,0.59085]},{"id":11,"value":[0.485357,0.5,0.592992]},{"id":12,"value":[0.251838,0.5,0.66318]},{"id":13,"value":[0.752575,0.5,0.649404]},{"id":14,"value":[0.241687,0,0.724416]},{"id":15,"value":[0.758792,0,0.713391]}]},"external":{"id":"mavrl-si-100-r","source":"Materials Virtual Lab","doi":"10.1038/sdata.2016.80","url":"https://crystalium.materialsvirtuallab.org/","origin":true},"isNonPeriodic":false}}}''')
