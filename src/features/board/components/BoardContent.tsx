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
  PointerSensor,
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

export function BoardContent() {
  const { listsWithCards } = useBoardLists();
  const addList = useBoardStore((s) => s.addList);
  const reorderLists = useBoardStore((s) => s.reorderLists);

  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const addListFormRef = useRef<HTMLDivElement | null>(null);
  const addListInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeList = useMemo(
    () => (activeId ? listsWithCards.find((l) => l.id === activeId) : null),
    [activeId, listsWithCards],
  );

  const listIds = useMemo(
    () => listsWithCards.map((l) => l.id),
    [listsWithCards],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = listIds.indexOf(active.id as string);
      const toIndex = listIds.indexOf(over.id as string);
      if (fromIndex === -1 || toIndex === -1) return;
      reorderLists(fromIndex, toIndex);
    },
    [listIds, reorderLists],
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
          ) : null}
        </DragOverlay>

        {addListFormOrButton}
      </DndContext>
    </section>
  );
}
