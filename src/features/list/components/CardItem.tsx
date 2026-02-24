"use client";

import "./CardItem.scss";
import type { Card } from "../../../types/board";

interface CardItemProps {
  card: Card;
}

export function CardItem({ card }: CardItemProps) {
  return (
    <article className="card">
      <p className="card__title">{card.title}</p>
      <button className="card__comments card__action" type="button">
        Comments ({card.commentCount})
      </button>
    </article>
  );
}

