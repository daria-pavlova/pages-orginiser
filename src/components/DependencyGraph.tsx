import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Service } from '../types';

interface DependencyGraphProps {
  services: Record<string, Service>;
  selectedService?: string;
  onServiceClick?: (serviceId: string) => void;
}

export const DependencyGraph = ({ services, selectedService, onServiceClick }: DependencyGraphProps) => {
  // Generate nodes and edges from services
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const serviceIds = Object.keys(services);
    
    // Create a grid layout
    const cols = Math.ceil(Math.sqrt(serviceIds.length));
    const spacing = 250;

    serviceIds.forEach((id, index) => {
      const service = services[id];
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const isSelected = id === selectedService;
      const isConnected = selectedService
        ? service.dependsOn?.includes(selectedService) ||
          services[selectedService]?.dependsOn?.includes(id)
        : false;

      nodes.push({
        id,
        type: 'default',
        position: { x: col * spacing, y: row * spacing },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm">{service.name}</div>
              <div className="text-xs text-gray-500">{service.group}</div>
            </div>
          ),
        },
        style: {
          background: isSelected
            ? '#0ea5e9'
            : isConnected
            ? '#bae6fd'
            : '#ffffff',
          border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '10px',
          width: 180,
          color: isSelected ? '#ffffff' : '#1f2937',
        },
      });

      // Create edges for dependencies
      service.dependsOn?.forEach((depId) => {
        if (services[depId]) {
          edges.push({
            id: `${id}-${depId}`,
            source: id,
            target: depId,
            type: 'smoothstep',
            animated: isSelected && (id === selectedService || depId === selectedService),
            style: {
              stroke: isSelected && (id === selectedService || depId === selectedService)
                ? '#0ea5e9'
                : '#94a3b8',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isSelected && (id === selectedService || depId === selectedService)
                ? '#0ea5e9'
                : '#94a3b8',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [services, selectedService]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onServiceClick?.(node.id);
    },
    [onServiceClick]
  );

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
