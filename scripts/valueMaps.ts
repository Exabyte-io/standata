/**
 * Human-readable mapping for methods and models shortwords.
 * Used for transforming abbreviated category values to full names.
 */
export const METHOD_MODEL_VALUE_MAP: Record<string, string> = {
    // Tier1 - Method categories
    qm: "quantum mechanics",
    opt: "optimization",
    linalg: "linear algebra",
    pb: "physics-based",
    st: "statistical",
    mm: "molecular mechanics",

    // Tier2 - Method subcategories
    wf: "wave function",
    diff: "differential",
    diag: "diagonalization",
    det: "deterministic",

    // Tier3 - Detailed method types
    ordern: "order-n",
    dft: "density functional theory",
    abin: "ab initio",
    ml: "machine learning",

    // Types
    psp: "pseudopotential",
    pw: "plane wave",
    smearing: "smearing",
    tetrahedron: "tetrahedron",
    cg: "conjugate gradient",
    ksdft: "Kohn-Sham DFT",
    gw: "GW approximation",
    re: "regression",

    // Subtypes - Pseudopotentials
    nc: "norm conserving",
    us: "ultrasoft",
    paw: "projector augmented wave",
    gaussian: "gaussian smearing",
    linear: "linear",

    // Subtypes - Functionals
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functionals",
    g0w0: "G0W0",
    evgw0: "evGW0",
    evgw: "evGW",

    // Functional parameters
    pz: "Perdew-Zunger",
    pbe: "Perdew-Burke-Ernzerhof",
    pbesol: "PBE for solids",
    hse06: "Heyd-Scuseria-Ernzerhof",
    b3lyp: "Becke 3-parameter Lee-Yang-Parr",
};
