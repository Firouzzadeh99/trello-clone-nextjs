"use client";

import { BoardContent } from "@/features/board/components/BoardContent";
import { BoardHeader } from "@/features/board/components/BoardHeader";

export default function Home() {
  return (
    <div className="app">
      <div className="board">
        <BoardHeader />
        <BoardContent />
      </div>
    </div>
  );
}
