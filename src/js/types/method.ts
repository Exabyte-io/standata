export interface MethodUnit {
    name: string;
    path: string;
    categories: {
        tier1?: string;
        tier2?: string;
        tier3?: string;
        type: string;
        subtype?: string;
    };
    parameters?: Record<string, any>;
    tags: string[];
}

export interface MethodConfig {
    name: string;
    path: string;
    units: MethodUnit[];
}
