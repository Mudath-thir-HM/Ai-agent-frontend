import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle2, Calendar, Save } from "lucide-react";
import { Button } from "../ui/button";

export const OutputNode = memo(({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border-2 border-[#03C988] rounded-lg p-4 min-w-[280px] shadow-lg">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#03C988]" />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#03C988] to-[#1C82AD] flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-white font-semibold">Output Card</h3>
      </div>

      <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 mb-3">
        <p className="text-sm text-zinc-400 mb-2">Generated Content</p>
        <p className="text-sm text-zinc-300">
          "Transform your social media presence with AI-powered content creation. 🚀✨"
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Schedule
        </Button>
      </div>
    </div>
  );
});

OutputNode.displayName = "OutputNode";
