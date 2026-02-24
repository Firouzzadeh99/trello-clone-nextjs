"use client";

import { useCallback } from "react";
import { useDraggable, useDroppable, useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../../../types/board";
import { CardItem } from "./CardItem";
import "./CardItem.scss";

interface DraggableCardProps {
  card: Card;
}

function mergeRefs<T>(...refs: Array<((node: T) => void) | null>) {
  return (node: T) => {
    refs.forEach((ref) => ref?.(node));
  };
}

export function DraggableCard({ card }: DraggableCardProps) {
  const { active } = useDndContext();
  const isDragging = active?.id === card.id;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: card.id,
    data: { type: "card", card },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: card.id,
    data: { type: "card", card },
  });

  const setRef = useCallback(
    mergeRefs<HTMLDivElement>(setDraggableRef, setDroppableRef),
    [setDraggableRef, setDroppableRef],
  );

  return (
    <div
      ref={setRef}
      className={`card-wrapper ${isDragging ? "card-wrapper--origin" : ""}`}
      style={
        !isDragging && transform
          ? { transform: CSS.Translate.toString(transform) }
          : undefined
      }
      {...attributes}
      {...listeners}
    >
      <CardItem card={card} />
    </div>
  );
}
