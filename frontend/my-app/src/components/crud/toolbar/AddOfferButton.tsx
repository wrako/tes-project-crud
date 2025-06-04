// src/components/crud/toolbar/AddOfferButton.tsx
"use client";

import { FC } from "react";

interface AddOfferButtonProps {
  onAdd: () => void;
}

const AddOfferButton: FC<AddOfferButtonProps> = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>Pridať novú ponuku</span>
    </button>
  );
};

export default AddOfferButton;
