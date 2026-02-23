import type {
    MapUnitSchema,
    SubworkflowSchema,
    SubworkflowUnitSchema,
    WorkflowSchema,
} from "@mat3ra/esse/dist/js/types";

import createSubworkflow, {
    type AnyUnitConfig,
    type AttributesConfig,
    type SubworkflowData,
    type SubworkflowFunctionsConfig,
} from "./createSubworkflow";
import { defaultMapConfig, defaultSubworkflowUnitConfig } from "./defaults";
import {
    generateDefaultWorkflowId,
    generateFlowChartId,
    generateWorkflowId,
    validateData,
} from "./utils";

type WorkflowUnitData = {
    name: string;
    type: "workflow";
    units: UnitDataArray;
    config?: WorkflowUnitConfig;
};

type SubworkflowUnitData = {
    name: string;
    type: "subworkflow";
    config?: AttributesConfig & SubworkflowFunctionsConfig & Partial<SubworkflowSchema>;
    unitConfigs?: SubworkflowUnitConfig[];
};

type UnitData = WorkflowUnitData | SubworkflowUnitData;
type UnitDataArray = [SubworkflowUnitData, ...UnitData[]];

type UnitConfig = {
    index: number;
    type:
        | "assignment"
        | "condition"
        | "processing"
        | "io"
        | "assertion"
        | "executionBuilder"
        | "reduce";
    config: AttributesConfig;
};

type WorkflowConfig = AttributesConfig & Partial<WorkflowSchema>;

type MapUnitConfig = {
    mapUnit: boolean;
    input?: {
        name: string;
    };
};

type WorkflowUnitConfig = WorkflowConfig & MapUnitConfig;

type SubworkflowUnitConfig = UnitConfig & { index: number };

export type WorkflowData = {
    name: string;
    units: UnitDataArray;
    config?: WorkflowConfig;
};

export type SubworkflowsTree = Record<string, Record<string, SubworkflowData>>;

function addWorkflowToWorkflow<T extends Pick<WorkflowSchema, "workflows" | "units">>(
    rootWorkflow: T,
    nestedWorkflow: WorkflowSchema,
    config?: MapUnitConfig,
) {
    const workflowId = generateDefaultWorkflowId();

    const mapUnit: MapUnitSchema = {
        ...defaultMapConfig,
        workflowId,
        input: { ...defaultMapConfig.input, ...config?.input },
        flowchartId: generateFlowChartId(defaultMapConfig.name),
    };

    const mapWorkflow: WorkflowSchema = {
        _id: workflowId,
        ...nestedWorkflow,
    };

    return {
        ...rootWorkflow,
        workflows: [...(rootWorkflow.workflows || []), mapWorkflow],
        units: [...(rootWorkflow.units || []), mapUnit],
    };
}

function addSubworkflowToWorkflow<T extends Pick<WorkflowSchema, "subworkflows" | "units">>(
    workflow: T,
    subworkflow: SubworkflowSchema,
) {
    const name = subworkflow.name || defaultSubworkflowUnitConfig.name;

    const subworkflowUnit: SubworkflowUnitSchema = {
        ...defaultSubworkflowUnitConfig,
        _id: subworkflow._id,
        name,
        flowchartId: generateFlowChartId(name),
    };

    const subworkflows = [...(workflow.subworkflows || []), subworkflow];

    return {
        ...workflow,
        units: [...(workflow.units || []), subworkflowUnit],
        subworkflows,
        properties: [...new Set(subworkflows.map((x) => x.properties || []).flat())],
    };
}

function patchSubworkflowData(
    subworkflow: SubworkflowData,
    unitData: SubworkflowUnitData,
): SubworkflowData {
    const subworkflowData: SubworkflowData = {
        ...subworkflow,
        config: { ...subworkflow.config, ...unitData.config },
    };

    const unitConfigs = unitData.unitConfigs || [];

    return unitConfigs.reduce((acc, unitConfig): SubworkflowData => {
        const { index } = unitConfig;
        const workflowUnit = subworkflowData.units[index];

        if (workflowUnit.type !== unitConfig.type) {
            throw new Error("Unit type does not match!");
        }

        const newUnit = {
            ...workflowUnit,
            config: {
                ...workflowUnit.config,
                ...unitConfig.config.attributes,
            },
        } as AnyUnitConfig;

        return {
            ...acc,
            units: [...acc.units.slice(0, index), newUnit, ...acc.units.slice(index + 1)],
        };
    }, subworkflowData);
}

function createSubworkflowFromUnitData(
    appName: string,
    unitData: SubworkflowUnitData,
    subworkflows: SubworkflowsTree,
    cache?: string[],
): SubworkflowSchema {
    const subworkflowData = subworkflows[appName]?.[unitData.name];

    if (!subworkflowData) {
        throw new Error(`Subworkflow ${unitData.name} not found in ${appName}!`);
    }

    const patchedSubworkflowData = patchSubworkflowData(subworkflowData, unitData);

    return createSubworkflow(patchedSubworkflowData, cache);
}

function createWorkflowFromWorkflowData(
    appName: string,
    workflowData: WorkflowData,
    subworkflows: SubworkflowsTree,
    cache: string[] = [],
): WorkflowSchema {
    const initialWorkflow: Omit<WorkflowSchema, "name"> = {
        subworkflows: [],
        units: [],
        properties: [],
        workflows: [],
    };

    const workflowWithUnits = workflowData.units.reduce((acc, unitData) => {
        if (unitData.type === "workflow") {
            const workflow = createWorkflowFromWorkflowData(appName, unitData, subworkflows, cache);
            return addWorkflowToWorkflow(acc, workflow, unitData.config);
        }

        const subworkflow = createSubworkflowFromUnitData(appName, unitData, subworkflows, cache);
        return addSubworkflowToWorkflow(acc, subworkflow);
    }, initialWorkflow);

    return {
        _id: generateWorkflowId(workflowWithUnits.subworkflows[0]),
        name: workflowData.name,
        ...workflowWithUnits,
        ...workflowData.config?.attributes,
    };
}

export default function createWorkflow(
    appName: string,
    workflowData: WorkflowData,
    subworkflows: SubworkflowsTree,
) {
    console.log(`wode: creating ${appName} workflow ${workflowData.name}`);

    const workflow = createWorkflowFromWorkflowData(appName, workflowData, subworkflows, []);

    return validateData(workflow, "workflow");
}
