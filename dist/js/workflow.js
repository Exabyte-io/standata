"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowSubforkflowMapByApplication = exports.SubworkflowStandata = exports.WorkflowStandata = void 0;
const base_1 = require("./base");
const subworkflows_json_1 = __importDefault(require("./runtime_data/subworkflows.json"));
const workflows_json_1 = __importDefault(require("./runtime_data/workflows.json"));
const workflowSubforkflowMapByApplication_json_1 = __importDefault(require("./runtime_data/workflowSubforkflowMapByApplication.json"));
exports.workflowSubforkflowMapByApplication = workflowSubforkflowMapByApplication_json_1.default;
class WorkflowStandata extends base_1.Standata {
    findByApplication(appName) {
        return this.findEntitiesByTags(appName);
    }
    findByApplicationAndName(appName, displayName) {
        return this.findByApplication(appName).find((w) => (w === null || w === void 0 ? void 0 : w.name) === displayName);
    }
    getRelaxationWorkflowByApplication(appName) {
        const workflows = this.findEntitiesByTags("relaxation", appName);
        if (workflows.length === 0) {
            return undefined;
        }
        return workflows[0];
    }
    getDefault() {
        const defaults = this.findEntitiesByTags("default");
        return defaults[0];
    }
}
exports.WorkflowStandata = WorkflowStandata;
WorkflowStandata.runtimeData = workflows_json_1.default;
class SubworkflowStandata extends base_1.Standata {
}
exports.SubworkflowStandata = SubworkflowStandata;
SubworkflowStandata.runtimeData = subworkflows_json_1.default;
