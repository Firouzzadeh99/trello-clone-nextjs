"use client";
import {
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useBoard } from "../hooks/useBoard";
import { TextInput } from "../../../components/ui/TextInput";
import "./BoardHeader.scss";

export function BoardHeader() {
  const { title, setTitle } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleStartEdit = (event: MouseEvent) => {
    event.preventDefault();
    setDraft(title);
    setIsEditing(true);
  };

  const handleCommit = () => {
    const trimmed = draft.trim();
    setTitle(trimmed.length ? trimmed : "Untitled Board");
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCommit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsEditing(false);
      setDraft(title);
    }
  };

  return (
    <header className="board__header">
      <div>
        {isEditing ? (
          <TextInput
            ref={inputRef}
            className="board__title board__title--input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            aria-label="Board title"
          />
        ) : (
          <h1 className="board__title" onClick={handleStartEdit}>
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}