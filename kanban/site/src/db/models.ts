import type { Timestamp } from "firebase/firestore";
import type { Color } from "./types";

export type Task = {
  id: string;
  name: string;
  description: string;
  boardId: string;
  listId: string;
  color: Color;
  weight: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type List = {
  id: string;
  boardId: string;
  name: string;
};

export type Board = {
  id: string;
  name: string;
  ownerId: string;
};
