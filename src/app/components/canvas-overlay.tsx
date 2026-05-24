import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Image, Type, Sparkles, Calendar, ChevronRight, ChevronLeft,
  CheckCircle2, Instagram, Facebook, Twitter, Link2, ImageIcon,
  Sliders, AlignLeft, Hash, Clock, Eye, Zap, Loader2, Send,
} from "lucide-react";
import ReactFlow, {
  Node, Edge, addEdge, Connection,
  useNodesState, useEdgesState,
  Controls, Background, MiniMap, BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { ImageNode } from "./canvas-nodes/image-node";
import { PromptNode } from "./canvas-nodes/prompt-node";
import { OutputNode } from "./canvas-nodes/output-node";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SchedulePostDialog } from "./SchedulePostDialog";
import { useGenerateContentMutation } from "../store/apiSlice";
import { GeneratedContent } from "../types";
import { toast } from "sonner";

interface CanvasOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const nodeTypes = { imageNode: ImageNode, promptNode: PromptNode, outputNode: OutputNode };

const toolbarItems = [
  { id: "image",  label: "Image",     icon: Image,        color: "from-[#00337C] to-[#1C82AD]", desc: "Upload image" },
  { id: "text",   label: "Text Idea", icon: Type,         color: "from-[#1C82AD] to-[#03C988]", desc: "Idea block"  },
  { id: "prompt", label: "AI Prompt", icon: Sparkles,     color: "from-[#13005A] to-[#00337C]", desc: "Caption / Image" },
  { id: "output", label: "Output",    icon: CheckCircle2, color: "from-[#03C988] to-[#1C82AD]", desc: "View result"  },
];

const NODE_DEFAULTS: Record<string, { width: number; height: number }> = {
  image: { width: 220, height: 260 }, text:   { width: 240, height: 180 },
  prompt:{ width: 260, height: 300 }, output: { width: 280, height: 320 },
};

type Platform = "instagram" | "twitter" | "facebook";

const MOCK_CAPTION =
  "Transform your social media presence with AI-powered content creation. 🚀✨ #SocialMedia #AI #Marketing";

const CHAR_LIMITS: Record<Platform, number> = { instagram: 2200, twitter: 280, facebook: 63206 };

const BEST_TIMES: Record<Platform, string[]> = {
  instagram: ["9 AM", "12 PM", "3 PM", "7 PM"],
  twitter:   ["8 AM", "12 PM", "5 PM", "9 PM"],
  facebook:  ["9 AM", "1 PM",  "3 PM", "8 PM"],
};

// ─── Platform Phone Previews ─────────────────────────────────────────────────

function InstagramPreview({ caption }: { caption: string }) {
  const over = caption.length > CHAR_LIMITS.instagram;
  return (
    <div className="text-xs text-white">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#13005A] to-[#1C82AD]" />
          <span className="font-semibold text-[11px]">astra_brand</span>
        </div>
        <span className="text-zinc-500 text-[10px]">•••</span>
      </div>
      <div className="aspect-square w-full bg-gradient-to-br from-[#13005A] via-[#00337C] to-[#1C82AD] rounded mb-2 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-white/20" />
      </div>
      <div className="flex items-center gap-3 mb-2 px-1 text-zinc-400">
        <span>♡</span><span>💬</span><span>↗</span>
        <span className="ml-auto">🔖</span>
      </div>
      <div className="px-1 space-y-0.5">
        <p className="leading-relaxed text-[10px] text-zinc-300 line-clamp-3">
          <span className="font-semibold text-white">astra_brand </span>{caption}
        </p>
        <p className={`text-[9px] ${over ? "text-red-400" : "text-zinc-600"}`}>
          {caption.length} / {CHAR_LIMITS.instagram.toLocaleString()} chars
        </p>
      </div>
    </div>
  );
}

function TwitterPreview({ caption }: { caption: string }) {
  const trimmed = caption.slice(0, CHAR_LIMITS.twitter);
  const over = caption.length > CHAR_LIMITS.twitter;
  const pct = Math.min((caption.length / CHAR_LIMITS.twitter) * 100, 100);
  return (
    <div className="text-xs text-white">
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00337C] to-[#1C82AD] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-bold text-[11px]">Astra Brand</span>
            <span className="text-zinc-500 text-[10px]">@astra_brand · now</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${over ? "text-red-400" : "text-zinc-200"}`}>
            {trimmed}{over && <span className="text-red-400">…</span>}
          </p>
          <div className="mt-2 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="h-10 bg-gradient-to-r from-[#13005A] to-[#00337C]" />
            <div className="px-2 py-1 bg-zinc-900">
              <p className="text-[9px] text-zinc-400">astra.ai</p>
              <p className="text-[10px] text-white font-medium">Start creating with Astra AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-zinc-500 text-[10px]">
            <span>💬 4</span><span>🔁 12</span><span>♡ 48</span><span>📊 2.1K</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-[#1C82AD]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-[9px] ${over ? "text-red-400" : "text-zinc-500"}`}>
          {CHAR_LIMITS.twitter - caption.length} left
        </span>
      </div>
    </div>
  );
}

function FacebookPreview({ caption }: { caption: string }) {
  return (
    <div className="text-xs text-white">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00337C] to-[#1C82AD]" />
        <div>
          <p className="font-semibold text-[11px]">Astra Brand</p>
          <p className="text-[9px] text-zinc-500">Just now · 🌍</p>
        </div>
      </div>
      <p className="text-[11px] text-zinc-200 leading-relaxed mb-2 line-clamp-4">{caption}</p>
      <div className="w-full bg-gradient-to-br from-[#13005A] via-[#00337C] to-[#1C82AD] rounded aspect-video flex items-center justify-center mb-2">
        <ImageIcon className="w-8 h-8 text-white/20" />
      </div>
      <div className="flex items-center justify-between text-zinc-500 text-[10px] pt-1 border-t border-zinc-800">
        <span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span>
      </div>
    </div>
  );
}

// ─── Sidebar panels ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-white">{label}</span>
    </div>
  );
}

function Row({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-[10px] text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

function ImageNodePanel({ node }: { node: Node }) {
  const [styleRef, setStyleRef] = useState(false);
  const [altText, setAltText] = useState("");
  return (
    <div className="space-y-4">
      <SectionHeader icon={<ImageIcon className="w-3.5 h-3.5" />} label="Image Node" color="#1C82AD" />
      <div className="bg-zinc-800/50 rounded-lg p-3 space-y-2">
        <Row label="Node ID">
          <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[120px]">{node.id}</span>
        </Row>
        <Row label="Size" className="mt-2">
          <span className="text-[11px] text-zinc-400">
            {Math.round((node.style?.width as number) ?? 220)} × {Math.round((node.style?.height as number) ?? 260)}
          </span>
        </Row>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white font-medium">Use as Style Reference</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">AI will match this image's aesthetic</p>
          </div>
          <button
            onClick={() => setStyleRef(v => !v)}
            className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${styleRef ? "bg-[#1C82AD]" : "bg-zinc-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${styleRef ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>
        {styleRef && (
          <div className="flex items-start gap-1.5 bg-[#1C82AD]/10 border border-[#1C82AD]/20 rounded px-2 py-1.5">
            <Zap className="w-3 h-3 text-[#1C82AD] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#1C82AD]">Style context passed to connected Prompt nodes</p>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-[11px]">Alt Text</Label>
        <textarea
          value={altText}
          onChange={e => setAltText(e.target.value)}
          placeholder="Describe this image for accessibility…"
          className="w-full h-16 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-[11px] text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-[#1C82AD] transition-colors"
        />
      </div>
    </div>
  );
}

function PromptNodePanel({
  node, edges, nodes, onGenerate, isGenerating,
}: {
  node: Node; edges: Edge[]; nodes: Node[];
  onGenerate: (prompt: string, mode: string, creativity: number) => void;
  isGenerating: boolean;
}) {
  const [creativity, setCreativity] = useState(0.7);
  const connectedInputs = useMemo(() => {
    return edges
      .filter(e => e.target === node.id)
      .map(e => nodes.find(n => n.id === e.source))
      .filter(Boolean) as Node[];
  }, [edges, nodes, node.id]);
  const mode: "caption" | "image" = node.data?.mode ?? "caption";
  const estimatedTokens = Math.ceil((node.data?.prompt?.length ?? 0) / 4) + connectedInputs.length * 512;

  return (
    <div className="space-y-4">
      <SectionHeader icon={<Sparkles className="w-3.5 h-3.5" />} label="AI Prompt Node" color="#7c3aed" />
      <div className="bg-zinc-800/50 rounded-lg p-3 space-y-2">
        <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5 mb-2">
          <Link2 className="w-3 h-3" /> Context Inputs
        </p>
        {connectedInputs.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic">No nodes connected. Connect Image nodes to provide visual context.</p>
        ) : (
          <>
            {connectedInputs.map((n, i) => (
              <div key={n.id} className="flex items-center gap-2 bg-zinc-900 rounded px-2 py-1.5">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-[#00337C] to-[#1C82AD] flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[10px] text-zinc-300 flex-1 truncate">{n.data?.label ?? `Image ${i + 1}`}</span>
                <span className="text-[9px] text-[#03C988]">✓</span>
              </div>
            ))}
            <p className="text-[9px] text-zinc-500 mt-1">{connectedInputs.length} image{connectedInputs.length > 1 ? "s" : ""} will inform the AI</p>
          </>
        )}
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 space-y-2">
        <Row label="Mode">
          <span className={`text-[11px] font-medium capitalize ${mode === "image" ? "text-[#1C82AD]" : "text-[#03C988]"}`}>{mode}</span>
        </Row>
        <Row label="Model" className="mt-1">
          <span className="text-[11px] text-zinc-400">{mode === "image" ? "FLUX.2 Klein 4B" : "DeepSeek Flash"}</span>
        </Row>
        <Row label="Est. tokens" className="mt-1">
          <span className="text-[11px] text-zinc-400">~{estimatedTokens.toLocaleString()}</span>
        </Row>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-400 text-[11px] flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Creativity
          </Label>
          <span className="text-[11px] text-[#1C82AD] font-mono">{creativity.toFixed(1)}</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.1} value={creativity}
          onChange={e => setCreativity(parseFloat(e.target.value))}
          className="w-full h-1.5 appearance-none bg-zinc-700 rounded-full outline-none cursor-pointer accent-[#1C82AD]"
        />
        <div className="flex justify-between text-[9px] text-zinc-600">
          <span>Precise</span><span>Balanced</span><span>Wild</span>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={() => onGenerate(node.data?.prompt ?? "", mode, creativity)}
        disabled={isGenerating || !node.data?.prompt}
        className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all bg-gradient-to-r from-[#13005A] to-[#1C82AD] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white"
      >
        {isGenerating ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
        ) : (
          <><Sparkles className="w-3.5 h-3.5" /> Generate AI Content</>
        )}
      </button>
      {!node.data?.prompt && (
        <p className="text-[10px] text-zinc-600 text-center">Add a prompt to the node first</p>
      )}
    </div>
  );
}

function OutputNodePanel({
  node, generatedContent, isScheduleOpen, onScheduleOpenChange,
}: {
  node: Node;
  generatedContent: GeneratedContent | null;
  isScheduleOpen: boolean;
  onScheduleOpenChange: (open: boolean) => void;
}) {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [caption, setCaption] = useState(
    generatedContent?.post_text ?? MOCK_CAPTION
  );
  const [scheduleTime, setScheduleTime] = useState("");

  // Sync caption when new content is generated
  useMemo(() => {
    if (generatedContent?.post_text) setCaption(generatedContent.post_text);
  }, [generatedContent?.post_text]);

  const platforms: { id: Platform; icon: React.FC<{ className?: string }>; label: string }[] = [
    { id: "instagram", icon: Instagram, label: "IG" },
    { id: "twitter",   icon: Twitter,   label: "X"  },
    { id: "facebook",  icon: Facebook,  label: "FB" },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader icon={<Eye className="w-3.5 h-3.5" />} label="Output Node" color="#03C988" />

      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-[11px] flex items-center gap-1">
          <AlignLeft className="w-3 h-3" /> Caption
        </Label>
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          className="w-full h-20 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-[11px] text-zinc-300 resize-none focus:outline-none focus:border-[#03C988] transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-[11px] flex items-center gap-1">
          <Hash className="w-3 h-3" /> Suggested Hashtags
        </Label>
        <div className="flex flex-wrap gap-1">
          {(generatedContent?.hashtags?.length
          ? generatedContent.hashtags
          : ["#AIMarketing","#ContentCreation","#SocialMediaTips","#GrowthHacking","#DigitalMarketing"]
        ).map(tag => (
            <button
              key={tag}
              onClick={() => setCaption(c => c.includes(tag) ? c : c + " " + tag)}
              className="px-1.5 py-0.5 bg-zinc-800 hover:bg-[#03C988]/10 border border-zinc-700 hover:border-[#03C988]/40 rounded text-[10px] text-zinc-400 hover:text-[#03C988] transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Platform tabs */}
      <div className="space-y-2">
        <Label className="text-zinc-400 text-[11px] flex items-center gap-1">
          <Eye className="w-3 h-3" /> Platform Preview
        </Label>
        <div className="flex gap-1">
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all ${
                  platform === p.id ? "bg-zinc-800 border-zinc-600" : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[9px] text-zinc-500">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center">
        <div className="w-[178px] bg-zinc-950 border-2 border-zinc-700 rounded-[22px] p-2 shadow-xl shadow-black/50">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
          </div>
          <div className="bg-zinc-900 rounded-[14px] p-2.5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={platform}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {platform === "instagram" && <InstagramPreview caption={caption} />}
                {platform === "twitter"   && <TwitterPreview   caption={caption} />}
                {platform === "facebook"  && <FacebookPreview  caption={caption} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-2">
            <div className="w-10 h-1 bg-zinc-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Best times */}
      <div className="space-y-1.5">
        <Label className="text-zinc-400 text-[11px] flex items-center gap-1">
          <Clock className="w-3 h-3" /> Best Times to Post
        </Label>
        <div className="flex gap-1 flex-wrap">
          {BEST_TIMES[platform].map(t => (
            <button
              key={t}
              onClick={() => setScheduleTime(t)}
              className={`px-2 py-1 rounded text-[10px] border transition-all ${
                scheduleTime === t
                  ? "bg-[#03C988]/20 border-[#03C988]/50 text-[#03C988]"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {generatedContent && (
        <div className="bg-[#03C988]/10 border border-[#03C988]/30 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#03C988] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Content generated — ready to schedule
          </p>
        </div>
      )}

      <button
        onClick={() => onScheduleOpenChange(true)}
        className="w-full py-2 bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-opacity"
      >
        <Calendar className="w-3.5 h-3.5" />
        Schedule to {platform.charAt(0).toUpperCase() + platform.slice(1)}
        {scheduleTime && <span className="text-zinc-400">@ {scheduleTime}</span>}
      </button>

      <SchedulePostDialog
        open={isScheduleOpen}
        onOpenChange={onScheduleOpenChange}
        prefillText={caption}
        prefillPlatform={platform}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CanvasOverlay({ isOpen, onClose }: CanvasOverlayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [generateContent, { isLoading: isGenerating }] = useGenerateContentMutation();

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: "#1C82AD", strokeWidth: 2 } }, eds));
  }, [setEdges]);

  const handleGenerate = useCallback(async (prompt: string, mode: string, creativity: number) => {
    if (!prompt.trim()) return;
    const toneMap = (c: number) => c < 0.35 ? "professional" : c < 0.7 ? "casual" : "humorous";
    try {
      const result = await generateContent({
        platform: "instagram",
        content_type: mode === "image" ? "carousel" : "post",
        prompt,
        tone: toneMap(creativity),
      }).unwrap();
      setGeneratedContent(result);
      toast.success("Content generated! View in the Output node.");
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Generation failed. Please try again.");
    }
  }, [generateContent]);

  const addNode = (type: string) => {
    const defaults = NODE_DEFAULTS[type] ?? { width: 220, height: 240 };
    const position = { x: Math.random() * 400 + 120, y: Math.random() * 280 + 80 };
    let newNode: Node;
    if (type === "image") {
      newNode = { id: `image-${Date.now()}`, type: "imageNode", position, style: { ...defaults }, data: { label: "Image Card" } };
    } else if (type === "prompt") {
      newNode = { id: `prompt-${Date.now()}`, type: "promptNode", position, style: { ...defaults }, data: { label: "AI Prompt", prompt: "", mode: "caption" } };
    } else if (type === "output") {
      newNode = { id: `output-${Date.now()}`, type: "outputNode", position, style: { ...defaults }, data: { label: "Output Card", mode: "caption" } };
    } else {
      newNode = { id: `text-${Date.now()}`, type: "promptNode", position, style: { ...defaults }, data: { label: "Text Idea", prompt: "Write a post about…", mode: "caption" } };
    }
    setNodes(nds => [...nds, newNode]);
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelectedNode(node), []);
  const onPaneClick  = useCallback(() => setSelectedNode(null), []);

  const panelTitle = selectedNode
    ? selectedNode.type === "imageNode"  ? "Image Properties"
    : selectedNode.type === "promptNode" ? "Prompt Properties"
    : "Output Properties"
    : "Properties";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 100%)" }}
          animate={{ clipPath: "circle(150% at 50% 100%)" }}
          exit={{ clipPath: "circle(0% at 50% 100%)" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 bg-[#0a0a0a] z-50"
        >
          <div className="w-full h-full flex">
            {/* Left toolbar */}
            <motion.div
              initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }} transition={{ delay: 0.3, duration: 0.3 }}
              className="w-20 bg-zinc-900/50 backdrop-blur border-r border-zinc-800 flex flex-col items-center py-6 gap-3"
            >
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Nodes</p>
              {toolbarItems.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => addNode(item.id)}
                    className="group relative w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none">{item.label}</span>
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 border border-zinc-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                      {item.label}<span className="block text-zinc-500 text-[10px]">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
              <div className="mt-auto px-2 pb-2">
                <p className="text-[9px] text-zinc-700 text-center leading-tight">Drag handles to connect nodes</p>
              </div>
            </motion.div>

            {/* Canvas */}
            <div className="flex-1 relative">
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.4 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 pointer-events-none"
              >
                <span className="text-[#1C82AD]">Image</span>
                <span>→</span>
                <span className="text-[#a78bfa]">AI Prompt</span>
                <span>→</span>
                <span className="text-[#03C988]">Output</span>
              </motion.div>

              <ReactFlow
                nodes={nodes} edges={edges}
                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                onConnect={onConnect} onNodeClick={onNodeClick} onPaneClick={onPaneClick}
                nodeTypes={nodeTypes} fitView
                connectionLineStyle={{ stroke: "#1C82AD", strokeWidth: 2 }}
                defaultEdgeOptions={{ animated: true, style: { stroke: "#1C82AD", strokeWidth: 2 } }}
                className="bg-transparent"
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272a" />
                <Controls className="bg-zinc-900 border-zinc-800" />
                <MiniMap className="bg-zinc-900 border border-zinc-800"
                  nodeColor={n => n.type === "imageNode" ? "#1C82AD" : n.type === "promptNode" ? "#7c3aed" : "#03C988"}
                  maskColor="rgba(0,0,0,0.6)"
                />
              </ReactFlow>

              {nodes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-1">Start Building</h3>
                    <p className="text-zinc-600 text-sm max-w-xs">Add nodes from the sidebar. Connect multiple Image nodes into one AI Prompt for richer results.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right panel */}
            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }} transition={{ delay: 0.3, duration: 0.3 }}
                  className="w-72 bg-zinc-900/50 backdrop-blur border-l border-zinc-800 flex flex-col"
                >
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-sm font-semibold text-white">{panelTitle}</h2>
                    <button onClick={() => setPanelOpen(false)}
                      className="w-7 h-7 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {selectedNode ? (
                      <>
                        {selectedNode.type === "imageNode"  && <ImageNodePanel  node={selectedNode} />}
                        {selectedNode.type === "promptNode" && (
                          <PromptNodePanel
                            node={selectedNode}
                            edges={edges}
                            nodes={nodes}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                          />
                        )}
                        {selectedNode.type === "outputNode" && (
                          <OutputNodePanel
                            node={selectedNode}
                            generatedContent={generatedContent}
                            isScheduleOpen={isScheduleOpen}
                            onScheduleOpenChange={setIsScheduleOpen}
                          />
                        )}
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400 font-medium mb-1">No node selected</p>
                          <p className="text-xs text-zinc-600 max-w-[180px]">Click any node on the canvas to see context-aware controls</p>
                        </div>
                        <div className="w-full mt-2 space-y-2">
                          {[
                            { color: "#1C82AD", label: "Image node",  desc: "Upload + style ref" },
                            { color: "#7c3aed", label: "Prompt node", desc: "Context + creativity" },
                            { color: "#03C988", label: "Output node", desc: "Preview + schedule"  },
                          ].map(h => (
                            <div key={h.label} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: h.color }} />
                              <span className="text-[11px] text-zinc-300 font-medium">{h.label}</span>
                              <span className="text-[10px] text-zinc-600 ml-auto">{h.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!panelOpen && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setPanelOpen(true)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}