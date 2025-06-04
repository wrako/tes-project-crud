// src/components/crud/toolbar/DeleteOfferButton.tsx
"use client";

import { FC } from "react";

interface DeleteOfferButtonProps {
  onDelete: () => void;
  disabled: boolean;
}

const DeleteOfferButton: FC<DeleteOfferButtonProps> = ({ onDelete, disabled }) => {
  return (
    <button
      onClick={onDelete}
      disabled={disabled}
      className={`px-3 py-2 rounded-md flex items-center ${
        disabled
          ? "bg-red-300 text-white cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
        />
      </svg>
      <span>Zmazať</span>
    </button>
  );
};

export default DeleteOfferButton;
