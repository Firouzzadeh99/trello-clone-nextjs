"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Board, List, Card } from "../types/board";

const BOARD_STORAGE_KEY = "trello-demo-board";

interface BoardState {
  board: Board;
  lists: List[];
  cards: Card[];
  setTitle: (title: string) => void;
}

const createInitialBoard = (): Board => {
  const now = new Date().toISOString();
  return {
    id: "demo-board",
    title: "Demo Board",
    createdAt: now,
    updatedAt: now,
  };
};

const createInitialLists = (): List[] => [
  { id: "todo", title: "Todo", order: 0 },
  { id: "in-progress", title: "In Progress", order: 1 },
  { id: "done", title: "Done", order: 2 },
];

const createInitialCards = (): Card[] => [
  {
    id: "c1",
    listId: "todo",
    title: "Create interview Kanban",
    order: 0,
    commentCount: 0,
  },
  {
    id: "c2",
    listId: "todo",
    title: "Review Drag & Drop",
    order: 1,
    commentCount: 0,
  },
  {
    id: "c3",
    listId: "in-progress",
    title: "Set up Next.js project",
    order: 0,
    commentCount: 0,
  },
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      board: createInitialBoard(),
      lists: createInitialLists(),
      cards: createInitialCards(),
      setTitle: (title) =>
        set((state) => ({
          board: {
            ...state.board,
            title,
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: BOARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        board: state.board,
      }),
    },
  ),
);

