import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import schemas from "@mat3ra/esse/dist/js/schemas.json";
import type { JSONSchema7 } from "json-schema";

import { ApplicationStandata } from "../../src/js/application";
import StandataDriver from "../../src/js/StandataDriver";
import { SubworkflowsProcessor } from "../processors/SubworkflowsProcessor";
import { WorkflowsProcessor } from "../processors/WorkflowsProcessor";

// Running this to set schemas for validation, removing the redundant data from application-flavors tree: `flavors`
JSONSchemasInterface.setSchemas(schemas as JSONSchema7[]);
ApplicationStandata.setDriver(new StandataDriver());

const subworkflowsProcessor = new SubworkflowsProcessor(__dirname);
subworkflowsProcessor.process();

const subworkflowsMapByApplication = subworkflowsProcessor.entityMapByApplication;
const workflowsProcessor = new WorkflowsProcessor(__dirname, subworkflowsMapByApplication);
workflowsProcessor.process();
