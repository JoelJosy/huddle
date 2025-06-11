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
import { RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMindmap = async () => {
    try {
      setError(null);
      const res = await fetch(`/smart/mindmap/api/${noteId}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Note not found");
        }
        throw new Error("Failed to fetch mindmap");
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load mindmap");
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    toast.info("Regenerating mindmap...");
    await fetchMindmap();
    toast.success("Mindmap regenerated!");
  };

  useEffect(() => {
    if (noteId) {
      fetchMindmap();
    }
  }, [noteId]);

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Unable to Load Mindmap
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => fetchMindmap()}
              variant="outline"
              className="transition-transform hover:scale-105"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="animate-in fade-in slide-in-from-top-4 mb-6 flex flex-wrap gap-3 duration-500">
        <Button
          onClick={handleRegenerate}
          disabled={loading || isRegenerating}
          variant="outline"
          className="gap-2 transition-all hover:scale-105"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
          />
          {isRegenerating ? "Regenerating..." : "Regenerate Mindmap"}
        </Button>
      </div>

      <Card className="bg-card/60 animate-in fade-in border-0 shadow-lg backdrop-blur-sm duration-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <RefreshCw className="text-primary h-5 w-5" />
            Interactive Mind Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "70vh", width: "100%" }}>
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner text="Generating mindmap..." />
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                className="rounded-lg"
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
