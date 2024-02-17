import json

materials_data = json.loads(r'''{"standataConfig":{"categories":{"type":["semiconductor","solar energy material","storage medium","organic electronics","battery/energy storage","composite","polymer","metals & alloys","solvent","catalysis","consumer packaged goods","glass","ceramic"],"form_factor":["bulk","surface","interface"],"dimensionality":["0D","1D","2D","3D","4D"],"electrical_conductivity":["metal","semi-metal","semiconductor","insulator"],"magnetism":["ferromagnetic","anti-ferromagnetic","paramagnetic","diamagnetic","non-magnetic"],"superconductivity":["type I","type II"],"composition":["oxide","nitride","carbide"]},"entities":[{"filename":"C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[mp-1040425].json","categories":["2D","surface","semi-metal","non-magnetic"]},{"filename":"BN-[Hexagonal_Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-984].json","categories":["2D","surface","insulator","non-magnetic"]},{"filename":"NaCl-[Sodium_Chloride]-CUB_[Fm-3m]_3D_[Bulk]-[mp-22862].json","categories":["3D","bulk","insulator","non-magnetic"]},{"filename":"Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json","categories":["3D","bulk","semiconductor"]},{"filename":"WS2-[Tungsten_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-224].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-7oJTkFFyBgNPRGe6M].json","categories":["2D","surface","semiconductor","non-magnetic"]},{"filename":"Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23].json","categories":["3D","bulk","metal","ferromagnetic"]},{"filename":"C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48].json","categories":["3D","bulk","semi-metal","non-magnetic","battery/energy storage"]},{"filename":"Cu-[Copper]-FCC_[Fm-3m]_3D_[Bulk]-[mp-30].json","categories":["3D","bulk","metal","non-magnetic","metals & alloys"]},{"filename":"Au-[Gold]-FCC_[Fm-3m]_3D_[Bulk]-[mp-81].json","categories":["3D","bulk","metal","non-magnetic","metals & alloys"]},{"filename":"ZnO-[Zinc_Oxide]-HEX_[P6_3mc]_3D_[Bulk]-[mp-2133].json","categories":["3D","bulk","semiconductor","non-magnetic","oxide"]},{"filename":"Al2O3-[Sapphire]-RHL_[R3c]_3D_[Bulk]-[mp-1143].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"SiO2-[Quartz]-HEX_[P3_121]_3D_[Bulk]-[mp-7000].json","categories":["3D","bulk","insulator","non-magnetic","oxide","glass"]},{"filename":"ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"HfO2-[Hafnium_IV_Oxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-352].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"Y2O3-[Yttrium_III_Oxide]-MCLC_[C2%2Fm]_3D_[Bulk]-[mp-558573].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"VO2-[Vanadium_IV_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-19094].json","categories":["3D","bulk","semiconductor","ferromagnetic","oxide"]},{"filename":"TiO2-[Titanium_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-2657].json","categories":["3D","bulk","insulator","non-magnetic","oxide"]},{"filename":"MoS2-[Molybdenum_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-2815].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"MoS2-[Molybdenum_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-bsq28woJc7dnZmvCt].json","categories":["2D","surface","semiconductor","non-magnetic"]},{"filename":"MoTe2-[Molybdenum_Telluride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-602].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"MoTe2-[Molybdenum_Telluride]-HEX_[P-6m2]_2D_[Monolayer]-[mp-602].json","categories":["2D","surface","semiconductor","non-magnetic"]},{"filename":"WSe2-[Tungsten_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-1821].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"WSe2-[Tungsten_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-a9GGgaoBdnCHPn9hs].json","categories":["2D","surface","semiconductor","non-magnetic"]},{"filename":"GaN-[Gallium_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-804].json","categories":["3D","bulk","semiconductor","non-magnetic","nitride"]},{"filename":"GaAs-[Gallium_Arsenide]-FCC_[F-43m]-[mp-2534].json","categories":["3D","bulk","semiconductor","non-magnetic"]},{"filename":"AlN-[Aluminum_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-661].json","categories":["3D","bulk","insulator","non-magnetic","nitride","ceramic"]}]},"filesMapByName":{"C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[mp-1040425].json":{"lattice":{"a":2.467291,"b":2.467291,"c":20,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[2.467291,0,0],"b":[-1.233645,2.136737,0],"c":[0,0,20],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"C"},{"id":1,"value":"C"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.333333,0.666667,0]}],"units":"crystal","cell":[[2.467291,0,0],[-1.2336454999999995,2.136736684528712,0],[0,0,20]],"constraints":[]},"name":"C, Graphene, HEX (P6/mmm) 2D (Monolayer), mp-1040425","isNonPeriodic":false,"external":{"id":"mp-1040425","source":"materials project","doi":"10.17188/1405723","url":"https://next-gen.materialsproject.org/materials/mp-1040425/","origin":true}},"BN-[Hexagonal_Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-984].json":{"lattice":{"a":2.50899515,"b":2.50899515,"c":7.71,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[2.467291,0,0],"b":[-1.233645,2.136737,0],"c":[0,0,7.71],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"B"},{"id":1,"value":"N"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.333333,0.666667,0]}],"units":"crystal","cell":[[2.467291,0,0],[-1.2336454999999995,2.136736684528712,0],[0,0,7.71]],"constraints":[]},"name":"BN, Hexagonal Boron Nitride, HEX (P6_3/mmc) 3D (Bulk), mp-984","isNonPeriodic":false,"external":{"id":"mp-984","source":"materials project","doi":"10.17188/1281942","url":"https://next-gen.materialsproject.org/materials/mp-984/","origin":true}},"NaCl-[Sodium_Chloride]-CUB_[Fm-3m]_3D_[Bulk]-[mp-22862].json":{"basis":{"elements":[{"id":0,"value":"Na"},{"id":1,"value":"Na"},{"id":2,"value":"Na"},{"id":3,"value":"Na"},{"id":4,"value":"Cl"},{"id":5,"value":"Cl"},{"id":6,"value":"Cl"},{"id":7,"value":"Cl"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0,0.5,0.5]},{"id":2,"value":[0.5,0,0.5]},{"id":3,"value":[0.5,0.5,0]},{"id":4,"value":[0,0,0.5]},{"id":5,"value":[0,0.5,0]},{"id":6,"value":[0.5,0,0]},{"id":7,"value":[0.5,0.5,0.5]}],"units":"crystal","cell":[[1,0,0],[0,1,0],[0,0,1]]},"lattice":{"a":5.58813,"b":5.58813,"c":5.58813,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"},"type":"CUB","vectors":{"a":[5.58813,0,0],"b":[0,5.58813,0],"c":[0,0,5.58813],"alat":1,"units":"angstrom"}},"name":"NaCl, Sodium Chloride, CUB (Fm-3m) 3D (Bulk), mp-22862","isNonPeriodic":false,"external":{"id":"mp-22862","source":"materials project","doi":"10.17188/1199028","url":"https://next-gen.materialsproject.org/materials/mp-22862/","origin":true}},"Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json":{"basis":{"elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.25,0.25,0.25]}]},"lattice":{"a":3.867,"b":3.867,"c":3.867,"alpha":60,"beta":60,"gamma":60,"type":"TRI","units":{"length":"angstrom","angle":"degree"}},"name":"Si, Silicon, FCC (Fd-3m) 3D (Bulk), mp-149","isNonPeriodic":false,"external":{"id":"mp-149","source":"materials project","doi":"10.17188/1190959","url":"https://next-gen.materialsproject.org/materials/mp-149/","origin":true}},"WS2-[Tungsten_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-224].json":{"lattice":{"a":3.184223,"b":3.184223,"c":12.97828,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.184223,0,0],"b":[-1.592111,2.757618,0],"c":[0,0,12.97828],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"W"},{"id":1,"value":"W"},{"id":2,"value":"S"},{"id":3,"value":"S"},{"id":4,"value":"S"},{"id":5,"value":"S"}],"coordinates":[{"id":0,"value":[0.3333333333333333,0.6666666666666666,0.25]},{"id":1,"value":[0.6666666666666667,0.3333333333333334,0.75]},{"id":2,"value":[0.3333333333333333,0.6666666666666666,0.6298049400000001]},{"id":3,"value":[0.6666666666666667,0.3333333333333333,0.1298049400000001]},{"id":4,"value":[0.3333333333333333,0.6666666666666667,0.8701950599999999]},{"id":5,"value":[0.6666666666666667,0.3333333333333334,0.3701950599999999]}],"units":"crystal","cell":[[3.184223,0,1.949774252360691e-16],[-1.5921114999999995,2.7576180093146965,1.949774252360691e-16],[0,0,12.97828]],"constraints":[]},"name":"WS2, Tungsten Disulfide, HEX (P6_3/mmc) 3D (Bulk), mp-224","isNonPeriodic":false,"external":{"id":"mp-224","source":"materials project","doi":"10.17188/1197614","url":"https://next-gen.materialsproject.org/materials/mp-224/","origin":true}},"WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-7oJTkFFyBgNPRGe6M].json":{"lattice":{"a":3.184222,"b":3.184222,"c":12.97828,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[1.5921114461115318,-2.7576179159771317,0],"b":[1.5921114461115318,2.7576179159771317,0],"c":[0,0,12.97828236],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"W"},{"id":1,"value":"S"},{"id":2,"value":"S"}],"coordinates":[{"id":0,"value":[0.333333,0.666667,0.120195]},{"id":1,"value":[0,0,0]},{"id":2,"value":[0,0,0.24039]}],"units":"crystal","cell":[[1.5921114461115318,-2.7576179159771317,0],[1.5921114461115318,2.7576179159771317,0],[0,0,12.97828236]],"constraints":[]},"name":"WS2, Tungsten Disulfide, HEX (P-6m2) 2D (Monolayer), m3-7oJTkFFyBgNPRGe6M","isNonPeriodic":false,"external":{"id":"7oJTkFFyBgNPRGe6M","source":"mat3ra","url":"https://platform.mat3ra.com/bank/materials/7oJTkFFyBgNPRGe6M","origin":true}},"Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23].json":{"basis":{"elements":[{"id":0,"value":"Ni"}],"coordinates":[{"id":0,"value":[0,0,0]}],"units":"crystal","cell":[[2.1304222786341884,0,1.2300003718288512],[0.7101406879862482,2.008581639681698,1.2300000000000002],[0,0,2.46]],"constraints":[{"id":0,"value":[true,true,true]}]},"lattice":{"a":2.46,"b":2.46,"c":2.46,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"},"type":"FCC","vectors":{"a":[2.130422,0,1.23],"b":[0.7101407,2.008582,1.23],"c":[0,0,2.46],"alat":1,"units":"angstrom"}},"name":"Ni, Nickel, FCC (Fm-3m) 3D (Bulk), mp-23","isNonPeriodic":false,"external":{"id":"mp-23","source":"materials project","url":"https://next-gen.materialsproject.org/materials/mp-23/","origin":true}},"C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48].json":{"lattice":{"a":2.467291,"b":2.467291,"c":7.803073,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[2.467291,0,0],"b":[-1.233645,2.136737,0],"c":[0,0,7.803073],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"C"},{"id":1,"value":"C"},{"id":2,"value":"C"},{"id":3,"value":"C"}],"coordinates":[{"id":0,"value":[0,0,0.25]},{"id":1,"value":[0,0,0.75]},{"id":2,"value":[0.3333333333333333,0.6666666666666666,0.25]},{"id":3,"value":[0.6666666666666667,0.3333333333333334,0.75]}],"units":"crystal","cell":[[2.467291,0,1.5107800128575361e-16],[-1.2336454999999997,2.1367366845287115,1.5107800128575361e-16],[0,0,7.803073]],"constraints":[]},"name":"C, Graphite, HEX (P6_3/mmc) 3D (Bulk), mp-48","isNonPeriodic":false,"external":{"id":"mp-48","source":"materials project","doi":"10.17188/1208406","url":"https://next-gen.materialsproject.org/materials/mp-48/","origin":true}},"Cu-[Copper]-FCC_[Fm-3m]_3D_[Bulk]-[mp-30].json":{"lattice":{"a":2.560619,"b":2.560619,"c":2.560619,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"},"type":"FCC","vectors":{"a":[2.217561,0,1.28031],"b":[0.739187,2.090737,1.28031],"c":[0,0,2.560619],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Cu"}],"coordinates":[{"id":0,"value":[0,0,0]}],"units":"crystal","cell":[[2.2175611034131055,0,1.2803095000000002],[0.7391870344710353,2.0907366585585727,1.2803095000000002],[0,0,2.560619]],"constraints":[]},"name":"Cu, Copper, FCC (Fm-3m) 3D (Bulk), mp-30","isNonPeriodic":false,"external":{"id":"mp-30","source":"materials project","doi":"10.17188/1204433","url":"https://next-gen.materialsproject.org/materials/mp-30/","origin":true}},"Au-[Gold]-FCC_[Fm-3m]_3D_[Bulk]-[mp-81].json":{"lattice":{"a":2.949546,"b":2.949546,"c":2.949546,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"},"type":"FCC","vectors":{"a":[2.554382,0,1.474773],"b":[0.8514606,2.408294,1.474773],"c":[0,0,2.949546],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Au"}],"coordinates":[{"id":0,"value":[0,0,0]}],"units":"crystal","cell":[[2.5543817656307755,0,1.4747730000000001],[0.851460588543592,2.40829422428905,1.4747730000000001],[0,0,2.949546]],"constraints":[]},"name":"Au, Gold, FCC (Fm-3m) 3D (Bulk), mp-81","isNonPeriodic":false,"external":{"id":"mp-81","source":"materials project","doi":"10.17188/1307925","url":"https://next-gen.materialsproject.org/materials/mp-81/","origin":true}},"ZnO-[Zinc_Oxide]-HEX_[P6_3mc]_3D_[Bulk]-[mp-2133].json":{"lattice":{"a":3.289103,"b":3.289103,"c":5.306821,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.289103,0,0],"b":[-1.644551,2.848447,0],"c":[0,0,5.306821],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Zn"},{"id":1,"value":"Zn"},{"id":2,"value":"O"},{"id":3,"value":"O"}],"coordinates":[{"id":0,"value":[0.6666666666666666,0.3333333333333333,0.500548]},{"id":1,"value":[0.3333333333333333,0.6666666666666666,0]},{"id":2,"value":[0.6666666666666666,0.3333333333333333,0.879762]},{"id":3,"value":[0.3333333333333333,0.6666666666666666,0.379762]}],"units":"crystal","cell":[[3.289103,0,2.0139947305079785e-16],[-1.6445514999999995,2.8484467536636084,2.0139947305079785e-16],[0,0,5.306821]],"constraints":[]},"name":"ZnO, Zinc Oxide, HEX (P6_3mc) 3D (Bulk), mp-2133","isNonPeriodic":false,"external":{"id":"mp-2133","source":"materials project","doi":"10.17188/1196748","url":"https://next-gen.materialsproject.org/materials/mp-2133/","origin":true}},"Al2O3-[Sapphire]-RHL_[R3c]_3D_[Bulk]-[mp-1143].json":{"lattice":{"a":5.177955,"b":5.177955,"c":5.177955,"alpha":55.28961,"beta":55.28961,"gamma":55.28962,"units":{"length":"angstrom","angle":"degree"},"type":"RHL","vectors":{"a":[4.25649,0,2.948476],"b":[1.544362,3.966441,2.948476],"c":[0,0,5.177955],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Al"},{"id":1,"value":"Al"},{"id":2,"value":"Al"},{"id":3,"value":"Al"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"}],"coordinates":[{"id":0,"value":[0.147904,0.147904,0.147904]},{"id":1,"value":[0.352096,0.352096,0.352096]},{"id":2,"value":[0.647904,0.647904,0.647904]},{"id":3,"value":[0.852096,0.852096,0.852096]},{"id":4,"value":[0.556146,0.943854,0.25]},{"id":5,"value":[0.75,0.443854,0.056146]},{"id":6,"value":[0.25,0.556146,0.943854]},{"id":7,"value":[0.943854,0.25,0.556146]},{"id":8,"value":[0.056146,0.75,0.443854]},{"id":9,"value":[0.443854,0.056146,0.75]}],"units":"crystal","cell":[[4.256490242242112,0,2.948475673924187],[1.5443619831482889,3.966441131204218,2.948475673924187],[0,0,5.177955]],"constraints":[]},"name":"Al2O3, Sapphire, RHL (R3c) 3D (Bulk), mp-1143","external":{"id":"mp-1143","source":"materials project","doi":"10.17188/1187823","url":"https://next-gen.materialsproject.org/materials/mp-1143/","origin":true}},"SiO2-[Quartz]-HEX_[P3_121]_3D_[Bulk]-[mp-7000].json":{"lattice":{"a":5.021502,"b":5.021502,"c":5.51057,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[5.021502,0,0],"b":[-2.510751,4.348748,0],"c":[0,0,5.51057],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Si"},{"id":1,"value":"Si"},{"id":2,"value":"Si"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"}],"coordinates":[{"id":0,"value":[0.523695,0.523695,0]},{"id":1,"value":[0,0.476305,0.6666666666666666]},{"id":2,"value":[0.476305,0,0.3333333333333333]},{"id":3,"value":[0.256094,0.414854,0.794543]},{"id":4,"value":[0.585146,0.84124,0.127877]},{"id":5,"value":[0.15876,0.743906,0.46121]},{"id":6,"value":[0.414854,0.256094,0.205457]},{"id":7,"value":[0.743906,0.15876,0.53879]},{"id":8,"value":[0.84124,0.585146,0.872123]}],"units":"crystal","cell":[[5.021502,0,3.074783175606016e-16],[-2.5107509999999995,4.3487482971543665,3.074783175606016e-16],[0,0,5.51057]],"constraints":[]},"name":"SiO2, Quartz, HEX (P3_121) 3D (Bulk), mp-7000","isNonPeriodic":false,"external":{"id":"mp-7000","source":"materials project","doi":"10.17188/1272685","url":"https://next-gen.materialsproject.org/materials/mp-7000/","origin":true}},"ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858].json":{"lattice":{"a":5.233649,"b":5.26846,"c":5.418476,"alpha":90,"beta":100.0548,"gamma":90,"units":{"length":"angstrom","angle":"degree"},"type":"MCL","vectors":{"a":[5.153267,0,-0.9137428],"b":[0,5.26846,0],"c":[0,0,5.418476],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Zr"},{"id":1,"value":"Zr"},{"id":2,"value":"Zr"},{"id":3,"value":"Zr"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"}],"coordinates":[{"id":0,"value":[0.724019,0.95582,0.789744]},{"id":1,"value":[0.724019,0.54418,0.289744]},{"id":2,"value":[0.275981,0.45582,0.710256]},{"id":3,"value":[0.275981,0.04418,0.210256]},{"id":4,"value":[0.061015,0.180178,0.854613]},{"id":5,"value":[0.061015,0.319822,0.354613]},{"id":6,"value":[0.54701,0.255674,0.021936]},{"id":7,"value":[0.45299,0.755674,0.478064]},{"id":8,"value":[0.54701,0.244326,0.521936]},{"id":9,"value":[0.45299,0.744326,0.978064]},{"id":10,"value":[0.938985,0.680178,0.645387]},{"id":11,"value":[0.938985,0.819822,0.145387]}],"units":"crystal","cell":[[5.153266528349093,0,-0.9137428210376703],[8.472329854915372e-16,5.26846,3.2260013377179325e-16],[0,0,5.418476]],"constraints":[]},"name":"ZrO2, Zirconium Dioxide, MCL (P2_1/c) 3D (Bulk), mp-2858","isNonPeriodic":false,"external":{"id":"mp-2858","source":"materials project","doi":"10.17188/1202679","url":"https://next-gen.materialsproject.org/materials/mp-2858/","origin":true}},"HfO2-[Hafnium_IV_Oxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-352].json":{"lattice":{"a":5.142319,"b":5.195148,"c":5.326038,"alpha":90,"beta":99.67453,"gamma":90,"units":{"length":"angstrom","angle":"degree"},"type":"MCL","vectors":{"a":[5.069186,0,-0.8641728],"b":[0,5.195148,0],"c":[0,0,5.326038],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Hf"},{"id":1,"value":"Hf"},{"id":2,"value":"Hf"},{"id":3,"value":"Hf"},{"id":4,"value":"O"},{"id":5,"value":"O"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"}],"coordinates":[{"id":0,"value":[0.275959,0.457319,0.707891]},{"id":1,"value":[0.724041,0.957319,0.792109]},{"id":2,"value":[0.724041,0.542681,0.292109]},{"id":3,"value":[0.275959,0.042681,0.207891]},{"id":4,"value":[0.448887,0.742603,0.977708]},{"id":5,"value":[0.551113,0.242603,0.522292]},{"id":6,"value":[0.551113,0.257397,0.022292]},{"id":7,"value":[0.448887,0.757397,0.477708]},{"id":8,"value":[0.067849,0.330122,0.347094]},{"id":9,"value":[0.932151,0.830122,0.152906]},{"id":10,"value":[0.932151,0.669878,0.652906]},{"id":11,"value":[0.067849,0.169878,0.847094]}],"units":"crystal","cell":[[5.069186333677137,0,-0.8641727907206658],[8.354435167222277e-16,5.195148,3.181110684648387e-16],[0,0,5.326038]],"constraints":[]},"name":"HfO2, Hafnium IV  Oxide, MCL (P2_1/c) 3D (Bulk), mp-352","isNonPeriodic":false,"external":{"id":"mp-352","source":"materials project","doi":"10.17188/1206948","url":"https://next-gen.materialsproject.org/materials/mp-352","origin":true}},"Y2O3-[Yttrium_III_Oxide]-MCLC_[C2%2Fm]_3D_[Bulk]-[mp-558573].json":{"lattice":{"a":3.515998,"b":7.276947,"c":8.695337,"alpha":100.1007,"beta":90,"gamma":103.9801,"units":{"length":"angstrom","angle":"degree"},"type":"MCLC","vectors":{"a":[3.515998,0,0],"b":[-1.758,6.945117,-1.276222],"c":[0,0,8.695337],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Y"},{"id":1,"value":"Y"},{"id":2,"value":"Y"},{"id":3,"value":"Y"},{"id":4,"value":"Y"},{"id":5,"value":"Y"},{"id":6,"value":"O"},{"id":7,"value":"O"},{"id":8,"value":"O"},{"id":9,"value":"O"},{"id":10,"value":"O"},{"id":11,"value":"O"},{"id":12,"value":"O"},{"id":13,"value":"O"},{"id":14,"value":"O"}],"coordinates":[{"id":0,"value":[0.635175,0.27035,0.488039]},{"id":1,"value":[0.364825,0.72965,0.511961]},{"id":2,"value":[0.032014,0.064029,0.814048]},{"id":3,"value":[0.691364,0.382729,0.137328]},{"id":4,"value":[0.308636,0.617271,0.862672]},{"id":5,"value":[0.967986,0.935971,0.185952]},{"id":6,"value":[0.127996,0.255992,0.281772]},{"id":7,"value":[0.825532,0.651064,0.030517]},{"id":8,"value":[0.793308,0.586615,0.37737]},{"id":9,"value":[0.470963,0.941926,0.342856]},{"id":10,"value":[0.529037,0.058074,0.657144]},{"id":11,"value":[0.5,0,0]},{"id":12,"value":[0.174468,0.348936,0.969483]},{"id":13,"value":[0.206692,0.413385,0.62263]},{"id":14,"value":[0.872004,0.744008,0.718228]}],"units":"crystal","cell":[[3.515998,0,2.152927848254248e-16],[-1.7580003488225273,6.945116995483733,-1.2762218981791018],[0,0,8.695337]],"constraints":[]},"name":"Y2O3, Yttrium III Oxide, MCLC (C2/m) 3D (Bulk), mp-558573","isNonPeriodic":false,"external":{"id":"mp-558573","source":"materials project","doi":"10.17188/1272685","url":"https://next-gen.materialsproject.org/materials/mp-558573/","origin":true}},"VO2-[Vanadium_IV_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-19094].json":{"lattice":{"a":3.038141,"b":4.51531,"c":4.51531,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"},"type":"TET","vectors":{"a":[3.038141,0,0],"b":[0,4.51531,0],"c":[0,0,4.51531],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"V"},{"id":1,"value":"V"},{"id":2,"value":"O"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"}],"coordinates":[{"id":0,"value":[0.5,0.5,0.5]},{"id":1,"value":[0,0,0]},{"id":2,"value":[0.5,0.799236,0.200764]},{"id":3,"value":[0.5,0.200764,0.799236]},{"id":4,"value":[0,0.700764,0.700764]},{"id":5,"value":[0,0.299236,0.299236]}],"units":"crystal","cell":[[3.038141,0,1.8603248255041695e-16],[7.261172281311413e-16,4.51531,2.764829969329018e-16],[0,0,4.51531]],"constraints":[]},"name":"VO2, Vanadium IV Oxide, TET (P4_2/mnm) 3D (Bulk), mp-19094","isNonPeriodic":false,"external":{"id":"mp-19094","source":"materials project","url":"https://next-gen.materialsproject.org/materials/mp-19094/","origin":true}},"TiO2-[Titanium_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-2657].json":{"lattice":{"a":2.969203,"b":4.653272,"c":4.653272,"alpha":90,"beta":90,"gamma":90,"units":{"length":"angstrom","angle":"degree"},"type":"TET","vectors":{"a":[2.969203,0,0],"b":[0,4.653272,0],"c":[0,0,4.653272],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Ti"},{"id":1,"value":"Ti"},{"id":2,"value":"O"},{"id":3,"value":"O"},{"id":4,"value":"O"},{"id":5,"value":"O"}],"coordinates":[{"id":0,"value":[0.5,0.5,0.5]},{"id":1,"value":[0,0,0]},{"id":2,"value":[0.5,0.19542,0.80458]},{"id":3,"value":[0.5,0.80458,0.19542]},{"id":4,"value":[0,0.30458,0.30458]},{"id":5,"value":[0,0.69542,0.69542]}],"units":"crystal","cell":[[2.969203,0,1.8181124749843592e-16],[7.483032098306101e-16,4.653272,2.8493073301810017e-16],[0,0,4.653272]],"constraints":[]},"name":"TiO2, Titanium Oxide, TET (P4_2/mnm) 3D (Bulk), mp-2657","isNonPeriodic":false,"external":{"id":"mp-2657","source":"materials project","url":"https://next-gen.materialsproject.org/materials/mp-2657/","origin":true}},"MoS2-[Molybdenum_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-2815].json":{"lattice":{"a":3.192238,"b":3.192238,"c":13.37829,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.192238,0,0],"b":[-1.596119,2.764559,0],"c":[0,0,13.37829],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Mo"},{"id":1,"value":"Mo"},{"id":2,"value":"S"},{"id":3,"value":"S"},{"id":4,"value":"S"},{"id":5,"value":"S"}],"coordinates":[{"id":0,"value":[0.6666666666666666,0.3333333333333333,0.25]},{"id":1,"value":[0.3333333333333334,0.6666666666666667,0.75]},{"id":2,"value":[0.6666666666666666,0.3333333333333333,0.633082]},{"id":3,"value":[0.3333333333333334,0.6666666666666667,0.366918]},{"id":4,"value":[0.6666666666666667,0.3333333333333334,0.866918]},{"id":5,"value":[0.3333333333333333,0.6666666666666666,0.1330819999999999]}],"units":"crystal","cell":[[3.192238,0,1.9546820244082742e-16],[-1.5961189999999996,2.764559202926029,1.9546820244082742e-16],[0,0,13.37829]],"constraints":[]},"name":"MoS2, Molybdenum Disulfide, HEX (P6_3/mmc) 3D (Bulk), mp-2815","isNonPeriodic":false,"external":{"id":"mp-2815","source":"materials project","doi":"10.17188/1202268","url":"https://next-gen.materialsproject.org/materials/mp-2815/","origin":true}},"MoS2-[Molybdenum_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-bsq28woJc7dnZmvCt].json":{"lattice":{"a":3.18851,"b":3.18851,"c":37.20906,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.18851,0,0],"b":[-1.594255,2.761331,0],"c":[0,0,37.20906],"alat":1,"units":"angstrom"}},"unitCellFormula":"Mo1 S2","derivedProperties":[{"units":"angstrom^3","name":"volume","value":327.60837632690976},{"units":"g/cm^3","name":"density","value":0.8113421491627683},{"tolerance":{"units":"angstrom","value":0.3},"name":"symmetry","spaceGroupSymbol":"P-6m2"},{"name":"elemental_ratio","value":0.6666666666666666,"element":"S"},{"name":"elemental_ratio","value":0.3333333333333333,"element":"Mo"},{"degree":0,"name":"p-norm","value":2},{"degree":2,"name":"p-norm","value":0.7453559924999299},{"degree":3,"name":"p-norm","value":0.6933612743506347},{"degree":5,"name":"p-norm","value":0.6707822056951861},{"degree":7,"name":"p-norm","value":0.667408235036379},{"degree":10,"name":"p-norm","value":0.6667317422407864}],"owner":{"_id":"5b143a4ecd313f405b314224","slug":"exabyte-io","cls":"Account"},"basis":{"elements":[{"id":0,"value":"Mo"},{"id":1,"value":"S"},{"id":2,"value":"S"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.083333]},{"id":1,"value":[0.333333,0.666667,0.041466]},{"id":2,"value":[0.333333,0.666667,0.125201]}],"units":"crystal","cell":[[3.18851,0,1.9523992827746636e-16],[-1.5942549999999995,2.761330660220721,1.9523992827746636e-16],[0,0,37.20906]],"constraints":[]},"name":"MoS2, Molybdenum Disulfide, HEX (P-6m2) 2D (Monolayer), m3-bsq28woJc7dnZmvCt","isNonPeriodic":false,"external":{"id":"bsq28woJc7dnZmvCt","source":"mat3ra","url":"https://platform.mat3ra.com/bank/materials/bsq28woJc7dnZmvCt","origin":true}},"MoTe2-[Molybdenum_Telluride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-602].json":{"lattice":{"a":3.558711,"b":3.558711,"c":15.34665,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.558711,0,0],"b":[-1.779355,3.081934,0],"c":[0,0,15.34665],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Te"},{"id":1,"value":"Te"},{"id":2,"value":"Te"},{"id":3,"value":"Te"},{"id":4,"value":"Mo"},{"id":5,"value":"Mo"}],"coordinates":[{"id":0,"value":[0.333333,0.666667,0.63208]},{"id":1,"value":[0.666667,0.333333,0.13208]},{"id":2,"value":[0.666667,0.333333,0.36792]},{"id":3,"value":[0.333333,0.666667,0.86792]},{"id":4,"value":[0.333333,0.666667,0.25]},{"id":5,"value":[0.666667,0.333333,0.75]}],"units":"crystal","cell":[[3.558711,0,2.1790820176202383e-16],[-1.7793554999999996,3.0819341307271237,2.1790820176202383e-16],[0,0,15.34665]],"constraints":[]},"name":"MoTe2, Molybdenum Telluride, HEX (P6_3/mmc) 3D (Bulk), mp-602","isNonPeriodic":false,"external":{"id":"mp-602","source":"materials project","url":"https://next-gen.materialsproject.org/materials/mp-602/","origin":true}},"MoTe2-[Molybdenum_Telluride]-HEX_[P-6m2]_2D_[Monolayer]-[mp-602].json":{"lattice":{"a":3.520742,"b":3.520742,"c":41.98534,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.520742,0,0],"b":[-1.760371,3.049052,0],"c":[0,0,41.98534],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Te"},{"id":1,"value":"Te"},{"id":2,"value":"Mo"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.040183]},{"id":1,"value":[0.666667,0.333333,0.126483]},{"id":2,"value":[0.333333,0.666667,0.083333]}],"units":"crystal","cell":[[3.520742,0,2.1558327104618252e-16],[-1.7603709999999995,3.049052012170832,2.1558327104618252e-16],[0,0,41.98534]],"constraints":[]},"name":"MoTe2, Molybdenum Telluride, HEX (P-6m2) 2D (Monolayer), mp-602","isNonPeriodic":false,"external":{"id":"K9ts7Lz8hLpwQk2JG","source":"mat3ra","url":"https://platform.mat3ra.com/bank/materials/K9ts7Lz8hLpwQk2JG","origin":true}},"WSe2-[Tungsten_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-1821].json":{"lattice":{"a":3.327069,"b":3.327069,"c":15.06895,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.327069,0,0],"b":[-1.663534,2.881326,0],"c":[0,0,15.06895],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"W"},{"id":1,"value":"W"},{"id":2,"value":"Se"},{"id":3,"value":"Se"},{"id":4,"value":"Se"},{"id":5,"value":"Se"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.25]},{"id":1,"value":[0.333333,0.666667,0.75]},{"id":2,"value":[0.333333,0.666667,0.138431]},{"id":3,"value":[0.666667,0.333333,0.638431]},{"id":4,"value":[0.333333,0.666667,0.361569]},{"id":5,"value":[0.666667,0.333333,0.861569]}],"units":"crystal","cell":[[3.327069,0,2.0372422006961926e-16],[-1.6635344999999995,2.8813262741436887,2.0372422006961926e-16],[0,0,15.06895]],"constraints":[]},"name":"WSe2, Tungsten Diselenide, HEX (P6_3/mmc) 3D (Bulk), mp-1821","isNonPeriodic":false,"external":{"id":"mp-1821","source":"materials project","doi":"10.17188/1192989","url":"https://next-gen.materialsproject.org/materials/mp-1821/","origin":true}},"WSe2-[Tungsten_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[m3-a9GGgaoBdnCHPn9hs].json":{"lattice":{"a":3.327838,"b":3.327838,"c":38.4026,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.327838,0,0],"b":[-1.663919,2.881992,0],"c":[0,0,38.4026],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"W"},{"id":1,"value":"Se"},{"id":2,"value":"Se"}],"coordinates":[{"id":0,"value":[0.666667,0.333333,0.083333]},{"id":1,"value":[0.333333,0.666667,0.040026]},{"id":2,"value":[0.333333,0.666667,0.126641]}],"units":"crystal","cell":[[3.327838,0,2.0377130773904647e-16],[-1.6639189999999995,2.881992247679199,2.0377130773904647e-16],[0,0,38.4026]],"constraints":[]},"name":"WSe2, Tungsten Diselenide, HEX (P-6m2) 2D (Monolayer), m3-a9GGgaoBdnCHPn9hs","isNonPeriodic":false,"external":{"id":"a9GGgaoBdnCHPn9hs","source":"mat3ra","url":"https://platform.mat3ra.com/bank/materials/a9GGgaoBdnCHPn9hs","origin":true}},"GaN-[Gallium_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-804].json":{"lattice":{"a":3.21629,"b":3.21629,"c":5.239962,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.21629,0,0],"b":[-1.608145,2.785389,0],"c":[0,0,5.239962],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Ga"},{"id":1,"value":"Ga"},{"id":2,"value":"N"},{"id":3,"value":"N"}],"coordinates":[{"id":0,"value":[0.6666666666666666,0.3333333333333333,0.49912]},{"id":1,"value":[0.3333333333333333,0.6666666666666666,0]},{"id":2,"value":[0.6666666666666666,0.3333333333333333,0.87588]},{"id":3,"value":[0.3333333333333333,0.6666666666666666,0.37588]}],"units":"crystal","cell":[[3.21629,0,1.9694096268148201e-16],[-1.6081449999999995,2.7853888459378524,1.9694096268148201e-16],[0,0,5.239962]],"constraints":[]},"name":"GaN, Gallium Nitride, HEX (P6_3mc) 3D (Bulk), mp-804","isNonPeriodic":false,"external":{"id":"mp-804","source":"materials project","doi":"10.17188/1268467","url":"https://next-gen.materialsproject.org/materials/mp-804","origin":true}},"GaAs-[Gallium_Arsenide]-FCC_[F-43m]-[mp-2534].json":{"lattice":{"a":4.065993,"b":4.065993,"c":4.065993,"alpha":60,"beta":60,"gamma":60,"units":{"length":"angstrom","angle":"degree"},"type":"FCC","vectors":{"a":[3.521253,0,2.032997],"b":[1.173751,3.319869,2.032997],"c":[0,0,4.065993],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Ga"},{"id":1,"value":"As"}],"coordinates":[{"id":0,"value":[0,0,0]},{"id":1,"value":[0.25,0.25,0.25]}],"units":"crystal","cell":[[3.5212532296097008,0,2.0329965000000003],[1.173751076536567,3.3198693825760675,2.0329965000000003],[0,0,4.065993]],"constraints":[]},"name":"GaAs, Gallium Arsenide, FCC (F-43m), mp-2534","isNonPeriodic":false,"external":{"id":"mp-2534","source":"materials project","doi":"10.17188/1200591","url":"https://next-gen.materialsproject.org/materials/mp-2534/","origin":true}},"AlN-[Aluminum_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-661].json":{"lattice":{"a":3.128588,"b":3.128588,"c":5.016955,"alpha":90,"beta":90,"gamma":120,"units":{"length":"angstrom","angle":"degree"},"type":"HEX","vectors":{"a":[3.128588,0,0],"b":[-1.564294,2.709437,0],"c":[0,0,5.016955],"alat":1,"units":"angstrom"}},"basis":{"elements":[{"id":0,"value":"Al"},{"id":1,"value":"Al"},{"id":2,"value":"N"},{"id":3,"value":"N"}],"coordinates":[{"id":0,"value":[0.6666666666666666,0.3333333333333333,0.499287]},{"id":1,"value":[0.3333333333333333,0.6666666666666666,0]},{"id":2,"value":[0.6666666666666666,0.3333333333333333,0.880713]},{"id":3,"value":[0.3333333333333333,0.6666666666666666,0.380713]}],"units":"crystal","cell":[[3.128588,0,1.9157076400254099e-16],[-1.5642939999999996,2.7094366859751498,1.9157076400254099e-16],[0,0,5.016955]],"constraints":[]},"name":"AlN, Aluminum Nitride, HEX (P6_3mc) 3D (Bulk), mp-661","external":{"id":"mp-661","source":"materials project","doi":"10.17188/1268470","url":"https://next-gen.materialsproject.org/materials/mp-661","origin":true}}}}''')
