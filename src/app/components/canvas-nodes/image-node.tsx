import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Image } from "lucide-react";

export const ImageNode = memo(({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border-2 border-[#1C82AD] rounded-lg p-4 min-w-[200px] shadow-lg">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#1C82AD]" />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00337C] to-[#1C82AD] flex items-center justify-center">
          <Image className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-white font-semibold">Image Card</h3>
      </div>

      <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
        <Image className="w-8 h-8 text-zinc-600" />
      </div>

      <p className="text-xs text-zinc-500 mt-2">Click to upload or drag an image</p>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#1C82AD]" />
    </div>
  );
});

ImageNode.displayName = "ImageNode";
