export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#faf8f7]/70">
      <div className="relative flex items-center justify-center">
        {/* Ambient rose-gold blush aura */}
        <div className="absolute w-20 h-20 rounded-full bg-[#eb7583]/10 blur-xl animate-loader-pulse" />

        {/* Outer delicate track */}
        <div className="w-14 h-14 rounded-full border border-black/[0.06]" />

        {/* Smooth primary rotating arc */}
        <div className="absolute w-14 h-14 rounded-full border-2 border-transparent border-t-[#eb7583] border-r-[#eb7583]/50 animate-loader-spin" />

        {/* Counter-rotating inner micro-orbital ring */}
        <div className="absolute w-8 h-8 rounded-full border border-transparent border-b-[#fcdadb] border-l-[#eb7583]/30 animate-loader-spin [animation-duration:1.8s] [animation-direction:reverse]" />

        {/* Centered breathing jewel point */}
        <div className="absolute w-2 h-2 rounded-full bg-[#eb7583] shadow-[0_0_10px_rgba(235,117,131,0.6)] animate-loader-pulse" />
      </div>
    </div>
  );
}
