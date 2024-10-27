export const fraudTransactionNetwork = {
    nodes: [
        // Source accounts (originators)
        { id: "6191871562", label: "Origin Account", weight: 450000, type: "source" },
        { id: "6191877623", label: "Origin Account B", weight: 380000, type: "source" },
        
        // First layer money mules
        { id: "6198234571", label: "Mule L1-A", weight: 125000, type: "mule" },
        { id: "6198234985", label: "Mule L1-B", weight: 138000, type: "mule" },
        { id: "6198235492", label: "Mule L1-C", weight: 142000, type: "mule" },
        { id: "6198236104", label: "Mule L1-D", weight: 135000, type: "mule" },
        
        // Second layer money mules (layering)
        { id: "6215673421", label: "Mule L2-A", weight: 98000, type: "mule" },
        { id: "6215674563", label: "Mule L2-B", weight: 92000, type: "mule" },
        { id: "6215675784", label: "Mule L2-C", weight: 88000, type: "mule" },
        
        // Third layer money mules (additional layering)
        { id: "6224891245", label: "Mule L3-A", weight: 75000, type: "mule" },
        { id: "6224892367", label: "Mule L3-B", weight: 82000, type: "mule" },
        
        // Final beneficiary accounts
        { id: "6230044016", label: "Final Beneficiary", weight: 285000, type: "beneficiary" },
        { id: "6230044892", label: "Final Beneficiary B", weight: 265000, type: "beneficiary" }
    ],
    edges: [
        // Initial transfers from source accounts
        {
            id: "TX001",
            from: "6191871562",
            to: "6198234571",
            amount: 49900,
            timestamp: "2024-02-01T09:15:00",
            title: "Initial transfer - Just below reporting threshold"
        },
        {
            id: "TX002",
            from: "6191871562",
            to: "6198234985",
            amount: 49500,
            timestamp: "2024-02-01T09:18:00",
            title: "Initial transfer - Structured amount"
        },
        {
            id: "TX003",
            from: "6191871562",
            to: "6198235492",
            amount: 48900,
            timestamp: "2024-02-01T09:22:00",
            title: "Initial transfer - Part of rapid succession"
        },
        {
            id: "TX004",
            from: "6191877623",
            to: "6198236104",
            amount: 49200,
            timestamp: "2024-02-01T09:25:00",
            title: "Initial transfer - Multiple recipients pattern"
        },
        
        // First layer to second layer transfers
        {
            id: "TX005",
            from: "6198234571",
            to: "6215673421",
            amount: 47500,
            timestamp: "2024-02-01T14:30:00",
            title: "Layering - Quick forward within same day"
        },
        {
            id: "TX006",
            from: "6198234985",
            to: "6215674563",
            amount: 46800,
            timestamp: "2024-02-01T14:45:00",
            title: "Layering - Fund consolidation"
        },
        {
            id: "TX007",
            from: "6198235492",
            to: "6215675784",
            amount: 47200,
            timestamp: "2024-02-01T15:00:00",
            title: "Layering - Multiple hops"
        },
        
        // Cross-transfers between mules (complexity building)
        {
            id: "TX008",
            from: "6198234571",
            to: "6198235492",
            amount: 15000,
            timestamp: "2024-02-01T16:20:00",
            title: "Complex routing - Inter-mule transfer"
        },
        {
            id: "TX009",
            from: "6215673421",
            to: "6215674563",
            amount: 12500,
            timestamp: "2024-02-01T16:45:00",
            title: "Complex routing - Layer mixing"
        },
        
        // Second layer to third layer transfers
        {
            id: "TX010",
            from: "6215673421",
            to: "6224891245",
            amount: 44500,
            timestamp: "2024-02-02T10:15:00",
            title: "Further layering - Extended route"
        },
        {
            id: "TX011",
            from: "6215674563",
            to: "6224892367",
            amount: 43800,
            timestamp: "2024-02-02T10:30:00",
            title: "Further layering - Complex path"
        },
        
        // Final transfers to beneficiary accounts
        {
            id: "TX012",
            from: "6224891245",
            to: "6230044016",
            amount: 42000,
            timestamp: "2024-02-02T15:45:00",
            title: "Final consolidation - Primary beneficiary"
        },
        {
            id: "TX013",
            from: "6224892367",
            to: "6230044016",
            amount: 41500,
            timestamp: "2024-02-02T16:00:00",
            title: "Final consolidation - Secondary route"
        },
        {
            id: "TX014",
            from: "6215675784",
            to: "6230044892",
            amount: 43200,
            timestamp: "2024-02-02T16:15:00",
            title: "Final transfer - Alternative beneficiary"
        }
    ]
};