"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ListWithCards } from "@/features/list/hooks/useBoardLists";
import { ListColumn } from "@/features/list/components/ListColumn";
import "./SortableListColumn.scss";

interface SortableListColumnProps {
  list: ListWithCards;
}

export function SortableListColumn({ list }: SortableListColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-list ${isDragging ? "sortable-list--dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <ListColumn list={list} />
    </div>
  );
}
