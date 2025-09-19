import { Standata } from "./base";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";
import WORKFLOWS from "./runtime_data/workflows.json";
import workflowSubforkflowMapByApplication from "./runtime_data/workflowSubforkflowMapByApplication.json";

export const TAGS = {
    RELAXATION: "variable_cell_relaxation",
    DEFAULT: "default",
};

/**
 * Generic, reusable Standata with all the shared queries.
 * Only `runtimeData` differs between concrete types.
 */
type StandataEntity = { filename: string; categories: string[]; name?: string };
type StandataRuntimeData = {
    standataConfig: {
        categories: {
            application: string[];
            property: string[];
            material_count: string[];
            workflow_type: string[];
        };
        entities: StandataEntity[];
    };
    filesMapByName: Record<string, unknown>;
};

abstract class TaggedStandata<T extends { name?: string }> extends Standata {
    static runtimeData: StandataRuntimeData;

    protected firstByTags(...tags: string[]): T | undefined {
        const list = this.findEntitiesByTags(...tags) as T[];
        return list[0];
    }

    findByApplication(appName: string): T[] {
        return this.findEntitiesByTags(appName) as T[];
    }

    findByApplicationAndName(appName: string, displayName: string): T | undefined {
        return this.findByApplication(appName).find((e) => e?.name === displayName);
    }

    getRelaxationByApplication(appName: string): T | undefined {
        return this.firstByTags(TAGS.RELAXATION, appName);
    }

    getDefault(): T | undefined {
        return this.firstByTags(TAGS.DEFAULT);
    }
}

export class WorkflowStandata extends TaggedStandata<StandataEntity> {
    static override runtimeData: StandataRuntimeData = WORKFLOWS;

    getRelaxationWorkflowByApplication(appName: string) {
        return this.getRelaxationByApplication(appName);
    }
}

export class SubworkflowStandata extends TaggedStandata<StandataEntity> {
    static override runtimeData: StandataRuntimeData = SUBWORKFLOWS;

    getRelaxationSubworkflowByApplication(appName: string) {
        return this.getRelaxationByApplication(appName);
    }
}

export { workflowSubforkflowMapByApplication };
