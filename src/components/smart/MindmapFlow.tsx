"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = "TB") {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}

const nodeStyles: Record<string, string> = {
  topic: "#4f46e5",
  subtopic: "#10b981",
  detail: "#f97316",
};

export default function MindmapFlow({ noteId }: { noteId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindmap = async () => {
      setLoading(true);
      const res = await fetch(`/smart/mindmap/api/${noteId}`);
      const data = await res.json();
      const sampleData = data.nodes;

      const nodeList: Node[] = sampleData.map((n: any) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: 0, y: 0 },
        type: "default",
        style: {
          backgroundColor: nodeStyles[n.type] || "#ddd",
          color: "white",
          fontWeight: "bold",
          borderRadius: 8,
          padding: 10,
          border: "1px solid #aaa",
        },
      }));

      const edgeList: Edge[] = sampleData
        .filter((n: any) => n.parentId)
        .map((n: any) => ({
          id: `e-${n.parentId}-${n.id}`,
          source: n.parentId!,
          target: n.id,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            strokeWidth: 1, // thinner lines
            stroke: "#555",
          },
        }));

      const layouted = getLayoutedElements(nodeList, edgeList);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      setLoading(false);
    };

    fetchMindmap();
  }, [noteId]);

  if (loading) return <div className="p-4 text-center">Loading mindmap...</div>;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
