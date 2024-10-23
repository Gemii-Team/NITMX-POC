import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Network,  Options } from 'vis-network/standalone';
import { ArrowDownRight, ArrowUpLeft, Filter, ArrowLeftRight } from 'lucide-react';

interface TransactionNode {
    id: string;
    label: string;
    title?: string;
    weight?: number;
    size?: number;
}

interface TransactionEdge {
    id: string;
    from: string;
    to: string;
    amount: number;
    title?: string;
    label?: string;
    width?: number;
}

interface TransactionGraph {
    nodes: TransactionNode[];
    edges: TransactionEdge[];
}

interface Props {
    data: TransactionGraph;
    onNodeSelect?: (node: TransactionNode | null) => void;
}

interface FilterState {
    direction: 'all' | 'incoming' | 'outgoing';
    minWeight: number;
    maxWeight: number;
    selectedNode: string | null;
}


interface HoverInfo {
    node: TransactionNode | null;
    position: { x: number; y: number } | null;
}

const interpolateColor = (weight: number, minWeight: number, maxWeight: number): string => {
    const normalized = (weight - minWeight) / (maxWeight - minWeight);
    const colors = [
        { point: 0, color: [65, 182, 196] },
        { point: 0.3, color: [127, 205, 187] },
        { point: 0.5, color: [199, 233, 180] },
        { point: 0.7, color: [252, 174, 145] },
        { point: 1, color: [215, 25, 28] }
    ];

    let colorA = colors[0], colorB = colors[1];
    for (let i = 1; i < colors.length; i++) {
        if (normalized <= colors[i].point) {
            colorA = colors[i - 1];
            colorB = colors[i];
            break;
        }
    }

    const factor = (normalized - colorA.point) / (colorB.point - colorA.point);

    const r = Math.round(colorA.color[0] + factor * (colorB.color[0] - colorA.color[0]));
    const g = Math.round(colorA.color[1] + factor * (colorB.color[1] - colorA.color[1]));
    const b = Math.round(colorA.color[2] + factor * (colorB.color[2] - colorA.color[2]));

    return `rgb(${r},${g},${b})`;
};

const TransactionNetwork: React.FC<Props> = ({ data, onNodeSelect }) => {

    const networkRef = useRef<HTMLDivElement>(null);
    const [networkInstance, setNetworkInstance] = useState<Network | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        direction: 'all',
        minWeight: 0,
        maxWeight: Infinity,
        selectedNode: null
    });

    const networkStats = useMemo(() => {
        const stats = {
            nodeWeights: new Map<string, number>(),
            incomingWeights: new Map<string, number>(),
            outgoingWeights: new Map<string, number>(),
            incomingConnections: new Map<string, Set<string>>(),
            outgoingConnections: new Map<string, Set<string>>(),
            maxWeight: 0,
            minWeight: Infinity,
            maxAmount: 0
        };
        data.edges.forEach(edge => {
            stats.maxAmount = Math.max(stats.maxAmount, edge.amount);
            const fromOutWeight = (stats.outgoingWeights.get(edge.from) || 0) + edge.amount;
            stats.outgoingWeights.set(edge.from, fromOutWeight);
            const toInWeight = (stats.incomingWeights.get(edge.to) || 0) + edge.amount;
            stats.incomingWeights.set(edge.to, toInWeight);
            if (!stats.outgoingConnections.has(edge.from)) {
                stats.outgoingConnections.set(edge.from, new Set());
            }
            if (!stats.incomingConnections.has(edge.to)) {
                stats.incomingConnections.set(edge.to, new Set());
            }
            stats.outgoingConnections.get(edge.from)?.add(edge.to);
            stats.incomingConnections.get(edge.to)?.add(edge.from);
        });
        data.nodes.forEach(node => {
            const inWeight = stats.incomingWeights.get(node.id) || 0;
            const outWeight = stats.outgoingWeights.get(node.id) || 0;
            const totalWeight = inWeight + outWeight;
            stats.nodeWeights.set(node.id, totalWeight);
            stats.maxWeight = Math.max(stats.maxWeight, totalWeight);
            stats.minWeight = Math.min(stats.minWeight, totalWeight);
        });
        return stats;
    }, [data]);

    const filteredData = useMemo(() => {
        const relevantNodes = new Set<string>();

        if (filters.selectedNode) {
            relevantNodes.add(filters.selectedNode);
            if (filters.direction === 'all' || filters.direction === 'outgoing') {
                networkStats.outgoingConnections.get(filters.selectedNode)?.forEach(node => {
                    relevantNodes.add(node);
                });
            }
            if (filters.direction === 'all' || filters.direction === 'incoming') {
                networkStats.incomingConnections.get(filters.selectedNode)?.forEach(node => {
                    relevantNodes.add(node);
                });
            }
        } else {
            data.nodes.forEach(node => {
                const weight = networkStats.nodeWeights.get(node.id) || 0;
                if (weight >= filters.minWeight && weight <= filters.maxWeight) {
                    relevantNodes.add(node.id);
                }
            });
        }

        const filteredEdges = data.edges.filter(edge => {
            if (!relevantNodes.has(edge.from) || !relevantNodes.has(edge.to)) {
                return false;
            }
            if (filters.selectedNode) {
                switch (filters.direction) {
                    case 'incoming':
                        return edge.to === filters.selectedNode;
                    case 'outgoing':
                        return edge.from === filters.selectedNode;
                    default:
                        return true;
                }
            }
            return true;
        }).map(edge => ({
            ...edge,
            width: 1 + Math.log(edge.amount / networkStats.maxAmount * 10 + 1) * 2,
            color: {
                color: `rgba(148, 163, 184, ${Math.log(edge.amount / networkStats.maxAmount + 1) * 0.5})`,
                highlight: '#F59E0B',
                hover: '#818CF8'
            }
        }));

        const filteredNodes = data.nodes.filter(node =>
            relevantNodes.has(node.id)
        ).map(node => {
            const weight = networkStats.nodeWeights.get(node.id) || 0;
            const size = 10 + (weight / networkStats.maxWeight) * 40;
            const color = interpolateColor(
                weight,
                networkStats.minWeight,
                networkStats.maxWeight
            );

            return {
                ...node,
                size,
                color: {
                    background: color,
                    border: color,
                    highlight: {
                        background: color,
                        border: '#000000'
                    },
                    hover: {
                        background: color,
                        border: '#000000'
                    }
                }
            };
        });

        return { nodes: filteredNodes, edges: filteredEdges };
    }, [data, filters, networkStats]);

    const [hoverInfo, setHoverInfo] = useState<HoverInfo>({
        node: null,
        position: null
    });

    const options = useMemo((): Options => ({
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 12,
                color: '#000000',
                face: 'Inter, sans-serif',
                strokeWidth: 2,
                strokeColor: '#ffffff'
            },
            borderWidth: 2,
            fixed: {
                x: false,
                y: false
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.2)',
                size: 5
            }
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.5,
                    type: 'arrow'
                }
            },
            smooth: {
                enabled: true,
                type: 'cubicBezier',
                roundness: 0.5,
                forceDirection: 'none'
            },
            width: 1,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.1)',
                size: 3
            }
        },
        physics: {
            enabled: true,
            forceAtlas2Based: {
                gravitationalConstant: -100,
                centralGravity: 0.02,
                springLength: 100,
                springConstant: 0.05,
                damping: 0.4,
                avoidOverlap: 1
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'forceAtlas2Based',
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 25,
                onlyDynamicEdges: false,
                fit: true
            },
            timestep: 0.5,
            adaptiveTimestep: true
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            zoomView: true,
            dragView: true,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
            navigationButtons: true,
            keyboard: true
        },
        layout: {
            improvedLayout: true,
            randomSeed: 42,
            hierarchical: {
                enabled: false
            }
        }
    }), []);

    useEffect(() => {
        if (!networkRef.current) return;

        const network = new Network(
            networkRef.current,
            filteredData,
            options
        );

        // network.on('hoverNode', (params) => {
        //     const nodeId = params.node;
        //     const node = data.nodes.find(n => n.id === nodeId);
        //     if (node) {
        //         const canvasPosition = network.getPositions([nodeId])[nodeId];
        //         const DOMPosition = network.canvasToDOM(canvasPosition);

        //         setHoverInfo({
        //             node,
        //             position: {
        //                 x: DOMPosition.x,
        //                 y: DOMPosition.y
        //             }
        //         });
        //     }
        // });

        network.on('click', (params: { nodes: string[] }) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                setFilters(prev => ({
                    ...prev,
                    selectedNode: nodeId === prev.selectedNode ? null : nodeId
                }));
            } else {
                setFilters(prev => ({ ...prev, selectedNode: null }));
            }
        });

        network.on('blurNode', () => {
            setHoverInfo({ node: null, position: null });
        });


        network.once('stabilized', () => {
            network.fit();
        });


        return () => network.destroy();
    }, [filteredData, options]);

    // Render hover modal
    const renderHoverModal = useCallback(() => {
        if (!hoverInfo.node || !hoverInfo.position) return null;

        const nodeStats = {
            weight: networkStats.nodeWeights.get(hoverInfo.node.id) || 0,
            incoming: networkStats.incomingConnections.get(hoverInfo.node.id)?.size || 0,
            outgoing: networkStats.outgoingConnections.get(hoverInfo.node.id)?.size || 0
        };

        return (
            <div
                className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64"
                style={{
                    left: hoverInfo.position.x + 10,
                    top: hoverInfo.position.y - 100,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <h3 className="font-semibold">{hoverInfo.node.label}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-indigo-50 rounded-md p-2">
                            <div className="text-indigo-700 font-medium">Weight</div>
                            <div className="text-indigo-900">
                                ${nodeStats.weight.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-md p-2">
                            <div className="text-emerald-700 font-medium">Connections</div>
                            <div className="text-emerald-900">
                                {nodeStats.incoming + nodeStats.outgoing}
                            </div>
                        </div>
                        <div className="col-span-2 bg-blue-50 rounded-md p-2">
                            <div className="flex justify-between text-blue-900">
                                <span>↓ {nodeStats.incoming}</span>
                                <span>↑ {nodeStats.outgoing}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                        Click to see detailed analysis
                    </div>
                </div>
            </div>
        );
    }, [hoverInfo, networkStats]);

    return (
        <div className="w-full space-y-4">
            {/* Keep existing filter controls */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4 space-y-4">
                    {/* Filter Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            <h3 className="card-title text-lg">Network Filters</h3>
                        </div>
                        <div className="badge badge-primary badge-outline">
                            {filteredData.nodes.length} nodes · {filteredData.edges.length} transactions
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Direction Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Direction</span>
                            </label>
                            <div className="join w-full">
                                <button
                                    className={`join-item btn btn-sm flex-1 ${filters.direction === 'all'
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                        }`}
                                    onClick={() => setFilters(prev => ({ ...prev, direction: 'all' }))}
                                >
                                    <ArrowLeftRight className="w-4 h-4 mr-1" />
                                    All
                                </button>
                                <button
                                    className={`join-item btn btn-sm flex-1 ${filters.direction === 'incoming'
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                        }`}
                                    onClick={() => setFilters(prev => ({ ...prev, direction: 'incoming' }))}
                                >
                                    <ArrowUpLeft className="w-4 h-4 mr-1" />
                                    In
                                </button>
                                <button
                                    className={`join-item btn btn-sm flex-1 ${filters.direction === 'outgoing'
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                        }`}
                                    onClick={() => setFilters(prev => ({ ...prev, direction: 'outgoing' }))}
                                >
                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                    Out
                                </button>
                            </div>
                        </div>

                        {/* Weight Range Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Weight Range</span>
                                <span className="label-text-alt">
                                    Min: ${networkStats.minWeight.toFixed(0)} · Max: ${networkStats.maxWeight.toFixed(0)}
                                </span>
                            </label>
                            <div className="join w-full">
                                <div className="join-item flex-1">
                                    <input
                                        type="number"
                                        placeholder="Min Weight"
                                        className="input input-bordered input-sm w-full rounded-r-none"
                                        value={filters.minWeight || ''}
                                        onChange={e => setFilters(prev => ({
                                            ...prev,
                                            minWeight: Number(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="join-item bg-base-200 px-2 flex items-center">
                                    <span className="text-sm">to</span>
                                </div>
                                <div className="join-item flex-1">
                                    <input
                                        type="number"
                                        placeholder="Max Weight"
                                        className="input input-bordered input-sm w-full rounded-l-none"
                                        value={filters.maxWeight === Infinity ? '' : filters.maxWeight}
                                        onChange={e => setFilters(prev => ({
                                            ...prev,
                                            maxWeight: Number(e.target.value) || Infinity
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Controls</span>
                            </label>
                            <div className="join w-full">
                                <button
                                    className="join-item btn btn-sm btn-outline flex-1"
                                    onClick={() => setFilters({
                                        direction: 'all',
                                        minWeight: 0,
                                        maxWeight: Infinity,
                                        selectedNode: null
                                    })}
                                >
                                    Reset
                                </button>
                                <button
                                    className="join-item btn btn-sm btn-outline flex-1"
                                    onClick={() => networkInstance?.fit()}
                                >
                                    Fit View
                                </button>
                                <button
                                    className="join-item btn btn-sm btn-outline flex-1"
                                    onClick={() => networkInstance?.stabilize(50)}
                                >
                                    Stabilize
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Weight Scale */}
                    <div className="mt-4">
                        <label className="label">
                            <span className="label-text-alt">Weight Distribution</span>
                        </label>
                        <div className="w-full h-2 rounded-full" style={{
                            background: 'linear-gradient(to right, rgb(65,182,196), rgb(127,205,187), rgb(199,233,180), rgb(252,174,145), rgb(215,25,28))'
                        }}>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>${networkStats.minWeight.toFixed(2)}</span>
                                <span>${((networkStats.maxWeight + networkStats.minWeight) / 2).toFixed(2)}</span>
                                <span>${networkStats.maxWeight.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(filters.direction !== 'all' ||
                        filters.minWeight > 0 ||
                        filters.maxWeight !== Infinity) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filters.direction !== 'all' && (
                                    <div className="badge badge-primary gap-1">
                                        Direction: {filters.direction}
                                        <button
                                            className="btn btn-xs btn-ghost btn-circle"
                                            onClick={() => setFilters(prev => ({ ...prev, direction: 'all' }))}
                                        >✕</button>
                                    </div>
                                )}
                                {filters.minWeight > 0 && (
                                    <div className="badge badge-primary gap-1">
                                        Min: ${filters.minWeight}
                                        <button
                                            className="btn btn-xs btn-ghost btn-circle"
                                            onClick={() => setFilters(prev => ({ ...prev, minWeight: 0 }))}
                                        >✕</button>
                                    </div>
                                )}
                                {filters.maxWeight !== Infinity && (
                                    <div className="badge badge-primary gap-1">
                                        Max: ${filters.maxWeight}
                                        <button
                                            className="btn btn-xs btn-ghost btn-circle"
                                            onClick={() => setFilters(prev => ({ ...prev, maxWeight: Infinity }))}
                                        >✕</button>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>
            {filters.selectedNode && (
                <div className="bg-base-100 shadow-xl rounded-lg shadow-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="stat bg-indigo-50 rounded-lg p-4">
                            <div className="text-indigo-900 font-medium">Weight</div>
                            <div className="text-2xl font-bold text-indigo-600">
                                ${(networkStats.nodeWeights.get(filters.selectedNode) || 0).toFixed(2)}
                            </div>
                        </div>
                        <div className="stat bg-emerald-50 rounded-lg p-4">
                            <div className="text-emerald-900 font-medium">Incoming</div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {networkStats.incomingConnections.get(filters.selectedNode)?.size || 0}
                            </div>
                        </div>
                        <div className="stat bg-amber-50 rounded-lg p-4">
                            <div className="text-amber-900 font-medium">Outgoing</div>
                            <div className="text-2xl font-bold text-amber-600">
                                {networkStats.outgoingConnections.get(filters.selectedNode)?.size || 0}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="relative">
                <div
                    ref={networkRef}
                    className="w-full h-[500px] bg-base-100 rounded-lg shadow-lg"
                />
                {renderHoverModal()}
            </div>
        </div>
    );
};

export default TransactionNetwork;