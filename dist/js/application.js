"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applications = exports.ApplicationStandata = void 0;
const base_1 = require("./base");
const applications_json_1 = __importDefault(require("./runtime_data/applications.json"));
class ApplicationStandata extends base_1.Standata {
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
exports.applications = new ApplicationStandata();
