"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CreatePostPanel } from "./CreatePostPanel";

import type { CreatePostPayload } from "./CreatePostPanel";

export type CreatePostButtonProps = {
  onPublish: (payload: CreatePostPayload) => void;
  className?: string;
};

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function CreatePostButton({ onPublish, className = "" }: CreatePostButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={
          "inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-primary/10 hover:border-primary/30 " +
          className
        }
        aria-expanded={showModal}
        aria-haspopup="dialog"
        aria-label="Crear publicación"
      >
        <PlusIcon />
        Publicar
      </button>
      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <CreatePostPanel
            isOpen
            onClose={() => setShowModal(false)}
            onSubmit={(payload) => {
              onPublish(payload);
              setShowModal(false);
            }}
          />,
          document.body
        )}
    </>
  );
}
