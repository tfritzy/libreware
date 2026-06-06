import { useParams } from "react-router-dom";
import type { Board } from "../db/models";
import { useCallback, useEffect, useRef, useState } from "react";
import { COLLECTIONS } from "../db/collections";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Input } from "./ui/input";
import { updateBoard } from "../db/mutations";
import { cn } from "../util/cn";

export function BoardName() {
  const boardId = useParams().boardId;
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [editedName, setEditedName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    if (!canvasCtxRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const style = window.getComputedStyle(inputRef.current);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      canvasCtxRef.current = ctx;
    }
    const { width } = canvasCtxRef.current.measureText(editedName);
    const paddingBuffer = 24;
    inputRef.current.style.width = `${Math.min(Math.max(60, Math.ceil(width) + paddingBuffer), 600)}px`;
  }, [editedName]);

  useEffect(() => {
    if (!boardId) return;
    const boardRef = doc(db, COLLECTIONS.boards, boardId);
    const unsubscribe = onSnapshot(
      boardRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Board;
          setBoard(data);
          setEditedName(data.name);
        } else {
          console.log("No such board", boardId);
        }
      },
      (error) => {
        console.error("Error listening to board changes:", error);
      },
    );

    return unsubscribe;
  }, [boardId]);

  const handleNameChange = useCallback((name: string, boardId: string) => {
    updateBoard(boardId, { name });
  }, []);

  if (!board) return null;

  return (
    <Input
      value={editedName}
      ref={inputRef}
      onChange={(e) => setEditedName(e.target.value)}
      onFocus={() => inputRef.current?.select()}
      onBlur={() => {
        handleNameChange(editedName, board.id);
        setBoard({ ...board, name: editedName });
      }}
      className={cn(
        "text-zinc-800 px-2 text-lg tracking-tight border border-transparent hover:border-zinc-800 focus-within:border-zinc-800",
      )}
    />
  );
}
