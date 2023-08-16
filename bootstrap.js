// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");

// INIT_CWD is used during npm install - see https://docs.npmjs.com/cli/v9/using-npm/scripts#best-practices
const isDependency = !process.env.INIT_CWD ? false : process.env.INIT_CWD !== process.cwd();

if (isDependency) {
    process.exit();
}

try {
    const stdout = execSync("pre-commit install", { encoding: "utf8" });
    console.log(stdout);
} catch (_) {
    console.warn("Unable to install pre-commit hooks!");
    console.log("Please install pre-commit, e.g. 'pip install pre-commit'");
}
