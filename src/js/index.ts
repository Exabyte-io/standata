export { Standata } from "./base";
export { MaterialStandata } from "./material";
export { ApplicationStandata } from "./application";
export { PropertyStandata } from "./property";
export {
    WorkflowStandata,
    SubworkflowStandata,
    workflowSubworkflowMapByApplication,
} from "./workflow";
export { ApplicationModelStandata } from "./applicationModel";
export { ApplicationMethodStandata } from "./applicationMethod";
export { ModelStandata } from "./model";
export { MethodStandata } from "./method";
export { ModelMethodFilter, filterMethodsByModel } from "./modelMethodFilter";

// @ts-ignore
import modelTree from "./ui/modelTree.json";
// @ts-ignore
import methodTree from "./ui/methodTree.json";
// @ts-ignore
import baseUiSchema from "./ui/schemas.json";

export { modelTree, methodTree, baseUiSchema };
