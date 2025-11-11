import serverUtils from "@mat3ra/utils/server";

import { BUILD_CONFIG } from "../../build-config";
import { MODEL_NAMES, MODEL_TREE } from "./modelTreeConstants";

export function buildModelTree(): void {
    const targetFile = `./${BUILD_CONFIG.models.build.path}/${BUILD_CONFIG.models.build.modelTree}`;

    console.log(`Building model tree...`);

    const modelTreeData = {
        MODEL_TREE,
        MODEL_NAMES,
    };

    serverUtils.json.writeJSONFileSync(targetFile, modelTreeData);
    console.log(`Generated: ${targetFile}`);
    console.log(`Model tree built successfully`);
}

if (require.main === module) {
    buildModelTree();
}
