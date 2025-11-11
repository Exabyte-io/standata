"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationMethodStandata = void 0;
const method_1 = require("./method");
const modelMethodMapByApplication_json_1 = __importDefault(require("./runtime_data/applications/modelMethodMapByApplication.json"));
const applicationFilter_1 = require("./utils/applicationFilter");
class ApplicationMethodStandata extends applicationFilter_1.ApplicationFilterStandata {
    constructor(convertToSimple) {
        const data = modelMethodMapByApplication_json_1.default;
        super(data === null || data === void 0 ? void 0 : data.methods, applicationFilter_1.FilterMode.ALL_MATCH);
        this.convertToSimple = convertToSimple;
    }
    findByApplicationParameters({ methodList, name, version, build, executable, flavor, }) {
        return this.filterByApplicationParameters(methodList, name, version, build, executable, flavor);
    }
    getAvailableMethods(name) {
        return this.getAvailableEntities(name);
    }
    getDefaultMethodConfigForApplication(applicationConfig) {
        const { name, version, build, executable, flavor } = applicationConfig;
        const availableMethods = this.getAvailableMethods(name);
        if (!availableMethods || Object.keys(availableMethods).length === 0) {
            // When nothing is available, preserve the previous behavior: return "unknown" simple.
            return { type: "unknown", subtype: "unknown" };
        }
        const methodStandata = new method_1.MethodStandata();
        const allMethods = methodStandata.getAll();
        const categorizedMethod = this.filterByApplicationParametersGetDefault(allMethods, name, version, build, executable, flavor);
        if (!this.convertToSimple) {
            return categorizedMethod;
        }
        return this.convertToSimple(categorizedMethod);
    }
}
exports.ApplicationMethodStandata = ApplicationMethodStandata;
