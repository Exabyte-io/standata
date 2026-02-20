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
    units: UnitData[];
    config?: WorkflowUnitConfig;
};

type SubworkflowUnitData = {
    name: string;
    type: "subworkflow";
    config?: AttributesConfig & SubworkflowFunctionsConfig & Partial<SubworkflowSchema>;
    unitConfigs?: SubworkflowUnitConfig[];
};

type UnitData = WorkflowUnitData | SubworkflowUnitData;

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

type WorkflowUnitConfig = WorkflowConfig & {
    mapUnit?: boolean;
    input: {
        name: string;
    };
};

type SubworkflowUnitConfig = UnitConfig & { index: number };

export type WorkflowData = {
    name: string;
    units: UnitData[];
    config?: WorkflowConfig;
};

export type SubworkflowsTree = Record<string, Record<string, SubworkflowData>>;

type WorkflowUnit = {
    type: "workflow";
    config?: WorkflowUnitConfig;
    workflow: WorkflowSchema;
};

type SubworkflowUnit = {
    type: "subworkflow";
    subworkflow: SubworkflowSchema;
};

type AnyUnit = WorkflowUnit | SubworkflowUnit;

function addMapUnitToWorkflow(workflow: WorkflowSchema, unit: WorkflowUnit) {
    if (unit.type !== "workflow") {
        throw new Error("Unit type does not match!");
    }

    if (!unit.config?.mapUnit) {
        throw new Error("Not map unit!");
    }

    const workflowId = generateDefaultWorkflowId();

    const mapUnit: MapUnitSchema = {
        ...defaultMapConfig,
        workflowId,
        input: { ...defaultMapConfig.input, ...unit.config?.input },
        flowchartId: generateFlowChartId(defaultMapConfig.name),
    };

    const mapWorkflow: WorkflowSchema = {
        _id: workflowId,
        ...unit.workflow,
    };

    return {
        ...workflow,
        workflows: [...workflow.workflows, mapWorkflow],
        units: [...workflow.units, mapUnit],
    };
}

function addSubworkflowToWorkflow(
    workflow: WorkflowSchema,
    subworkflow: SubworkflowSchema,
): WorkflowSchema {
    const name = subworkflow.name || defaultSubworkflowUnitConfig.name;

    const subworkflowUnit: SubworkflowUnitSchema = {
        ...defaultSubworkflowUnitConfig,
        _id: subworkflow._id,
        name,
        flowchartId: generateFlowChartId(name),
    };

    return {
        ...workflow,
        subworkflows: [...workflow.subworkflows, subworkflow],
        units: [...workflow.units, subworkflowUnit],
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

function createWorkflowFromSubworkflow(subworkflow: SubworkflowSchema): WorkflowSchema {
    const config: WorkflowSchema = {
        _id: generateWorkflowId(subworkflow),
        name: subworkflow.name,
        subworkflows: [subworkflow],
        units: [
            {
                _id: subworkflow._id,
                type: "subworkflow",
                name: subworkflow.name,
                preProcessors: [],
                postProcessors: [],
                monitors: [],
                results: [],
                flowchartId: generateFlowChartId(subworkflow.name),
            },
        ],
        properties: subworkflow.properties,
        workflows: [],
    };
    return config;
}

function createWorkflowFromWorkflowData(
    appName: string,
    workflowData: WorkflowData,
    subworkflows: SubworkflowsTree,
    cache: string[] = [],
): WorkflowSchema {
    const wfUnits = workflowData.units.map((unitData): AnyUnit => {
        const { type } = unitData;

        if (type === "workflow") {
            return {
                type,
                config: unitData.config,
                workflow: createWorkflowFromWorkflowData(appName, unitData, subworkflows, cache),
            };
        }

        return {
            type,
            subworkflow: createSubworkflowFromUnitData(appName, unitData, subworkflows, cache),
        };
    });

    const [firstUnit, ...restUnits] = wfUnits;

    if (!firstUnit) {
        throw new Error("No units found!");
    }

    const workflow =
        firstUnit.type === "workflow"
            ? firstUnit.workflow
            : createWorkflowFromSubworkflow(firstUnit.subworkflow);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name: _name, ...workflowWithUnits } = restUnits.reduce((acc, wfUnit) => {
        return wfUnit.type === "workflow"
            ? addMapUnitToWorkflow(acc, wfUnit)
            : addSubworkflowToWorkflow(acc, wfUnit.subworkflow);
    }, workflow);

    return {
        name: workflowData.name,
        ...workflowWithUnits,
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
