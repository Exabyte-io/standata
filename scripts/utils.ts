import * as fs from "fs";
import * as path from "path";

export function writeJSONFile(
    filePath: string,
    data: any,
    indent?: number,
    encoding: BufferEncoding = "utf8",
) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, indent), encoding);
}
