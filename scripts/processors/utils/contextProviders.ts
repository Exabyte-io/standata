import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";

/**
 * Maps Standata template `contextProviders[].name` (wode class names) to the Jinja
 * rendering-context key each provider exposes via `ContextProvider.name`.
 *
 * Keep in sync with `PROVIDER_REGISTRY` in `@mat3ra/wode` (`context/providers/index.ts`).
 */
const CONTEXT_PROVIDER_JINJA_KEYS = {
    PlanewaveCutoffDataManager: "cutoffs",
    KGridFormDataManager: "kgrid",
    QGridFormDataManager: "qgrid",
    IGridFormDataManager: "igrid",
    QPathFormDataManager: "qpath",
    IPathFormDataManager: "ipath",
    KPathFormDataManager: "kpath",
    ExplicitKPathFormDataManager: "explicitKPath",
    ExplicitKPath2PIBAFormDataManager: "explicitKPath2PIBA",
    HubbardJContextManager: "hubbard_j",
    HubbardUContextManager: "hubbard_u",
    HubbardVContextManager: "hubbard_v",
    HubbardContextManagerLegacy: "hubbard_legacy",
    NEBFormDataManager: "neb",
    BoundaryConditionsFormDataManager: "boundaryConditions",
    MLSettingsDataManager: "mlSettings",
    MLTrainTestSplitDataManager: "mlTrainTestSplit",
    IonDynamicsContextProvider: "dynamics",
    CollinearMagnetizationDataManager: "collinearMagnetization",
    NonCollinearMagnetizationDataManager: "nonCollinearMagnetization",
    QEPWXInputDataManager: "input",
    QENEBInputDataManager: "input",
    VASPInputDataManager: "input",
    VASPNEBInputDataManager: "input",
    NWChemInputDataManager: "input",
} as const;

type ContextProviderClassName = keyof typeof CONTEXT_PROVIDER_JINJA_KEYS;

type UnusedTemplateContextProviderIssue = {
    applicationName: string;
    executableName: string;
    templateName: string;
    providerClassName: string;
    jinjaKey?: string;
    reason: "missing-jinja-reference" | "unknown-provider";
};

type TemplateForLint = Pick<
    TemplateSchema,
    "name" | "content" | "contextProviders" | "applicationName" | "executableName"
>;

/**
 * Templates may declare context providers that are not referenced in Jinja when the
 * provider is required for unit-level UI (e.g. Important settings) on the same execution unit.
 */
const TEMPLATE_CONTEXT_PROVIDER_LINT_ALLOWLIST = new Set<string>([
    // NEB image count is edited in Important settings; static INCAR for initial/final endpoints.
    "vasp/vasp/INCAR_NEB_INITIAL_FINAL/NEBFormDataManager",
]);

function getContextProviderJinjaKey(providerClassName: string): string | undefined {
    return CONTEXT_PROVIDER_JINJA_KEYS[providerClassName as ContextProviderClassName];
}

function isTemplateContextProviderLintAllowed(templateRef: {
    applicationName: string;
    executableName: string;
    name: string;
    providerClassName: string;
}): boolean {
    const key = [
        templateRef.applicationName,
        templateRef.executableName,
        templateRef.name,
        templateRef.providerClassName,
    ].join("/");

    return TEMPLATE_CONTEXT_PROVIDER_LINT_ALLOWLIST.has(key);
}

function stripJinjaRawBlocks(templateContent: string): string {
    return templateContent.replace(/\{%\s*raw\s*%\}[\s\S]*?\{%\s*endraw\s*%\}/g, "");
}

function isJinjaKeyReferencedInTemplate(templateContent: string, jinjaKey: string): boolean {
    const searchableContent = stripJinjaRawBlocks(templateContent);
    const keyPattern = jinjaKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${keyPattern}\\b`).test(searchableContent);
}

function findUnusedTemplateContextProviders(
    template: TemplateForLint,
): UnusedTemplateContextProviderIssue[] {
    const content = template.content ?? "";

    return (template.contextProviders ?? []).flatMap((provider) => {
        const providerClassName = provider.name;

        if (
            isTemplateContextProviderLintAllowed({
                applicationName: template.applicationName,
                executableName: template.executableName,
                name: template.name,
                providerClassName,
            })
        ) {
            return [];
        }

        const jinjaKey = getContextProviderJinjaKey(providerClassName);
        if (!jinjaKey) {
            return [
                {
                    applicationName: template.applicationName,
                    executableName: template.executableName,
                    templateName: template.name,
                    providerClassName,
                    reason: "unknown-provider" as const,
                },
            ];
        }

        if (isJinjaKeyReferencedInTemplate(content, jinjaKey)) {
            return [];
        }

        return [
            {
                applicationName: template.applicationName,
                executableName: template.executableName,
                templateName: template.name,
                providerClassName,
                jinjaKey,
                reason: "missing-jinja-reference" as const,
            },
        ];
    });
}

export function validateTemplateContextProviders(templates: TemplateForLint[]): void {
    const issues = templates.flatMap((template) => findUnusedTemplateContextProviders(template));

    if (issues.length === 0) {
        return;
    }

    const lines = issues.map((issue) => {
        if (issue.reason === "unknown-provider") {
            return [
                `${issue.applicationName}/${issue.executableName} template "${issue.templateName}":`,
                `  unknown context provider "${issue.providerClassName}" (not in CONTEXT_PROVIDER_JINJA_KEYS)`,
            ].join("\n");
        }

        return [
            `${issue.applicationName}/${issue.executableName} template "${issue.templateName}":`,
            `  context provider "${issue.providerClassName}" declares Jinja key "${issue.jinjaKey}" but template content does not reference it`,
        ].join("\n");
    });

    throw new Error(
        [
            "Template context provider lint failed:",
            "",
            ...lines,
            "",
            "Each template must reference every declared context provider's Jinja key, or be listed in contextProviders.ts allowlist.",
        ].join("\n"),
    );
}
