"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Board, List, Card, CardComment, CardId } from "../types/board";

const BOARD_STORAGE_KEY = "trello-demo-board";

interface BoardState {
  board: Board;
  lists: List[];
  cards: Card[];
  comments: Record<CardId, CardComment[]>;
  setTitle: (title: string) => void;
  setListTitle: (listId: string, title: string) => void;
  addCard: (listId: string, title: string) => void;
  addList: (title: string) => void;
  reorderLists: (fromIndex: number, toIndex: number) => void;
  moveCard: (cardId: string, targetListId: string, targetIndex: number) => void;
  addComment: (cardId: string, text: string) => void;
  deleteList: (listId: string) => void;
  deleteAllCardsInList: (listId: string) => void;
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
      comments: {},
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
      moveCard: (cardId, targetListId, targetIndex) => {
        const state = get();
        const card = state.cards.find((c) => c.id === cardId);
        if (!card) return;
        const cardsWithout = state.cards.filter((c) => c.id !== cardId);
        const isSameList = card.listId === targetListId;

        if (isSameList) {
          const listCards = cardsWithout
            .filter((c) => c.listId === targetListId)
            .sort((a, b) => a.order - b.order);
          const inserted = [...listCards];
          inserted.splice(targetIndex, 0, { ...card, listId: targetListId, order: targetIndex });
          const renumbered = inserted.map((c, i) => ({ ...c, order: i }));
          const others = cardsWithout.filter((c) => c.listId !== targetListId);
          set({ cards: [...renumbered, ...others] });
          return;
        }

        const sourceListCards = cardsWithout
          .filter((c) => c.listId === card.listId)
          .sort((a, b) => a.order - b.order);
        const targetListCards = cardsWithout
          .filter((c) => c.listId === targetListId)
          .sort((a, b) => a.order - b.order);
        const sourceRenumbered = sourceListCards.map((c, i) => ({ ...c, order: i }));
        const inserted = [...targetListCards];
        inserted.splice(targetIndex, 0, { ...card, listId: targetListId, order: targetIndex });
        const targetRenumbered = inserted.map((c, i) => ({ ...c, order: i }));
        const others = cardsWithout.filter(
          (c) => c.listId !== card.listId && c.listId !== targetListId,
        );
        set({ cards: [...sourceRenumbered, ...targetRenumbered, ...others] });
      },
      addComment: (cardId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const state = get();
        const existing = state.comments[cardId] ?? [];
        const now = new Date().toISOString();
        const newComment: CardComment = {
          id: `comment-${Date.now()}`,
          cardId,
          text: trimmed,
          createdAt: now,
          author: "You",
        };
        const nextComments = [...existing, newComment];
        const nextCommentsByCard: Record<CardId, CardComment[]> = {
          ...state.comments,
          [cardId]: nextComments,
        };
        const nextCards = state.cards.map((card) =>
          card.id === cardId ? { ...card, commentCount: nextComments.length } : card,
        );
        set({
          comments: nextCommentsByCard,
          cards: nextCards,
        });
      },
      deleteList: (listId) => {
        const state = get();
        const remainingLists = state.lists
          .filter((l) => l.id !== listId)
          .sort((a, b) => a.order - b.order)
          .map((l, index) => ({ ...l, order: index }));

        const cardsToDelete = state.cards.filter((c) => c.listId === listId);
        const remainingCards = state.cards.filter((c) => c.listId !== listId);

        const deleteIds = new Set(cardsToDelete.map((c) => c.id));
        const remainingCommentsEntries = Object.entries(state.comments).filter(
          ([cardId]) => !deleteIds.has(cardId),
        );
        const remainingComments = Object.fromEntries(remainingCommentsEntries);

        set({
          lists: remainingLists,
          cards: remainingCards,
          comments: remainingComments,
        });
      },
      deleteAllCardsInList: (listId) => {
        const state = get();
        const cardsToDelete = state.cards.filter((c) => c.listId === listId);
        const remainingCards = state.cards.filter((c) => c.listId !== listId);

        const deleteIds = new Set(cardsToDelete.map((c) => c.id));
        const remainingCommentsEntries = Object.entries(state.comments).filter(
          ([cardId]) => !deleteIds.has(cardId),
        );
        const remainingComments = Object.fromEntries(remainingCommentsEntries);

        set({
          cards: remainingCards,
          comments: remainingComments,
        });
      },
    }),
    {
      name: BOARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Do not persist any runtime state so Demo Board title resets on refresh
      partialize: () => ({}),
    },
  ),
);

