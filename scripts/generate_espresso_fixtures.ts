import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { sprintf } from "sprintf-js";

// Base context data for testing
const BASE_CONTEXT = {
    subworkflowContext: {},
    input: {
        RESTART_MODE: "from_scratch",
        IBRAV: 0,
        NAT: 4,
        NTYP: 2,
        NTYP_WITH_LABELS: 2,
        ATOMIC_SPECIES: [
            {
                X: "Fe",
                Mass_X: 55.845,
                PseudoPot_X: "Fe.pbe-spn-rrkjus_psl.1.0.0.UPF",
            },
            {
                X: "O",
                Mass_X: 15.999,
                PseudoPot_X: "O.pbe-n-rrkjus_psl.1.0.0.UPF",
            },
        ],
        ATOMIC_SPECIES_WITH_LABELS: [
            {
                X: "Fe",
                Mass_X: 55.845,
                PseudoPot_X: "Fe.pbe-spn-rrkjus_psl.1.0.0.UPF",
            },
            {
                X: "O",
                Mass_X: 15.999,
                PseudoPot_X: "O.pbe-n-rrkjus_psl.1.0.0.UPF",
            },
        ],
        ATOMIC_POSITIONS: [
            {
                X: "Fe",
                x: 0.0,
                y: 0.0,
                z: 0.0,
                "if_pos(1)": 0,
                "if_pos(2)": 1,
                "if_pos(3)": 1,
            },
            {
                X: "Fe",
                x: 0.5,
                y: 0.5,
                z: 0.5,
                "if_pos(1)": 1,
                "if_pos(2)": 1,
                "if_pos(3)": 1,
            },
            {
                X: "O",
                x: 0.25,
                y: 0.25,
                z: 0.25,
                "if_pos(1)": 1,
                "if_pos(2)": 1,
                "if_pos(3)": 1,
            },
            {
                X: "O",
                x: 0.75,
                y: 0.75,
                z: 0.75,
                "if_pos(1)": 1,
                "if_pos(2)": 1,
                "if_pos(3)": 1,
            },
        ],
        CELL_PARAMETERS: {
            v1: [5.0, 0.0, 0.0],
            v2: [0.0, 5.0, 0.0],
            v3: [0.0, 0.0, 5.0],
        },
    },
    dynamics: {
        numberOfSteps: 100,
        timeStep: 0.1,
        electronMass: 400.0,
        temperature: 300.0,
    },
    cutoffs: {
        wavefunction: 50.0,
        density: 200.0,
    },
    JOB_WORK_DIR: "/tmp/test_job",
    kgrid: {
        dimensions: [4, 4, 4],
        shifts: [0, 0, 0],
    },
    kpath: [
        { coordinates: [0.0, 0.0, 0.0], steps: 20 },
        { coordinates: [0.5, 0.5, 0.5], steps: 20 },
    ],
    collinearMagnetization: {
        isTotalMagnetization: false,
        startingMagnetization: [
            { index: 1, value: 0.5 },
            { index: 2, value: 0.0 },
        ],
    },
    nonCollinearMagnetization: {
        isStartingMagnetization: false,
        isConstrainedMagnetization: false,
        isFixedMagnetization: false,
        isExistingChargeDensity: false,
        isArbitrarySpinDirection: false,
    },
    hubbard_u: [{ atomicSpecies: "Fe", atomicOrbital: "3d", hubbardUValue: 4.0 }],
    hubbard_legacy: [{ atomicSpeciesIndex: 1, hubbardUValue: 4.0 }],
    hubbard_v: [{ atomicSpecies: "Fe", atomicOrbital: "3d", hubbardVValue: 2.0 }],
    hubbard_j: [{ atomicSpecies: "Fe", atomicOrbital: "3d", hubbardJValue: 1.0 }],
};

// Context for neb.j2.in (needs INTERMEDIATE_IMAGES)
const NEB_CONTEXT = {
    ...BASE_CONTEXT,
    input: {
        ...BASE_CONTEXT.input,
        INTERMEDIATE_IMAGES: [
            [
                {
                    X: "Fe",
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                    "if_pos(1)": 1,
                    "if_pos(2)": 1,
                    "if_pos(3)": 1,
                },
                {
                    X: "Fe",
                    x: 0.3,
                    y: 0.3,
                    z: 0.3,
                    "if_pos(1)": 1,
                    "if_pos(2)": 1,
                    "if_pos(3)": 1,
                },
            ],
        ],
        FIRST_IMAGE: BASE_CONTEXT.input.ATOMIC_POSITIONS,
        LAST_IMAGE: BASE_CONTEXT.input.ATOMIC_POSITIONS,
    },
    neb: {
        nImages: 1,
    },
};

/**
 * Set up nunjucks environment with custom filters
 */
function setupNunjucksEnvironment(): nunjucks.Environment {
    const templatePath = path.join(
        __dirname,
        "../assets/applications/input_files_templates/espresso",
    );
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatePath));

    // Add custom filter for raw blocks (for JOB_WORK_DIR)
    env.addFilter("raw", (str: string) => {
        return str;
    });

    // Add custom filter for sprintf-style formatting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env.addFilter("sprintf", (value: any, format: string) => {
        return sprintf(format, value);
    });

    return env;
}

/**
 * Normalize template output for comparison
 * - Removes trailing whitespace from each line
 * - Normalizes line endings for cross-platform compatibility
 */
function normalizeOutput(output: string): string {
    return output
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n")
        .replace(/\r\n/g, "\n");
}

/**
 * Get context for a specific template
 */
function getContextForTemplate(templateName: string): any {
    if (templateName === "neb.j2.in") {
        return NEB_CONTEXT;
    }
    return BASE_CONTEXT;
}

/**
 * Generate fixtures for all templates
 */
function generateFixtures() {
    const env = setupNunjucksEnvironment();
    const templateDir = path.join(
        __dirname,
        "../assets/applications/input_files_templates/espresso",
    );
    const fixtureDir = path.join(__dirname, "../tests/js/fixtures/espresso_templates");

    // Ensure fixture directory exists
    if (!fs.existsSync(fixtureDir)) {
        fs.mkdirSync(fixtureDir, { recursive: true });
    }

    // Get all template files
    const templateFiles = fs.readdirSync(templateDir).filter((file) => file.endsWith(".j2.in"));

    // Check which templates use ATOMIC_POSITIONS, ATOMIC_SPECIES, or CELL_PARAMETERS
    const templatesToTest: string[] = [];
    for (const templateFile of templateFiles) {
        const templatePath = path.join(templateDir, templateFile);
        const content = fs.readFileSync(templatePath, "utf-8");
        if (
            content.includes("ATOMIC_POSITIONS") ||
            content.includes("ATOMIC_SPECIES") ||
            content.includes("CELL_PARAMETERS")
        ) {
            templatesToTest.push(templateFile);
        }
    }

    console.log(`Found ${templatesToTest.length} templates to generate fixtures for:`);
    templatesToTest.forEach((t) => console.log(`  - ${t}`));

    // Generate fixtures
    for (const templateFile of templatesToTest) {
        try {
            const template = env.getTemplate(templateFile);
            const context = getContextForTemplate(templateFile);
            const output = template.render(context);
            const normalizedOutput = normalizeOutput(output);

            const fixturePath = path.join(fixtureDir, `${templateFile}.txt`);
            fs.writeFileSync(fixturePath, normalizedOutput, "utf-8");
            console.log(`✓ Generated fixture: ${templateFile}.txt`);
        } catch (error) {
            console.error(`✗ Error generating fixture for ${templateFile}:`, error);
        }
    }

    console.log(`\nGenerated ${templatesToTest.length} fixture files in ${fixtureDir}`);
    return templatesToTest;
}

// Run the script
if (require.main === module) {
    generateFixtures();
}

export { generateFixtures, getContextForTemplate, BASE_CONTEXT, NEB_CONTEXT };
