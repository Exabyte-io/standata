const fs = require("fs");
const path = require("path");

function getApplicationNamesFromSources() {
    const dataFilePath = path.resolve(
        process.cwd(),
        "applications",
        "sources",
        "applications_data.yaml",
    );
    if (!fs.existsSync(dataFilePath)) return [];
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    const names = [];
    fileContent.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^\s*-\s*([A-Za-z0-9_-]+)\s*:/);
        if (match && match[1]) names.push(match[1]);
    });
    return names;
}

module.exports = { getApplicationNamesFromSources };


