/* This script build the RJSF schemas for models and methods from the Yaml assets in `./ui`.
 */

// @ts-ignore
import { buildJSONFromYAMLInDir } from "../../scripts/utils";
import { BUILD_CONFIG as ROOT_BUILD_CONFIG } from "../../build-config";
import { BUILD_CONFIG } from "../build-config";

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.assets.model,
    targetPath: `${BUILD_CONFIG.data.commonPath}/${BUILD_CONFIG.data.model}`,
    workingDir: BUILD_CONFIG.assets.commonPath,
    spaces: ROOT_BUILD_CONFIG.dataJSONFormat.spaces,
});

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.assets.method,
    targetPath: `${BUILD_CONFIG.data.commonPath}/${BUILD_CONFIG.data.method}`,
    workingDir: BUILD_CONFIG.assets.commonPath,
    spaces: ROOT_BUILD_CONFIG.dataJSONFormat.spaces,
});

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.assets.model,
    targetPath: `${BUILD_CONFIG.dist.commonPath}/${BUILD_CONFIG.dist.model}`,
    workingDir: BUILD_CONFIG.assets.commonPath,
    spaces: ROOT_BUILD_CONFIG.buildJSONFormat.spaces,
});

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.assets.method,
    targetPath: `${BUILD_CONFIG.dist.commonPath}/${BUILD_CONFIG.dist.method}`,
    workingDir: BUILD_CONFIG.assets.commonPath,
    spaces: ROOT_BUILD_CONFIG.buildJSONFormat.spaces,
});
