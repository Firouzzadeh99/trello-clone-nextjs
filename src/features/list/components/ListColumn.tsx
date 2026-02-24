"use client";

import "./ListColumn.scss";
import type { ListWithCards } from "../hooks/useBoardLists";
import { CardItem } from "./CardItem";
import { EllipsisIcon } from "../../../components/icons/EllipsisIcon";

interface ListColumnProps {
  list: ListWithCards;
}

export function ListColumn({ list }: ListColumnProps) {
  return (
    <section className="list">
      <header className="list__header">
        <h2 className="list__title">{list.title}</h2>
        <button className="list__menu-button" aria-label="List actions">
          <EllipsisIcon className="list__menu-icon" />
        </button>
      </header>

      <div className="list__body">
        {list.cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}

      </div>
        <button className="list__add-card" type="button">
          + Add another card
        </button>
    </section>
  );
}

