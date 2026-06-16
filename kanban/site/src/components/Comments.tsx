import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../util/cn";
import { Avatar } from "./Avatar/Avatar";
import { createComment } from "../db/mutations";
import { useAuth } from "../lib/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import type { Comment } from "../db/models";

export function Comments({ taskId }: { taskId: string }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.comments),
      where("taskId", "==", taskId),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(data);
    });

    return unsubscribe;
  }, [taskId]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const submit = useCallback(() => {
    createComment({
      taskId: taskId,
      text: text,
      sender: user!.uid,
    });
  }, [taskId, text, user]);

  const reset = useCallback(() => {
    setText("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submit();
      reset();
    },
    [submit, reset],
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    },
    [],
  );

  return (
    <div>
      <div className="flex flex-row space-x-2 items-center">
        <Avatar />
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={text}
            ref={inputRef}
            rows={1}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnter}
            onBlur={() => {
              console.log("submit");
            }}
            placeholder="Add comment..."
            className={cn(
              "text-zinc-200 border border-zinc-700 px-3 text-lg py-2 w-full tracking-tight rounded-lg",
              "resize-none focus:ring-zinc-500 hover:ring-zinc-600 focus:bg-zinc-700/25 outline-none focus:ring-[1px] hover:ring-[1px]",
            )}
          />
        </form>
      </div>

      <div>{comments.map((c) => JSON.stringify(c))}</div>
    </div>
  );
}
