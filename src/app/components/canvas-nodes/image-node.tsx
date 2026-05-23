import { memo, useState, useRef } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { Image, Upload, X } from "lucide-react";

export const ImageNode = memo(({ data, selected }: NodeProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="bg-zinc-900 border-2 border-[#1C82AD] rounded-lg p-4 h-full w-full flex flex-col shadow-lg shadow-[#1C82AD]/10 overflow-hidden">
      <NodeResizer
        minWidth={180}
        minHeight={220}
        isVisible={selected}
        lineClassName="border-[#1C82AD]"
        handleClassName="w-3 h-3 bg-[#1C82AD] border-2 border-zinc-900 rounded-sm"
      />

      {/* Top handle — target for incoming edges */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!w-3 !h-3 !bg-[#1C82AD] !border-2 !border-zinc-900"
      />

      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00337C] to-[#1C82AD] flex items-center justify-center flex-shrink-0">
          <Image className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white font-semibold text-sm truncate flex-1">
          {data.label || "Image Card"}
        </h3>
        {preview && (
          <button
            onClick={() => setPreview(null)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Image area — fills remaining space */}
      <div
        className="flex-1 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 cursor-pointer hover:border-[#1C82AD] transition-colors overflow-hidden group relative min-h-0"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload className="w-8 h-8 text-zinc-600 group-hover:text-[#1C82AD] transition-colors" />
            <p className="text-xs text-zinc-500 group-hover:text-zinc-400 text-center px-2">
              Click to upload
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Multiple source handles on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="out-1"
        style={{ top: "35%" }}
        className="!w-3 !h-3 !bg-[#1C82AD] !border-2 !border-zinc-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out-2"
        style={{ top: "65%" }}
        className="!w-3 !h-3 !bg-[#1C82AD] !border-2 !border-zinc-900"
      />
    </div>
  );
});

ImageNode.displayName = "ImageNode";