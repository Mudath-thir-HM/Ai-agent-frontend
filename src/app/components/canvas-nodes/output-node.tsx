import { memo, useState } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { CheckCircle2, Calendar, Save, Sparkles, ImageIcon, Copy, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const MOCK_CAPTION =
  "Transform your social media presence with AI-powered content creation. 🚀✨ #SocialMedia #AI #Marketing";

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  // mode is passed via data from the connected prompt node; default "caption"
  const mode: "caption" | "image" = data.mode ?? "caption";

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_CAPTION);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-zinc-900 border-2 border-[#03C988] rounded-lg p-4 h-full w-full flex flex-col shadow-lg shadow-[#03C988]/10 overflow-hidden">
      <NodeResizer
        minWidth={240}
        minHeight={260}
        isVisible={selected}
        lineClassName="border-[#03C988]"
        handleClassName="w-3 h-3 bg-[#03C988] border-2 border-zinc-900 rounded-sm"
      />

      {/* Multiple target handles — accepts from several prompt nodes */}
      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: "35%" }}
        className="!w-3 !h-3 !bg-[#03C988] !border-2 !border-zinc-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: "65%" }}
        className="!w-3 !h-3 !bg-[#03C988] !border-2 !border-zinc-900"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#03C988] to-[#1C82AD] flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white font-semibold text-sm flex-1">Output</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${
            mode === "image"
              ? "bg-[#1C82AD]/10 border-[#1C82AD]/30 text-[#1C82AD]"
              : "bg-[#03C988]/10 border-[#03C988]/30 text-[#03C988]"
          }`}
        >
          {mode === "image" ? "Image" : "Caption"}
        </span>
      </div>

      {/* Output area — fills remaining space */}
      <div className="flex-1 min-h-0 bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden flex flex-col">
        {generating ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#03C988] animate-spin" />
            <p className="text-xs text-zinc-500">
              {mode === "image" ? "Generating image with FLUX.2…" : "Drafting caption…"}
            </p>
          </div>
        ) : generated ? (
          mode === "image" ? (
            <div className="flex-1 relative">
              {/* Mock generated image gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#13005A] via-[#00337C] to-[#1C82AD] opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <ImageIcon className="w-10 h-10 text-white/50" />
                <p className="text-xs text-white/60">Generated Image</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-3 flex flex-col">
              <p className="text-sm text-zinc-300 leading-relaxed flex-1">{MOCK_CAPTION}</p>
              <button
                onClick={handleCopy}
                className="mt-2 self-end text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
            {mode === "image" ? (
              <ImageIcon className="w-8 h-8 text-zinc-600" />
            ) : (
              <Sparkles className="w-8 h-8 text-zinc-600" />
            )}
            <p className="text-xs text-zinc-600 text-center">
              {mode === "image"
                ? "Connect an Image Prompt node\nand click Generate"
                : "Connect a Caption Prompt node\nand click Generate"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 flex-shrink-0">
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90 disabled:opacity-50 text-xs"
        >
          {generating ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 mr-1" />
          )}
          Generate
        </Button>
        <Button
          size="sm"
          disabled={!generated}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-40 text-xs"
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          disabled={!generated}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-40 text-xs"
        >
          <Calendar className="w-3 h-3 mr-1" />
          Schedule
        </Button>
      </div>
    </div>
  );
});

OutputNode.displayName = "OutputNode";