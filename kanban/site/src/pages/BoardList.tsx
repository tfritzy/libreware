import { useCallback, useEffect, useState } from "react";
import type { Board } from "../db/models";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import { createBoard } from "../db/mutations";
import { useAuth } from "../lib/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Plus } from "lucide-react";
import { BoardCard } from "../components/BoardCard";
import { Header } from "../components/Header";

export function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.boards),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Board[];
      setBoards(boardData);
      setRecentBoards(
        boardData
          .sort((a, b) => a.viewedAt.toMillis() - b.viewedAt.toMillis())
          .slice(0, 4),
      );
    });

    return unsubscribe;
  }, []);

  const handleCreateBoard = useCallback(async () => {
    const owner = await user?.getIdToken();

    if (!owner) throw "No user to create board for";

    const id = await createBoard({ name: "New board", ownerId: owner });
    navigate("/board/" + id);
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-[url('/backgrounds/nature/slava-auchynnikau-ksglBz2VHQQ-unsplash.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <Header />
      <div className="max-w-3xl mx-auto">
        {!!recentBoards.length && (
          <div className="mb-8">
            <h1 className="mb-2 flex flex-row space-x-2 items-center">
              <div>Recent</div> <Clock size={16} />
            </h1>
            <div className="grid grid-cols-4 gap-3">
              {recentBoards.map((b) => (
                <Link
                  to={`/board/${b.id}`}
                  className="hover:-translate-y-1 transition-transform"
                >
                  <BoardCard board={b} />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h1 className="mb-2">Boards</h1>
          <div className="grid grid-cols-4 gap-3">
            {boards.map((b) => (
              <Link
                to={`/board/${b.id}`}
                className="hover:-translate-y-1 transition-transform"
              >
                <BoardCard board={b} />
              </Link>
            ))}

            <button
              onClick={handleCreateBoard}
              className="relative hover:brightness-125 border border-zinc-700 bg-linear-to-bl from-zinc-500/25 to-zinc-700/25 cursor-pointer rounded-lg h-24"
            >
              <div className="flex flex-row w-full items-center justify-center space-x-1 text-zinc-300 pl-1 rounded-b-sm">
                <Plus size={16} />
                <div>New board</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
