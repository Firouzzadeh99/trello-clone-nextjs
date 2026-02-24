"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import "./BoardContent.scss";
import { useBoardLists } from "../../list/hooks/useBoardLists";
import { ListColumn } from "../../list/components/ListColumn";
import { useBoardStore } from "../../../store/boardStore";
import { TextInput } from "../../../components/ui/TextInput";
import { CloseIcon } from "@/components/icons/CloseIcon";

export function BoardContent() {
  const { listsWithCards } = useBoardLists();
  const addList = useBoardStore((s) => s.addList);

  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const addListFormRef = useRef<HTMLDivElement | null>(null);
  const addListInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const handleAddList = useCallback(() => {
    const t = newListTitle.trim();
    if (t) {
      addList(t);
      setNewListTitle("");
      setShowAddListForm(false);
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

  return (
    <section className="board__wrapper">
      {listsWithCards.map((list) => (
        <ListColumn key={list.id} list={list} />
      ))}
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
              <CloseIcon width="16" height="16" className="board__add-list-close-icon" />
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
    </section>
  );
}
