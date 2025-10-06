// eslint-disable-next-line import/no-extraneous-dependencies

import {
    builders,
    createSubworkflowByName,
    createWorkflowConfigs,
    Subworkflow,
    UnitFactory,
    Workflow, // @ts-ignore
} from "@mat3ra/wode";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

// @ts-ignore - build-config is a .js file
import BUILD_CONFIG from "../../build-config";

const applications = ["espresso"];
const BASE_PATH = "../..";

interface WorkflowSubforkflowMap {
    workflows: Record<string, Record<string, any>>;
    subworkflows: Record<string, Record<string, any>>;
}

const workflowSubforkflowMapByApplication: WorkflowSubforkflowMap = {
    workflows: {},
    subworkflows: {},
};

function loadYamlIntoCollection(
    applicationName: string,
    directoryPath: string,
    filename: string,
    collectionKey: "workflows" | "subworkflows",
): void {
    const entryPath = path.resolve(directoryPath, filename);
    if (!fs.existsSync(entryPath) || !fs.statSync(entryPath).isFile()) return;
    if (!/\.(yml|yaml)$/i.test(filename)) return;
    const content = fs.readFileSync(entryPath, "utf8");
    const key = filename.replace(/\.(yml|yaml)$/i, "");
    workflowSubforkflowMapByApplication[collectionKey][applicationName][key] = yaml.load(
        content,
    ) as any;
}

interface ConfigItem {
    appName: string;
    name: string;
    config: any;
}

function generateConfigFiles(items: ConfigItem[], type: "workflow" | "subworkflow"): void {
    const outputBaseDir = path.resolve(
        __dirname,
        BASE_PATH,
        BUILD_CONFIG.workflows.data[`${type}s`],
    );

    items.forEach((item) => {
        const { appName, name, config } = item;

        const appDir = path.resolve(outputBaseDir, appName);
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir, { recursive: true });
        }
        const filename = `${name}.json`;
        const filePath = path.resolve(appDir, filename);

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
        console.log(`Generated ${type}: ${appName}/${filename}`);
    });
}

applications.forEach((name) => {
    workflowSubforkflowMapByApplication.workflows[name] = {};
    workflowSubforkflowMapByApplication.subworkflows[name] = {};

    const sourcesRoot = path.resolve(__dirname, BASE_PATH, BUILD_CONFIG.workflows.sources.path);
    const wfDir = path.resolve(sourcesRoot, "workflows", name);
    const swDir = path.resolve(sourcesRoot, "subworkflows", name);

    const wfFiles = fs.readdirSync(wfDir);
    console.log(`Building ${name}: ${wfFiles.length} workflow(s)`);
    wfFiles.forEach((file) => loadYamlIntoCollection(name, wfDir, file, "workflows"));

    const swFiles = fs.readdirSync(swDir);
    console.log(`Building ${name}: ${swFiles.length} subworkflow(s)`);
    swFiles.forEach((file) => loadYamlIntoCollection(name, swDir, file, "subworkflows"));
});

const buildDir = path.resolve(__dirname, BASE_PATH, BUILD_CONFIG.workflows.build.path);
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}
const assetPath = path.resolve(
    buildDir,
    BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication,
);
fs.writeFileSync(assetPath, JSON.stringify(workflowSubforkflowMapByApplication), "utf8");

const WorkflowCls = Workflow as any;
WorkflowCls.usePredefinedIds = true;

const SubworkflowCls = Subworkflow as any;
SubworkflowCls.usePredefinedIds = true;

(builders as any).UnitConfigBuilder.usePredefinedIds = true;
(builders as any).AssignmentUnitConfigBuilder.usePredefinedIds = true;
(builders as any).AssertionUnitConfigBuilder.usePredefinedIds = true;
(builders as any).ExecutionUnitConfigBuilder.usePredefinedIds = true;
(builders as any).IOUnitConfigBuilder.usePredefinedIds = true;

(UnitFactory as any).BaseUnit.usePredefinedIds = true;
(UnitFactory as any).AssignmentUnit.usePredefinedIds = true;
(UnitFactory as any).AssertionUnit.usePredefinedIds = true;
(UnitFactory as any).ExecutionUnit.usePredefinedIds = true;
(UnitFactory as any).IOUnit.usePredefinedIds = true;
(UnitFactory as any).SubworkflowUnit.usePredefinedIds = true;
(UnitFactory as any).ConditionUnit.usePredefinedIds = true;
(UnitFactory as any).MapUnit.usePredefinedIds = true;
(UnitFactory as any).ProcessingUnit.usePredefinedIds = true;

const workflowConfigs = createWorkflowConfigs({
    applications,
    WorkflowCls,
    workflowSubforkflowMapByApplication,
    SubworkflowCls,
    UnitFactoryCls: UnitFactory,
    unitBuilders: {
        ...builders,
        Workflow: WorkflowCls,
    },
}) as any[];
const workflowItems = workflowConfigs.map((config: any) => ({
    appName: config.application,
    name: config.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    config: config.config,
}));

generateConfigFiles(workflowItems, "workflow");

const subworkflowItems: ConfigItem[] = [];
applications.forEach((appName) => {
    const subworkflows = workflowSubforkflowMapByApplication.subworkflows[appName];
    if (!subworkflows) return;

    Object.keys(subworkflows).forEach((subworkflowName) => {
        const subworkflow = createSubworkflowByName({
            appName,
            swfName: subworkflowName,
            workflowsData: workflowSubforkflowMapByApplication,
        });

        subworkflowItems.push({
            appName,
            name: subworkflowName,
            config: subworkflow.toJSON(),
        });
    });
});

generateConfigFiles(subworkflowItems, "subworkflow");
