// src/components/crud/toolbar/OffersToolbar.tsx
"use client";

import { FC } from "react";
import { useOffersContext } from "../context/OffersContext";
import Toolbar from "./Toolbar";

const OffersToolbar: FC = () => {
  const { openAddModal, openDeleteModal, selectedIds } = useOffersContext();

  return (
    <div className="px-6 py-4">
      <Toolbar
        onAdd={openAddModal}
        onDelete={openDeleteModal}
        disableDelete={selectedIds.size === 0}
      />
    </div>
  );
};

export default OffersToolbar;
