import { Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-neutral-950 text-white">
      <div className="relative flex items-center justify-center">
        {/* Animated pulse rings */}
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <div className="mt-4 text-center space-y-1">
        <p className="font-heading text-lg font-semibold tracking-wide text-neutral-200">
          GlamBook
        </p>
        <p className="text-xs text-neutral-400 tracking-widest uppercase">
          Curating Excellence...
        </p>
      </div>
    </div>
  );
}
