// eslint-disable-next-line import/no-extraneous-dependencies
import { SubworkflowsProcessor } from "../processors/SubworkflowsProcessor";
import { WorkflowsProcessor } from "../processors/WorkflowsProcessor";

const subworkflowsProcessor = new SubworkflowsProcessor(__dirname);
subworkflowsProcessor.process();

const subworkflowsMapByApplication = subworkflowsProcessor.entityMapByApplication;
const workflowsProcessor = new WorkflowsProcessor(__dirname, subworkflowsMapByApplication);
workflowsProcessor.process();
