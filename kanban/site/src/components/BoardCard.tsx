import type { Board } from "../db/models";

export function BoardCard({ board }: { board: Board }) {
  return (
    <div className="h-24 border-2 border-zinc-800 rounded-lg">
      <div className="h-16 bg-linear-to-br from-rose-500 to-yellow-200 rounded-t-md" />
      <div className="w-full h-8 bg-zinc-800 text-zinc-300 p-1 rounded-b-sm">
        {board.name || "New board"}
      </div>
    </div>
  );
}
