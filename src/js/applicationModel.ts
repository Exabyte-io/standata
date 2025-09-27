import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";
import {
    ApplicationModelParametersInterface,
    ModelMethodMapByApplication,
} from "./types/applicationFilter";
import { ApplicationFilterStandata } from "./utils/applicationFilter";

export class ApplicationModelStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as ModelMethodMapByApplication;
        super(data?.models as any);
    }

    findByApplicationParameters({
        modelList,
        name,
        version,
        build,
        executable,
        flavor,
    }: ApplicationModelParametersInterface): any[] {
        return this.filterByApplicationParameters(
            modelList,
            name,
            version,
            build,
            executable,
            flavor,
        );
    }

    getAvailableModels(name: string): any {
        return this.getAvailableEntities(name);
    }
}
