"use client";

import { useBoardStore } from "../../../store/boardStore";

export function useBoard() {
  const { board, setTitle } = useBoardStore();

  return {
    board,
    title: board.title,
    setTitle,
  };
}
