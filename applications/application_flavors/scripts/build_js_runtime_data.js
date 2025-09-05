const fs = require("fs");
const path = require("path");

// Read the generated standata format
const standataFormatPath = path.resolve(__dirname, "..", "generated", "standata_format.json");
const standataFormat = JSON.parse(fs.readFileSync(standataFormatPath, "utf8"));

// Write to JS runtime data location
const jsRuntimeDataPath = path.resolve(__dirname, "..", "..", "..", "src", "js", "runtime_data", "application_flavors.json");
const jsRuntimeDataDir = path.dirname(jsRuntimeDataPath);

if (!fs.existsSync(jsRuntimeDataDir)) {
    fs.mkdirSync(jsRuntimeDataDir, { recursive: true });
}

fs.writeFileSync(jsRuntimeDataPath, JSON.stringify(standataFormat, null, 2), "utf8");
console.log(`JavaScript runtime data written to: ${jsRuntimeDataPath}`);
