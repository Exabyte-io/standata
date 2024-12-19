"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStandata =
    exports.PropertyStandata =
    exports.ApplicationStandata =
    exports.MaterialStandata =
    exports.Standata =
        void 0;
var base_1 = require("./base");
Object.defineProperty(exports, "Standata", {
    enumerable: true,
    get: function () {
        return base_1.Standata;
    },
});
var material_1 = require("./material");
Object.defineProperty(exports, "MaterialStandata", {
    enumerable: true,
    get: function () {
        return material_1.MaterialStandata;
    },
});
var application_1 = require("./application");
Object.defineProperty(exports, "ApplicationStandata", {
    enumerable: true,
    get: function () {
        return application_1.ApplicationStandata;
    },
});
var property_1 = require("./property");
Object.defineProperty(exports, "PropertyStandata", {
    enumerable: true,
    get: function () {
        return property_1.PropertyStandata;
    },
});
var workflow_1 = require("./workflow");
Object.defineProperty(exports, "WorkflowStandata", {
    enumerable: true,
    get: function () {
        return workflow_1.WorkflowStandata;
    },
});