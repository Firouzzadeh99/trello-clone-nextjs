"use client";

import { useMemo } from "react";
import { useBoardStore } from "../../../store/boardStore";
import type { List, Card } from "../../../types/board";

export interface ListWithCards extends List {
  cards: Card[];
}

export function useBoardLists() {
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);

  const listsWithCards = useMemo<ListWithCards[]>(
    () =>
      [...lists]
        .sort((a, b) => a.order - b.order)
        .map((list) => ({
          ...list,
          cards: cards
            .filter((card) => card.listId === list.id)
            .sort((a, b) => a.order - b.order),
        })),
    [lists, cards],
  );

  return { listsWithCards };
}

