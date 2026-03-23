import { getRenderedTemplateFile, getTemplateContexts } from "@mat3ra/fixtures";
import { expect } from "chai";
import { Environment, FileSystemLoader } from "nunjucks";
import * as path from "path";

import { setupNunjucksEnvironment } from "../../src/js/utils/template";

/**
 * Normalize template output for comparison
 * - Removes trailing whitespace from each line (templates may produce it)
 * - Normalizes line endings for cross-platform compatibility
 */
function normalizeOutput(output: string): string {
    return output
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n")
        .replace(/\r\n/g, "\n");
}

const templateNames = [
    "cp_wf",
    "cp",
    "neb",
    "pw_bands_dft_j_magn",
    "pw_bands_dft_u_magn_legacy",
    "pw_bands_dft_u_magn",
    "pw_bands_dft_u_soc_legacy",
    "pw_bands_dft_u_soc",
    "pw_bands_dft_v_magn",
    "pw_bands_magn",
    "pw_bands_soc",
    "pw_bands",
    "pw_esm_relax",
    "pw_esm",
    "pw_md",
    "pw_nscf_dft_j_magn",
    "pw_nscf_dft_u_magn_legacy",
    "pw_nscf_dft_u_magn",
    "pw_nscf_dft_u_soc_legacy",
    "pw_nscf_dft_u_soc",
    "pw_nscf_dft_v_magn",
    "pw_nscf_magn",
    "pw_nscf_soc",
    "pw_nscf",
    "pw_relax",
    "pw_scf_bands_hse",
    "pw_scf_dft_j_magn",
    "pw_scf_dft_j",
    "pw_scf_dft_u_legacy",
    "pw_scf_dft_u_magn_legacy",
    "pw_scf_dft_u_magn",
    "pw_scf_dft_u_soc_legacy",
    "pw_scf_dft_u_soc",
    "pw_scf_dft_u",
    "pw_scf_dft_v_magn",
    "pw_scf_dft_v",
    "pw_scf_hse",
    "pw_scf_kpt_conv",
    "pw_scf_magn",
    "pw_scf_soc",
    "pw_scf",
    "pw_vc_relax_conv",
    "pw_vc_relax",
];

describe("Espresso Template Rendering", () => {
    const templatePath = path.join(
        __dirname,
        "../../assets/applications/input_files_templates/espresso",
    );
    const env = setupNunjucksEnvironment(new Environment(new FileSystemLoader(templatePath)));

    getTemplateContexts().forEach((context) => {
        templateNames.forEach((templateName) => {
            it(`should correctly render ${templateName} with ${context.name} context and match expected output`, () => {
                const renderedTemplateFile = getRenderedTemplateFile(context.name, templateName);
                const output = env.getTemplate(renderedTemplateFile.name).render(context.context);
                expect(normalizeOutput(output)).to.equal(renderedTemplateFile.content);
            });
        });
    });
});
