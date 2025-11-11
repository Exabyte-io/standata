import { deepClone } from "@mat3ra/code/dist/js/utils";
import serverUtils from "@mat3ra/utils/server";
import _ from "underscore";

import { BUILD_CONFIG } from "../../build-config";

const METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
} as const;

const methods: Record<string, string[]> = {
    [METHODS.pseudopotential]: ["paw", "nc", "nc-fr", "us"],
    [METHODS.localorbital]: ["pople"],
    [METHODS.unknown]: ["unknown"],
};

const DFTModelRefiners = ["hse", "g0w0"];
const DFTModelModifiers = ["soc", "magn"];

const DFTModelTree = {
    gga: {
        refiners: DFTModelRefiners,
        modifiers: DFTModelModifiers,
        methods,
        functionals: ["pbe", "pbesol", "pw91", "other"],
    },
    lda: {
        refiners: DFTModelRefiners,
        modifiers: DFTModelModifiers,
        methods,
        functionals: ["pz", "pw", "vwn", "other"],
    },
    hybrid: {
        methods,
        functionals: ["b3lyp", "hse06"],
    },
    other: {
        methods,
        functionals: ["other"],
    },
};

type ModelTree = Record<string, Record<string, any>>;
type DftOnlyTree = { dft: typeof DFTModelTree };

const MODEL_TREE: ModelTree = {
    dft: DFTModelTree,
    ml: {
        re: {
            methods: {
                linear: ["least_squares", "ridge"],
                kernel_ridge: ["least_squares"],
            },
        },
    },
    unknown: {
        unknown: {
            methods: {
                unknown: ["unknown"],
            },
        },
    },
};

const MODEL_NAMES: Record<string, string> = {
    dft: "density functional theory",
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functional",
    ml: "machine learning",
    re: "regression",
};

function buildModelsTreeConfigs(): Record<string, ModelTree> {
    const VASP_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft")) as DftOnlyTree;
    const ESPRESSO_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft")) as DftOnlyTree;
    const NWCHEM_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft")) as DftOnlyTree;

    (["gga", "lda"] as const).forEach((approximation) => {
        VASP_MODELS_TREE.dft[approximation].methods.pseudopotential = VASP_MODELS_TREE.dft[
            approximation
        ].methods.pseudopotential.splice(0, 1);

        ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential =
            ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential.reverse();
    });

    const UNKNOWN_MODELS_TREE = _.pick(MODEL_TREE, "unknown") as ModelTree;

    return {
        vasp: VASP_MODELS_TREE,
        espresso: ESPRESSO_MODELS_TREE,
        python: UNKNOWN_MODELS_TREE,
        shell: UNKNOWN_MODELS_TREE,
        jupyterLab: UNKNOWN_MODELS_TREE,
        nwchem: NWCHEM_MODELS_TREE,
        deepmd: UNKNOWN_MODELS_TREE,
    };
}

export function buildModelsTreeConfigByApplication(): void {
    const modelsTreeConfigByApplication = buildModelsTreeConfigs();
    const modelsTreeConfigPath = `./${BUILD_CONFIG.models.build.path}/${BUILD_CONFIG.models.build.modelsTreeConfigByApplication}`;

    console.log(`Building models tree config by application...`);
    serverUtils.json.writeJSONFileSync(modelsTreeConfigPath, modelsTreeConfigByApplication);
    console.log(`Generated: ${modelsTreeConfigPath}`);

    const modelTreeDataPath = `./${BUILD_CONFIG.models.build.path}/modelTree.json`;
    const modelTreeData = {
        MODEL_TREE,
        MODEL_NAMES,
    };
    serverUtils.json.writeJSONFileSync(modelTreeDataPath, modelTreeData);
    console.log(`Generated: ${modelTreeDataPath}`);

    console.log(
        `Models tree config built successfully with ${Object.keys(modelsTreeConfigByApplication).length} applications`,
    );
}

// Run if called directly
if (require.main === module) {
    buildModelsTreeConfigByApplication();
}
