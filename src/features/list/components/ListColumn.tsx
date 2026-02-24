"use client";

import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  KeyboardEvent,
  MouseEvent,
} from "react";
import "./ListColumn.scss";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import type { ListWithCards } from "../hooks/useBoardLists";
import { DraggableCard } from "../../card/components/DraggableCard";
import { EllipsisIcon } from "@/components/icons/EllipsisIcon";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { TextInput } from "@/components/ui/TextInput";
import { useBoardStore } from "@/store/boardStore";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface ListColumnProps {
  list: ListWithCards;
}

export function ListColumn({ list }: ListColumnProps) {
  const setListTitle = useBoardStore((s) => s.setListTitle);
  const addCard = useBoardStore((s) => s.addCard);
  const deleteList = useBoardStore((s) => s.deleteList);
  const deleteAllCardsInList = useBoardStore((s) => s.deleteAllCardsInList);

  const { setNodeRef } = useDroppable({ id: list.id });
  const { active, over } = useDndContext();
  const isCardDraggingFromThisList =
    active?.id != null && typeof active.id === "string" && list.cards.some((c) => c.id === active.id);
  const isCardOverThisList =
    active?.id != null &&
    typeof active.id === "string" &&
    over?.id === list.id;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(list.title);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [popoverMode, setPopoverMode] = useState<
    "actions" | "deleteList" | "deleteAllCards"
  >("actions");

  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const addCardInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const addCardFormRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      const input = titleInputRef.current;
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }, [isEditingTitle]);

  useLayoutEffect(() => {
    if (showAddCardForm && addCardInputRef.current) {
      addCardInputRef.current.focus();
    }
  }, [showAddCardForm]);

  const handleTitleCommit = useCallback(() => {
    const trimmed = draftTitle.trim();
    setListTitle(list.id, trimmed || list.title);
    setIsEditingTitle(false);
  }, [list.id, list.title, draftTitle, setListTitle]);

  const handleTitleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTitleCommit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setDraftTitle(list.title);
        setIsEditingTitle(false);
      }
    },
    [list.title, handleTitleCommit],
  );

  const handleMenuClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setPopoverOpen((prev) => !prev);
  }, []);

  const handleCreateCard = useCallback(() => {
    const t = newCardTitle.trim();
    if (t) {
      addCard(list.id, t);
      setNewCardTitle("");
      addCardInputRef.current?.focus();
    }
  }, [list.id, newCardTitle, addCard]);

  const handleCloseAddCard = useCallback(() => {
    setShowAddCardForm(false);
    setNewCardTitle("");
  }, []);

  useEffect(() => {
    if (!showAddCardForm) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (addCardFormRef.current?.contains(target)) return;
      handleCloseAddCard();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddCardForm, handleCloseAddCard]);

  useEffect(() => {
    if (!popoverOpen) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      )
        return;
      setPopoverOpen(false);
      setPopoverMode("actions");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen]);

  return (
    <section className="list">
      <header className="list__header">
        {isEditingTitle ? (
          <TextInput
            ref={titleInputRef}
            className="list__title list__title--input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleTitleCommit}
            placeholder="Enter a list title..."
            onKeyDown={handleTitleKeyDown}
            aria-label="List title"
          />
        ) : (
          <h2
            className="list__title"
            onClick={(e) => {
              e.preventDefault();
              setDraftTitle(list.title);
              setIsEditingTitle(true);
            }}
          >
            {list.title}
          </h2>
        )}
        <div className="list__menu-wrap" ref={popoverRef}>
          <button
            ref={menuButtonRef}
            type="button"
            className="list__menu-button"
            aria-label="List actions"
            aria-expanded={popoverOpen}
            onClick={handleMenuClick}
          >
            <EllipsisIcon className="list__menu-icon" />
          </button>
          {popoverOpen && (
            <div className="list__popover">
              <div className="list__popover-header">
                {popoverMode === "actions" ? (
                  <button className="list__popover-button--disabled" disabled></button>
                ) : (
                  <button
                    type="button"
                    className="list__popover-back"
                    aria-label="Back"
                    onClick={() => setPopoverMode("actions")}
                  >
                    <ChevronLeftIcon width={33} height={33} />
                  </button>
                )}
                <span className="list__popover-title">
                  {popoverMode === "deleteList"
                    ? "Delete List"
                    : popoverMode === "deleteAllCards"
                      ? "Delete All Cards"
                      : "List Actions"}
                </span>
                <button
                  type="button"
                  className="list__popover-close"
                  aria-label="Close"
                  onClick={() => {
                    setPopoverOpen(false);
                    setPopoverMode("actions");
                  }}
                >
                 <CloseIcon className="list__popover-close-icon" />
                </button>
              </div>
              <div className="list__popover-body">
                {popoverMode === "actions" && (
                  <>
                    <button
                      type="button"
                      className="list__popover-item"
                      onClick={() => setPopoverMode("deleteList")}
                    >
                      Delete List
                    </button>
                    <button
                      type="button"
                      className="list__popover-item"
                      onClick={() => setPopoverMode("deleteAllCards")}
                    >
                      Delete All Cards
                    </button>
                  </>
                )}
                {popoverMode === "deleteList" && (
                  <div className="list__popover-confirm">
                    <p className="list__popover-confirm-text">
                      All actions will be removed from the activity feed and you won&apos;t be
                      able to re-open the list. There is no undo.
                    </p>
                    <button
                      type="button"
                      className="list__popover-confirm-button list__popover-confirm-button--danger"
                      onClick={() => {
                        deleteList(list.id);
                        setPopoverOpen(false);
                        setPopoverMode("actions");
                      }}
                    >
                      Delete list
                    </button>
                  </div>
                )}
                {popoverMode === "deleteAllCards" && (
                  <div className="list__popover-confirm">
                    <p className="list__popover-confirm-text">
                      This will remove all the cards in this list from the board.
                    </p>
                    <button
                      type="button"
                      className="list__popover-confirm-button list__popover-confirm-button--danger"
                      onClick={() => {
                        deleteAllCardsInList(list.id);
                        setPopoverOpen(false);
                        setPopoverMode("actions");
                      }}
                    >
                      Delete all
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div
        className={`scrollbar-thin list__body${
          isCardDraggingFromThisList ? " list__body--no-scroll" : ""
        }${isCardOverThisList ? " list__body--highlight" : ""}`}
        ref={setNodeRef}
      >
        {list.cards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}

      </div>
        {showAddCardForm ? (
          <div
            ref={addCardFormRef}
            className="list__add-card-form"
          >
            <TextInput
              ref={addCardInputRef}
              textarea
              className="list__add-card-input"
              placeholder="Enter a card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCloseAddCard();
              }}
              aria-label="Card title"
            />
            <div className="list__add-card-actions">
              <button
                type="button"
                className="list__add-card-submit"
                onClick={handleCreateCard}
              >
                Create card
              </button>
              <button
                type="button"
                className="list__add-card-cancel"
                aria-label="Close"
                onClick={handleCloseAddCard}
              >
                 <CloseIcon width="16" height="16" className="list__add-card-close-icon" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="list__add-card"
            onClick={() => setShowAddCardForm(true)}
          >
            + Add another card
          </button>
        )}
    </section>
  );
}
