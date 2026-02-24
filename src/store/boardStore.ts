"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Board } from "../types/board";

const BOARD_STORAGE_KEY = "trello-demo-board";

interface BoardState {
  board: Board;
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

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      board: createInitialBoard(),
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
    },
  ),
);

