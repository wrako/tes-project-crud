"use client";

import { FC } from "react";
import Modal from "../../Modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
  selectedCount: number;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  handleDelete,
  selectedCount,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4 className="text-xl font-semibold mb-4">
        Odstrániť ponuku{selectedCount > 1 ? "y" : ""}
      </h4>
      <p className="text-gray-700 mb-6">
        Ste si istý, že chcete odstrániť {selectedCount} ponuku
        {selectedCount > 1 ? "y" : ""}?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Zrušiť
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Odstrániť
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
