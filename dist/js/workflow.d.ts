import { Standata } from "./base";
import workflowSubforkflowMapByApplication from "./runtime_data/workflowSubforkflowMapByApplication.json";
/**
 * Generic, reusable standata with all the shared queries.
 * Only `runtimeData` differs between concrete types.
 */
type StandataEntity = {
    filename: string;
    categories: string[];
    name?: string;
};
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
declare abstract class TaggedStandata<T extends {
    name?: string;
}> extends Standata {
    static runtimeData: StandataRuntimeData;
    protected firstByTags(...tags: string[]): T | undefined;
    findByApplication(appName: string): T[];
    findByApplicationAndName(appName: string, displayName: string): T | undefined;
    getRelaxationByApplication(appName: string): T | undefined;
    getDefault(): T | undefined;
}
export declare class WorkflowStandata extends TaggedStandata<StandataEntity> {
    static runtimeData: StandataRuntimeData;
    getRelaxationWorkflowByApplication(appName: string): StandataEntity | undefined;
}
export declare class SubworkflowStandata extends TaggedStandata<StandataEntity> {
    static runtimeData: StandataRuntimeData;
    getRelaxationSubworkflowByApplication(appName: string): StandataEntity | undefined;
}
export { workflowSubforkflowMapByApplication };
