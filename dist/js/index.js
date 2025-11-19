"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUiSchema = exports.methodTree = exports.modelTree = exports.filterMethodsByModel = exports.ModelMethodFilter = exports.MethodStandata = exports.ModelStandata = exports.ApplicationMethodStandata = exports.ApplicationModelStandata = exports.workflowSubforkflowMapByApplication = exports.SubworkflowStandata = exports.WorkflowStandata = exports.PropertyStandata = exports.ApplicationStandata = exports.MaterialStandata = exports.Standata = void 0;
var base_1 = require("./base");
Object.defineProperty(exports, "Standata", { enumerable: true, get: function () { return base_1.Standata; } });
var material_1 = require("./material");
Object.defineProperty(exports, "MaterialStandata", { enumerable: true, get: function () { return material_1.MaterialStandata; } });
var application_1 = require("./application");
Object.defineProperty(exports, "ApplicationStandata", { enumerable: true, get: function () { return application_1.ApplicationStandata; } });
var property_1 = require("./property");
Object.defineProperty(exports, "PropertyStandata", { enumerable: true, get: function () { return property_1.PropertyStandata; } });
var workflow_1 = require("./workflow");
Object.defineProperty(exports, "WorkflowStandata", { enumerable: true, get: function () { return workflow_1.WorkflowStandata; } });
Object.defineProperty(exports, "SubworkflowStandata", { enumerable: true, get: function () { return workflow_1.SubworkflowStandata; } });
Object.defineProperty(exports, "workflowSubforkflowMapByApplication", { enumerable: true, get: function () { return workflow_1.workflowSubforkflowMapByApplication; } });
var applicationModel_1 = require("./applicationModel");
Object.defineProperty(exports, "ApplicationModelStandata", { enumerable: true, get: function () { return applicationModel_1.ApplicationModelStandata; } });
var applicationMethod_1 = require("./applicationMethod");
Object.defineProperty(exports, "ApplicationMethodStandata", { enumerable: true, get: function () { return applicationMethod_1.ApplicationMethodStandata; } });
var model_1 = require("./model");
Object.defineProperty(exports, "ModelStandata", { enumerable: true, get: function () { return model_1.ModelStandata; } });
var method_1 = require("./method");
Object.defineProperty(exports, "MethodStandata", { enumerable: true, get: function () { return method_1.MethodStandata; } });
var modelMethodFilter_1 = require("./modelMethodFilter");
Object.defineProperty(exports, "ModelMethodFilter", { enumerable: true, get: function () { return modelMethodFilter_1.ModelMethodFilter; } });
Object.defineProperty(exports, "filterMethodsByModel", { enumerable: true, get: function () { return modelMethodFilter_1.filterMethodsByModel; } });
// @ts-ignore
const modelTree_json_1 = __importDefault(require("./ui/modelTree.json"));
exports.modelTree = modelTree_json_1.default;
// @ts-ignore
const methodTree_json_1 = __importDefault(require("./ui/methodTree.json"));
exports.methodTree = methodTree_json_1.default;
// @ts-ignore
const schemas_json_1 = __importDefault(require("./ui/schemas.json"));
exports.baseUiSchema = schemas_json_1.default;
