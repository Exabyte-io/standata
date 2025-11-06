/* eslint-disable */
module.exports = {
    method: {
        path: "/",
        data: null,
        children: [
            {
                path: "/linalg",
                data: { key: "tier1", value: "linalg", name: "Linear Algebra" },
                children: [
                    {
                        path: "/linalg/diag",
                        data: { key: "tier2", value: "diag", name: "Diagonalization" },
                        children: [
                            {
                                path: "/linalg/diag/davidson",
                                data: {
                                    key: "type",
                                    value: "davidson",
                                    name: "Davidson Diagonalization",
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: "/qm",
                data: { key: "tier1", value: "qm", name: "Quantum-Mechanical" },
                children: [
                    {
                        path: "/qm/wf",
                        data: { key: "tier2", value: "wf", name: "Wave Function" },
                        children: [
                            {
                                path: "/qm/wf/ao",
                                data: { key: "type", value: "ao", name: "Atomic Orbital" },
                                children: [
                                    {
                                        path: "/qm/wf/ao/pople",
                                        data: {
                                            key: "subtype",
                                            value: "pople",
                                            name: "Pople Basis",
                                        },
                                        staticOptions: [
                                            {
                                                key: "basisSlug",
                                                values: ["3-21G", "6-31G", "6-311G"],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                path: "/qm/wf/pw",
                                data: { key: "type", value: "pw", name: "Plane Wave" },
                            },
                            {
                                path: "/qm/wf/psp",
                                data: { key: "type", value: "psp", name: "Pseudopotential" },
                                children: [
                                    {
                                        path: "/qm/wf/psp/us",
                                        data: { key: "subtype", value: "us", name: "Ultra-Soft" },
                                    },
                                    {
                                        path: "/qm/wf/psp/nc",
                                        data: {
                                            key: "subtype",
                                            value: "nc",
                                            name: "Norm-conserving",
                                        },
                                    },
                                    {
                                        path: "/qm/wf/psp/nc-fr",
                                        data: {
                                            key: "subtype",
                                            value: "nc-fr",
                                            name: "Norm-conserving Fully-relativistic",
                                        },
                                    },
                                    {
                                        path: "/qm/wf/psp/paw",
                                        data: {
                                            key: "subtype",
                                            value: "paw",
                                            name: "Projector-Augmented Wave",
                                        },
                                    },
                                ],
                            },
                            {
                                path: "/qm/wf/smearing",
                                data: {
                                    key: "type",
                                    value: "smearing",
                                    name: "Occupation Number Smearing",
                                },
                                children: [
                                    {
                                        path: "/qm/wf/smearing/gaussian",
                                        data: {
                                            key: "subtype",
                                            value: "gaussian",
                                            name: "Gaussian",
                                        },
                                    },
                                    {
                                        path: "/qm/wf/smearing/methfessel-paxton",
                                        data: {
                                            key: "subtype",
                                            value: "methfessel-paxton",
                                            name: "Methfessel-Paxton",
                                        },
                                    },
                                ],
                            },
                            {
                                path: "/qm/wf/tetrahedron",
                                data: {
                                    key: "type",
                                    value: "tetrahedron",
                                    name: "Tetrahedron Method",
                                },
                                children: [
                                    {
                                        path: "/qm/wf/tetrahedron/linear",
                                        data: { key: "subtype", value: "linear", name: "Linear" },
                                    },
                                    {
                                        path: "/qm/wf/tetrahedron/optimized",
                                        data: {
                                            key: "subtype",
                                            value: "optimized",
                                            name: "Optimized (Kawamura)",
                                        },
                                    },
                                    {
                                        path: "/qm/wf/tetrahedron/bloechl",
                                        data: { key: "subtype", value: "bloechl", name: "Bloechl" },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    model: {
        path: "/",
        data: null,
        children: [
            {
                path: "/pb",
                data: { key: "tier1", value: "pb", name: "Physics-based" },
                children: [
                    {
                        path: "/pb/qm",
                        data: { key: "tier2", value: "qm", name: "Quantum-mechanical" },
                        children: [
                            {
                                path: "/pb/qm/dft",
                                data: {
                                    key: "tier3",
                                    value: "dft",
                                    name: "Density Functional Theory",
                                },
                                children: [
                                    {
                                        path: "/pb/qm/dft/ksdft",
                                        data: {
                                            key: "type",
                                            value: "ksdft",
                                            name: "Kohn-Sham DFT",
                                        },
                                        children: [
                                            {
                                                path: "/pb/qm/dft/ksdft/lda",
                                                data: { key: "subtype", value: "lda", name: "LDA" },
                                                staticOptions: [
                                                    {
                                                        key: "functional",
                                                        values: ["pz"],
                                                        namesMap: "manifest/names_map.yml#/lda",
                                                    },
                                                ],
                                            },
                                            {
                                                path: "/pb/qm/dft/ksdft/gga",
                                                data: { key: "subtype", value: "gga", name: "GGA" },
                                                staticOptions: [
                                                    {
                                                        key: "functional",
                                                        values: ["pbe", "pbesol"],
                                                        namesMap: "manifest/names_map.yml#/gga",
                                                    },
                                                ],
                                            },
                                            {
                                                path: "/pb/qm/dft/ksdft/hybrid",
                                                data: {
                                                    key: "subtype",
                                                    value: "hybrid",
                                                    name: "Hybrid Functional",
                                                },
                                                staticOptions: [
                                                    {
                                                        key: "functional",
                                                        values: ["hse06", "b3lyp"],
                                                        namesMap: "manifest/names_map.yml#/hybrid",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
