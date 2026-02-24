"use client";

import { useState, useMemo, FormEvent } from "react";
import "./CardItem.scss";
import type { Card, CardComment } from "../../../types/board";
import { useBoardStore } from "@/store/boardStore";
import { Modal } from "@/components/ui/modal/Modal";

const EMPTY_COMMENTS: CardComment[] = [];

interface CardItemProps {
  card: Card;
}

export function CardItem({ card }: CardItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftComment, setDraftComment] = useState("");

  const comments = useBoardStore((s) => s.comments[card.id] ?? EMPTY_COMMENTS);
  const addComment = useBoardStore((s) => s.addComment);

  const hasComments = comments.length > 0;

  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [comments],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draftComment.trim()) return;
    addComment(card.id, draftComment);
    setDraftComment("");
  };

  return (
    <>
      <article className="card">
        <p className="card__title">{card.title}</p>
        <button
          className="card__comments card__action"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          Comments ({card.commentCount})
        </button>
      </article>

      <Modal
        isOpen={isModalOpen}
        title={`Comments for "${card.title}"`}
        onClose={() => setIsModalOpen(false)}
        width={388}
      >
        <div className="card-comments">
          {hasComments ? (
            <div className="card-comments__list">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="card-comments__item">
                  <div className="card-comments__meta">
                    <span className="card-comments__author">
                      {comment.author}
                    </span>
                    <span className="card-comments__dot">•</span>
                    <span className="card-comments__date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="card-comments__text">{comment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="card-comments__empty">
              No comments yet. Be the first to comment!
            </p>
          )}

          <form onSubmit={handleSubmit} className="card-comments__form">
            <label className="card-comments__label">
              <textarea
                placeholder="Write a comment..."
                className="card-comments__textarea"
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                rows={3}
              />
            </label>
            <button
              type="submit"
              className="card-comments__submit"
              disabled={!draftComment.trim()}
            >
              Add Comment
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
