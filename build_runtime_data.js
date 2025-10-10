

/* eslint-disable no-console */

require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
        module: "commonjs",
    },
});

require("./scripts/build.ts");
