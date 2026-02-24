"use client";

import "./BoardContent.scss";
import { useBoardLists } from "../../list/hooks/useBoardLists";
import { ListColumn } from "../../list/components/ListColumn";

export function BoardContent() {
  const { listsWithCards } = useBoardLists();

  return (
    <section className="board__wrapper">
      {listsWithCards.map((list) => (
        <ListColumn key={list.id} list={list} />
      ))}
      <button className="board__add-list" type="button">
        + Add another list
      </button>
    </section>
  );
}

