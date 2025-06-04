// src/components/crud/toolbar/Toolbar.tsx
"use client";

import { FC } from "react";
import AddOfferButton from "./AddOfferButton";
import DeleteOfferButton from "./DeleteOfferButton";

interface ToolbarProps {
  onAdd: () => void;
  onDelete: () => void;
  disableDelete: boolean;
}

const Toolbar: FC<ToolbarProps> = ({ onAdd, onDelete, disableDelete }) => {
  return (
    <div className="flex justify-between items-center bg-blue-700 text-white rounded-t-lg px-6 py-4">
      <h2 className="text-xl font-semibold">
        Spravovať <span className="font-bold">Ponuky</span>
      </h2>
      <div className="flex space-x-2">
        <AddOfferButton onAdd={onAdd} />
        <DeleteOfferButton onDelete={onDelete} disabled={disableDelete} />
      </div>
    </div>
  );
};

export default Toolbar;
