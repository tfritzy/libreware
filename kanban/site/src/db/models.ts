import type { Timestamp } from "firebase/firestore";

export type Task = {
    id: string;
    name: string;
    description: string;
    boardId: string;
    listId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type List = {
    id: string;
    boardId: string;
    name: string;
}

export type Board = {
    id: string;
    name: string;
    ownerId: string;
}