import { memo, useState } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { Sparkles, ImageIcon, Type } from "lucide-react";

type Mode = "caption" | "image";

const STYLE_TAGS = ["Minimalist", "Vibrant", "Professional", "Playful", "Editorial", "Bold"];

export const PromptNode = memo(({ data, selected }: NodeProps) => {
  const [mode, setMode] = useState<Mode>(data.mode ?? "caption");
  const [prompt, setPrompt] = useState<string>(data.prompt ?? "");
  const [selectedStyle, setSelectedStyle] = useState<string>("Professional");

  return (
    <div className="bg-zinc-900 border-2 border-[#13005A] rounded-lg p-4 h-full w-full flex flex-col shadow-lg shadow-[#13005A]/20 overflow-hidden">
      <NodeResizer
        minWidth={220}
        minHeight={240}
        isVisible={selected}
        lineClassName="border-[#13005A]"
        handleClassName="w-3 h-3 bg-[#13005A] border-2 border-zinc-900 rounded-sm"
      />

      {/* Multiple target handles — accepts connections from several image nodes */}
      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: "30%" }}
        className="!w-3 !h-3 !bg-[#13005A] !border-2 !border-zinc-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: "50%" }}
        className="!w-3 !h-3 !bg-[#13005A] !border-2 !border-zinc-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-3"
        style={{ top: "70%" }}
        className="!w-3 !h-3 !bg-[#13005A] !border-2 !border-zinc-900"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#13005A] to-[#00337C] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white font-semibold text-sm flex-1">AI Prompt</h3>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 bg-zinc-800 p-1 rounded-lg flex-shrink-0">
        <button
          onClick={() => setMode("caption")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "caption"
              ? "bg-[#13005A] text-white shadow"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Type className="w-3 h-3" />
          Caption
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "image"
              ? "bg-gradient-to-r from-[#13005A] to-[#1C82AD] text-white shadow"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          Image
        </button>
      </div>

      {/* Prompt textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={
          mode === "caption"
            ? "Describe the caption you want generated…"
            : "Describe the image you want to generate…"
        }
        className="flex-1 min-h-0 w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-[#1C82AD] transition-colors"
      />

      {/* Style tags (image mode only) */}
      {mode === "image" && (
        <div className="mt-2 flex-shrink-0">
          <p className="text-xs text-zinc-500 mb-1.5">Style</p>
          <div className="flex flex-wrap gap-1">
            {STYLE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedStyle(tag)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${
                  selectedStyle === tag
                    ? "bg-[#1C82AD] text-white"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-[#1C82AD]/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model badge */}
      <div className="mt-2 flex gap-1.5 flex-shrink-0">
        <div className="px-2 py-0.5 bg-[#13005A]/20 border border-[#13005A]/30 rounded text-xs text-[#1C82AD]">
          {mode === "caption" ? "DeepSeek Flash" : "FLUX.2"}
        </div>
        <div className="px-2 py-0.5 bg-[#13005A]/10 border border-[#13005A]/20 rounded text-xs text-zinc-500 capitalize">
          {mode}
        </div>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="!w-3 !h-3 !bg-[#13005A] !border-2 !border-zinc-900"
      />
    </div>
  );
});

PromptNode.displayName = "PromptNode";