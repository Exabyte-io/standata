// eslint-disable-next-line import/no-extraneous-dependencies
import {
    builders,
    createSubworkflowByName,
    createWorkflowConfigs,
    Subworkflow,
    UnitFactory,
    Workflow, // @ts-ignore
} from "@mat3ra/wode";
import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ensureDirectory, findFiles, readYamlFile, writeJsonFile } from "../utils";

// TODO: get from sources/applications directory
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

function loadYamlDirectory(
    dirPath: string,
    applicationName: string,
    collectionKey: "workflows" | "subworkflows",
): void {
    const yamlFiles = findFiles(dirPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        const filename = path.basename(filePath);
        const key = filename.replace(/\.(yml|yaml)$/i, "");
        workflowSubforkflowMapByApplication[collectionKey][applicationName][key] =
            readYamlFile(filePath);
    });
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
        BUILD_CONFIG.workflows.data.path,
        BUILD_CONFIG.workflows.data[`${type}s`],
    );

    items.forEach((item) => {
        const { appName, name, config } = item;

        const appDir = path.resolve(outputBaseDir, appName);
        ensureDirectory(appDir);

        const filename = `${name}.json`;
        const filePath = path.resolve(appDir, filename);

        writeJsonFile(filePath, config);
        console.log(`Generated ${type}: ${appName}/${filename}`);
    });
}

applications.forEach((name) => {
    workflowSubforkflowMapByApplication.workflows[name] = {};
    workflowSubforkflowMapByApplication.subworkflows[name] = {};

    const sourcesRoot = path.resolve(__dirname, BASE_PATH, BUILD_CONFIG.workflows.assets.path);
    const wfDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.workflows, name);
    const swDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.subworkflows, name);

    loadYamlDirectory(wfDir, name, "workflows");
    const wfCount = Object.keys(workflowSubforkflowMapByApplication.workflows[name]).length;
    console.log(`Building ${name}: ${wfCount} workflow(s)`);

    loadYamlDirectory(swDir, name, "subworkflows");
    const swCount = Object.keys(workflowSubforkflowMapByApplication.subworkflows[name]).length;
    console.log(`Building ${name}: ${swCount} subworkflow(s)`);
});

const buildDir = path.resolve(__dirname, BASE_PATH, BUILD_CONFIG.workflows.build.path);
ensureDirectory(buildDir);

const assetPath = path.resolve(
    buildDir,
    BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication,
);
writeJsonFile(assetPath, workflowSubforkflowMapByApplication, 0);

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
} as any) as any[];
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
