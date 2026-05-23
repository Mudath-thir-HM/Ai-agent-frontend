import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image, Type, Sparkles, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { ImageNode } from "./canvas-nodes/image-node";
import { PromptNode } from "./canvas-nodes/prompt-node";
import { OutputNode } from "./canvas-nodes/output-node";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CanvasOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const nodeTypes = {
  imageNode: ImageNode,
  promptNode: PromptNode,
  outputNode: OutputNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const toolbarItems = [
  { id: "image", label: "Image", icon: Image, color: "from-[#00337C] to-[#1C82AD]" },
  { id: "text", label: "Text Idea", icon: Type, color: "from-[#1C82AD] to-[#03C988]" },
  { id: "prompt", label: "AI Prompt", icon: Sparkles, color: "from-[#13005A] to-[#00337C]" },
];

export function CanvasOverlay({ isOpen, onClose }: CanvasOverlayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        animated: true,
        style: { stroke: "#1C82AD", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = (type: string) => {
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };

    let newNode: Node;

    if (type === "image") {
      newNode = {
        id: `image-${Date.now()}`,
        type: "imageNode",
        position,
        data: { label: "Image Card" },
      };
    } else if (type === "prompt") {
      newNode = {
        id: `prompt-${Date.now()}`,
        type: "promptNode",
        position,
        data: { label: "AI Prompt", prompt: "Generate caption for this image" },
      };
    } else {
      newNode = {
        id: `output-${Date.now()}`,
        type: "outputNode",
        position,
        data: { label: "Output Card" },
      };
    }

    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Circle Expand Animation */}
          <motion.div
            initial={{
              clipPath: "circle(0% at 50% 100%)",
            }}
            animate={{
              clipPath: "circle(150% at 50% 100%)",
            }}
            exit={{
              clipPath: "circle(0% at 50% 100%)",
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-[#0a0a0a] z-50"
          >
            {/* Canvas Container */}
            <div className="w-full h-full flex">
              {/* Left Toolbar */}
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="w-20 bg-zinc-900/50 backdrop-blur border-r border-zinc-800 flex flex-col items-center py-6 gap-4"
              >
                {toolbarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => addNode(item.id)}
                      className="group relative w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all flex items-center justify-center"
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                      <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </motion.div>

              {/* Main Canvas Area */}
              <div className="flex-1 relative">
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>

                {/* React Flow Canvas */}
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-transparent"
                >
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272a" />
                  <Controls className="bg-zinc-900 border-zinc-800" />
                  <MiniMap
                    className="bg-zinc-900 border border-zinc-800"
                    nodeColor="#1C82AD"
                    maskColor="rgba(0, 0, 0, 0.6)"
                  />
                </ReactFlow>

                {/* Empty State */}
                {nodes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Start Creating</h3>
                      <p className="text-zinc-500">Drag elements from the left toolbar onto the canvas</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Properties Panel */}
              <AnimatePresence>
                {propertiesPanelOpen && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="w-80 bg-zinc-900/50 backdrop-blur border-l border-zinc-800 flex flex-col"
                  >
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Properties</h2>
                      <button
                        onClick={() => setPropertiesPanelOpen(false)}
                        className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {selectedNode ? (
                        <>
                          <div>
                            <h3 className="text-sm font-medium text-white mb-2">Node Type</h3>
                            <p className="text-sm text-zinc-400">{selectedNode.type}</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Schedule Time</Label>
                            <Input
                              type="datetime-local"
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Platform</Label>
                            <Select>
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="twitter">X (Twitter)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Caption</Label>
                            <textarea
                              className="w-full min-h-[100px] p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none"
                              placeholder="Enter caption..."
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                          <p className="text-sm text-zinc-500">Select a node to edit properties</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Properties Panel Button */}
              {!propertiesPanelOpen && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setPropertiesPanelOpen(true)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
