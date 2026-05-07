import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterfaceServer";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ApplicationSchema,
    BaseMethod,
    BaseModel,
    SubworkflowSchema,
} from "@mat3ra/esse/dist/js/types";
import * as ajv from "@mat3ra/esse/dist/js/utils/ajv";
import { Utils } from "@mat3ra/utils";

export function validateData<T extends object>(data: T, schemaId: string): T {
    const jsonSchema = JSONSchemasInterface.getSchemaById(schemaId);
    if (!jsonSchema) {
        throw new Error(`Schema not found for ${schemaId}`);
    }
    const result = ajv.validateAndClean(data as AnyObject, jsonSchema, { coerceTypes: false });

    if (!result.isValid) {
        throw new Error(JSON.stringify({ error: result?.errors, json: data, schema: jsonSchema }));
    }

    return data;
}

export function generateDefaultWorkflowId(): string {
    return Utils.uuid.getUUID();
}

export function generateFlowChartId(unitName: string): string {
    return Utils.uuid.getUUIDFromNamespace(`flowchart-${unitName}`);
}

export function generateBuilderFlowChartId(seed: string, cache: string[] = []): string {
    const countInCache = cache.filter((s) => s === seed).length;
    cache.push(seed);

    const suffix = countInCache > 0 ? `-${countInCache}` : "";
    const seedWithSuffix = `${seed}${suffix}`;
    return Utils.uuid.getUUIDFromNamespace(seedWithSuffix);
}

export function generateWorkflowId(subworkflow: SubworkflowSchema): string {
    const { name, properties, application } = subworkflow;
    const propsInfo = properties?.length ? properties.sort().join(",") : "";
    const swInfo = [subworkflow].map((sw) => sw.name || "unknown").join(",");
    const seed = [`workflow-${name}`, application.name, propsInfo, swInfo]
        .filter((p) => p)
        .join("-");

    return Utils.uuid.getUUIDFromNamespace(seed);
}

export function generateSubworkflowId(
    name: string,
    application?: ApplicationSchema,
    model?: BaseModel,
    method?: BaseMethod,
): string {
    const appName = application?.name || "";
    const modelInfo = model ? `${model.type}-${model.subtype || ""}` : "";
    const methodInfo = method ? `${method.type}-${method.subtype || ""}` : "";
    const seed = [`subworkflow-${name}`, appName, modelInfo, methodInfo].filter((p) => p).join("-");

    return Utils.uuid.getUUIDFromNamespace(seed);
}
