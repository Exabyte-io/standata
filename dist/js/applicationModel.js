"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModelStandata = void 0;
const applicationFilter_1 = require("./utils/applicationFilter");
const modelMethodMapByApplication_json_1 = __importDefault(require("./runtime_data/modelMethodMapByApplication.json"));
class ApplicationModelStandata extends applicationFilter_1.ApplicationFilterStandata {
    constructor() {
        const data = modelMethodMapByApplication_json_1.default;
        super(data === null || data === void 0 ? void 0 : data.models);
    }
    findByApplicationParameters({ modelList, applicationName, version, build, executable, flavor, }) {
        return this.filterByApplicationParameters(modelList, applicationName, version, build, executable, flavor);
    }
    getAvailableModels(applicationName) {
        return this.getAvailableEntities(applicationName);
    }
}
exports.ApplicationModelStandata = ApplicationModelStandata;
