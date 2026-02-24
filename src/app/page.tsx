import { BoardHeader } from "../features/board/components/BoardHeader";

export default function Home() {
  return (
    <div className="app">
      <div className="board">
        <BoardHeader />
        <main className="board__surface"></main>
      </div>
    </div>
  );
}
