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
const TAGS = {
    RELAXATION: "variable_cell_relaxation",
    DEFAULT: "default",
};
class TaggedStandata extends base_1.Standata {
    firstByTags(...tags) {
        const list = this.findEntitiesByTags(...tags);
        return list[0];
    }
    findByApplication(appName) {
        return this.findEntitiesByTags(appName);
    }
    findByApplicationAndName(appName, displayName) {
        return this.findByApplication(appName).find((e) => (e === null || e === void 0 ? void 0 : e.name) === displayName);
    }
    getRelaxationByApplication(appName) {
        return this.firstByTags(TAGS.RELAXATION, appName);
    }
    getDefault() {
        return this.firstByTags(TAGS.DEFAULT);
    }
}
class WorkflowStandata extends TaggedStandata {
    getRelaxationWorkflowByApplication(appName) {
        return this.getRelaxationByApplication(appName);
    }
}
exports.WorkflowStandata = WorkflowStandata;
WorkflowStandata.runtimeData = workflows_json_1.default;
class SubworkflowStandata extends TaggedStandata {
    getRelaxationSubworkflowByApplication(appName) {
        return this.getRelaxationByApplication(appName);
    }
}
exports.SubworkflowStandata = SubworkflowStandata;
SubworkflowStandata.runtimeData = subworkflows_json_1.default;
