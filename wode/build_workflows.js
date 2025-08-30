const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const allApplications = [
    "espresso",
    "jupyterLab",
    "nwchem",
    "python",
    "python/ml",
    "shell",
    "vasp",
    "deepmd",
];

const allWorkflows = { workflows: {}, subworkflows: {} };

const JSONstringifyOrder = (obj, space) => {
    const allKeys = new Set();
    // eslint-disable-next-line no-sequences
    JSON.stringify(obj, (key, value) => (allKeys.add(key), value));
    return JSON.stringify(obj, Array.from(allKeys).sort(), space);
};

const loadFile = (name, dir, file, type) => {
    const entryPath = path.resolve(dir, file);
    if (!fs.statSync(entryPath).isFile()) {
        console.log(`Skipping ${entryPath} as it is not a file.`);
        return;
    }
    const obj = fs.readFileSync(path.resolve(dir, file), "utf8");
    const key = file.split(".")[0];
    allWorkflows[type][name][key] = yaml.load(obj);
};

allApplications.forEach((name) => {
    allWorkflows.workflows[name] = {};
    allWorkflows.subworkflows[name] = {};
    const wfDir = path.resolve(__dirname, "assets", "workflows", name);
    const swDir = path.resolve(__dirname, "assets", "subworkflows", name);
    try {
        const wfFiles = fs.readdirSync(wfDir);
        const swFiles = fs.readdirSync(swDir);
        console.log(
            `Building ${name}: ${wfFiles.length} workflow(s) and ${swFiles.length} subworkflow(s)`,
        );
        wfFiles.forEach((file) => loadFile(name, wfDir, file, "workflows"));
        swFiles.forEach((file) => loadFile(name, swDir, file, "subworkflows"));
    } catch (e) {
        console.log(e);
    }
});

// Generate workflow data for standata
const workflowData = {
    standataConfig: {
        categories: {
            application: allApplications.map(app => app.replace('/', '_')), // Convert nested apps like python/ml to python_ml
            property: [
                "band_gap",
                "band_structure",
                "dos",
                "total_energy",
                "phonon_dispersions",
                "phonon_dos",
                "surface_energy",
                "zero_point_energy",
                "dielectric_tensor",
                "neb",
                "hubbard_u_hp"
            ],
            material_count: ["single-material", "multi-material"]
        },
        entities: []
    },
    filesMapByName: {}
};


Object.keys(allWorkflows.workflows).forEach((appName) => {
    Object.keys(allWorkflows.workflows[appName]).forEach((workflowName) => {
        const wf = allWorkflows.workflows[appName][workflowName];
        const wfUnits = wf.units || [];
        const onlySubworkflows = wfUnits.length > 0 && wfUnits.every((u) => u.type === "subworkflow");
        if (!onlySubworkflows) return; // skip complex/nested workflows for now

        const compiledSubworkflows = [];
        const propertiesSet = new Set();
        wfUnits.forEach((unit) => {
            const { name: subName } = unit;
            const original = allWorkflows.subworkflows[appName][subName];
            if (!original) return;
            const sub = JSON.parse(JSON.stringify(original));
            (sub.properties || []).forEach((p) => propertiesSet.add(p));
            compiledSubworkflows.push(sub);
        });

        const compiledUnits = compiledSubworkflows.map((sub, idx) => ({
            name: sub.name,
            type: "subworkflow",
            ...(idx === 0 ? { head: true } : {}),
        }));

        const compiled = {
            name: wf.name,
            subworkflows: compiledSubworkflows,
            units: compiledUnits,
            properties: Array.from(propertiesSet),
        };

        const workflowsDir = path.resolve(__dirname, "..", "workflows");
        if (!fs.existsSync(workflowsDir)) fs.mkdirSync(workflowsDir, { recursive: true });
        const filename = `${appName.replace("/", "_")}_${workflowName}.json`;
        fs.writeFileSync(path.resolve(workflowsDir, filename), JSONstringifyOrder(compiled, 2) + "\n", "utf8");
        workflowData.filesMapByName[filename] = compiled;

        const categories = [appName.replace("/", "_")];
        (compiled.properties || []).forEach((prop) => {
            if (workflowData.standataConfig.categories.property.includes(prop)) categories.push(prop);
        });
        categories.push("single-material");
        workflowData.standataConfig.entities.push({ filename, categories });
    });
});


// Write the categories.yml file for workflows
const categoriesYml = yaml.dump(workflowData.standataConfig);
fs.writeFileSync(
    path.resolve(__dirname, "..", "workflows", "categories.yml"),
    categoriesYml + (categoriesYml.endsWith('\n') ? '' : '\n'),
    "utf8"
);
