"use client";

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./BoardContent.scss";
import { useBoardLists } from "@/features/list/hooks/useBoardLists";
import { useBoardStore } from "@/store/boardStore";
import { TextInput } from "@/components/ui/TextInput";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { SortableListColumn } from "./SortableListColumn";
import { ListColumn } from "@/features/list/components/ListColumn";
import { CardItem } from "@/features/card/components/CardItem";

export function BoardContent() {
  const { listsWithCards } = useBoardLists();
  const addList = useBoardStore((s) => s.addList);
  const reorderLists = useBoardStore((s) => s.reorderLists);
  const moveCard = useBoardStore((s) => s.moveCard);

  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const addListFormRef = useRef<HTMLDivElement | null>(null);
  const addListInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const listIds = useMemo(
    () => listsWithCards.map((l) => l.id),
    [listsWithCards],
  );
  const isListId = useCallback(
    (id: string) => listIds.includes(id),
    [listIds],
  );
  const activeList = useMemo(
    () => (activeId && isListId(activeId) ? listsWithCards.find((l) => l.id === activeId) ?? null : null),
    [activeId, listsWithCards, isListId],
  );
  const activeCard = useMemo(() => {
    if (!activeId || isListId(activeId)) return null;
    for (const list of listsWithCards) {
      const card = list.cards.find((c) => c.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, listsWithCards, isListId]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      if (isListId(activeIdStr)) {
        const fromIndex = listIds.indexOf(activeIdStr);
        const toIndex = listIds.indexOf(overIdStr);
        if (fromIndex === -1 || toIndex === -1) return;
        reorderLists(fromIndex, toIndex);
        return;
      }

      if (isListId(overIdStr)) {
        const targetList = listsWithCards.find((l) => l.id === overIdStr);
        if (targetList) moveCard(activeIdStr, overIdStr, targetList.cards.length);
        return;
      }

      const targetList = listsWithCards.find((l) => l.cards.some((c) => c.id === overIdStr));
      if (!targetList) return;
      const overCardIndex = targetList.cards.findIndex((c) => c.id === overIdStr);
      if (overCardIndex === -1) return;
      const isSameList = targetList.cards.some((c) => c.id === activeIdStr);
      const targetIndex =
        isSameList
          ? (() => {
              const activeIndex = targetList.cards.findIndex((c) => c.id === activeIdStr);
              return activeIndex < overCardIndex ? overCardIndex : overCardIndex + 1;
            })()
          : overCardIndex + 1;
      moveCard(activeIdStr, targetList.id, targetIndex);
    },
    [listIds, listsWithCards, isListId, reorderLists, moveCard],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleAddList = useCallback(() => {
    const t = newListTitle.trim();
    if (t) {
      addList(t);
      setNewListTitle("");
      addListInputRef.current?.focus();
    }
  }, [newListTitle, addList]);

  const handleCloseAddList = useCallback(() => {
    setShowAddListForm(false);
    setNewListTitle("");
  }, []);

  useLayoutEffect(() => {
    if (showAddListForm && addListInputRef.current) {
      addListInputRef.current.focus();
    }
  }, [showAddListForm]);

  useEffect(() => {
    if (!showAddListForm) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (addListFormRef.current?.contains(target)) return;
      handleCloseAddList();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddListForm, handleCloseAddList]);

  const addListFormOrButton = (
    <>
      {showAddListForm ? (
        <div ref={addListFormRef} className="board__add-list-form">
          <TextInput
            ref={addListInputRef}
            className="board__add-list-input"
            placeholder="Enter a list title..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddList();
              if (e.key === "Escape") handleCloseAddList();
            }}
            aria-label="List title"
          />
          <div className="board__add-list-actions">
            <button
              type="button"
              className="board__add-list-submit"
              onClick={handleAddList}
            >
              Add list
            </button>
            <button
              type="button"
              className="board__add-list-cancel"
              aria-label="Close"
              onClick={handleCloseAddList}
            >
              <CloseIcon
                width="16"
                height="16"
                className="board__add-list-close-icon"
              />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="board__add-list"
          onClick={() => setShowAddListForm(true)}
        >
          + Add another list
        </button>
      )}
    </>
  );

  if (!mounted) {
    return (
      <section className="board__wrapper">
        {listsWithCards.map((list) => (
          <div key={list.id} className="sortable-list">
            <ListColumn list={list} />
          </div>
        ))}
        {addListFormOrButton}
      </section>
    );
  }

  return (
    <section className="board__wrapper">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={listIds}
          strategy={horizontalListSortingStrategy}
        >
          {listsWithCards.map((list) => (
            <SortableListColumn key={list.id} list={list} />
          ))}
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeList ? (
            <div className="board__drag-overlay-list">
              <ListColumn list={activeList} />
            </div>
          ) : activeCard ? (
            <div className="board__drag-overlay-card">
              <CardItem card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>

        {addListFormOrButton}
      </DndContext>
    </section>
  );
}
