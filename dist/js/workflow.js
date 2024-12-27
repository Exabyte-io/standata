"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStandata = void 0;
const base_1 = require("./base");
const workflows_json_1 = __importDefault(require("./runtime_data/workflows.json"));
class WorkflowStandata extends base_1.Standata {
}
exports.WorkflowStandata = WorkflowStandata;
WorkflowStandata.runtimeData = workflows_json_1.default;
