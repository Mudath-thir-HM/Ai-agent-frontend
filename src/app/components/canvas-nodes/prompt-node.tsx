import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Sparkles } from "lucide-react";

export const PromptNode = memo(({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border-2 border-[#13005A] rounded-lg p-4 min-w-[250px] shadow-lg">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#13005A]" />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#13005A] to-[#00337C] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-white font-semibold">AI Prompt</h3>
      </div>

      <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
        <p className="text-sm text-zinc-300">{data.prompt || "Generate caption for this"}</p>
      </div>

      <div className="mt-3 flex gap-2">
        <div className="px-2 py-1 bg-[#13005A]/10 border border-[#13005A]/20 rounded text-xs text-[#1C82AD]">
          GPT-4
        </div>
        <div className="px-2 py-1 bg-[#13005A]/10 border border-[#13005A]/20 rounded text-xs text-[#1C82AD]">
          Creative
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#13005A]" />
    </div>
  );
});

PromptNode.displayName = "PromptNode";
