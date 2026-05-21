export function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-white/15 shadow-md shadow-black/30 text-zinc-300 rounded-2xl p-1 w-60 h-min">
      {children}
    </div>
  );
}
