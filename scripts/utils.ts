import * as fs from "fs";
import * as path from "path";

import BUILD_CONFIG from "../build-config";

export function writeJSONFile(
    filePath: string,
    data: any,
    spaces: number = BUILD_CONFIG.jsonFormat.spaces,
    encoding: BufferEncoding = "utf8",
) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, spaces), encoding);
}
