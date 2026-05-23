import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, MessageSquare, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface GlobalToolbarProps {
  onOpenCanvas: () => void;
}

export function GlobalToolbar({ onOpenCanvas }: GlobalToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const bottomThreshold = 150;

      if (windowHeight - mouseY < bottomThreshold) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else if (!isHovering) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isHovering]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
            {/* Left Actions */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Clock className="w-5 h-5" />
            </Button>

            <div className="w-px h-8 bg-zinc-800 mx-1" />

            {/* Main Create Button */}
            <motion.button
              onClick={onOpenCanvas}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#13005A] to-[#00337C] hover:opacity-90 shadow-lg shadow-[#13005A]/50 flex items-center justify-center group"
            >
              <Plus className="w-7 h-7 text-white transition-transform group-hover:rotate-90" />
            </motion.button>

            <div className="w-px h-8 bg-zinc-800 mx-1" />

            {/* Right Actions */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Clock className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
