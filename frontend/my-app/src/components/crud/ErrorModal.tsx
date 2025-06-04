// src/components/crud/ErrorModal.tsx
"use client";

import { FC } from "react";
import Modal from "./Modal";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4 className="text-xl font-semibold mb-4">Chyba</h4>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
