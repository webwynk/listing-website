export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        {/* Outer delicate track */}
        <div className="w-12 h-12 rounded-full border border-black/[0.08]" />

        {/* Smooth primary rotating arc */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-transparent border-t-[#eb7583] border-r-[#eb7583]/60 animate-loader-spin" />

        {/* Counter-rotating inner micro-orbital ring */}
        <div className="absolute w-6 h-6 rounded-full border border-transparent border-b-[#fcdadb] border-l-[#eb7583]/40 animate-loader-spin [animation-duration:1.6s] [animation-direction:reverse]" />

        {/* Centered breathing jewel point */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#eb7583] animate-loader-pulse" />
      </div>
    </div>
  );
}
