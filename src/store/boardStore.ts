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
  setListTitle: (listId: string, title: string) => void;
  addCard: (listId: string, title: string) => void;
  addList: (title: string) => void;
  reorderLists: (fromIndex: number, toIndex: number) => void;
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
      setListTitle: (listId, title) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, title: title.trim() || l.title } : l,
          ),
        })),
      addCard: (listId, title) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const state = get();
        const listCards = state.cards.filter((c) => c.listId === listId);
        const nextOrder = listCards.length;
        const newCard: Card = {
          id: `card-${Date.now()}`,
          listId,
          title: trimmed,
          order: nextOrder,
          commentCount: 0,
        };
        set({ cards: [...state.cards, newCard] });
      },
      addList: (title) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const state = get();
        const newList: List = {
          id: `list-${Date.now()}`,
          title: trimmed,
          order: state.lists.length,
        };
        set({ lists: [...state.lists, newList] });
      },
      reorderLists: (fromIndex, toIndex) => {
        const state = get();
        const sorted = [...state.lists].sort((a, b) => a.order - b.order);
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= sorted.length) return;
        const [removed] = sorted.splice(fromIndex, 1);
        sorted.splice(toIndex, 0, removed);
        const nextLists = sorted.map((list, i) => ({ ...list, order: i }));
        set({ lists: nextLists });
      },
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

