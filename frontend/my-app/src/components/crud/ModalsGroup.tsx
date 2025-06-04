"use client";

import { FC } from "react";
import { Offer } from "../../types/offer";
import OfferFormModal from "./toolbar/create/OfferFormModal";
import ConfirmDeleteModal from "./toolbar/delete/ConfirmDeleteModal";
import ErrorModal from "../crud/ErrorModal";

interface ModalsGroupProps {
  isFormModalOpen: boolean;
  onCloseAll: () => void;

  editingOffer: Offer | null;
  handleSave: (offerToSave: Offer) => void;

  isConfirmDeleteOpen: boolean;
  handleDelete: () => void;
  selectedCount: number;

  isErrorModalOpen: boolean;
  errorMessage: string;
  closeErrorModal: () => void;
}

const ModalsGroup: FC<ModalsGroupProps> = ({
  isFormModalOpen,
  onCloseAll,

  editingOffer,
  handleSave,

  isConfirmDeleteOpen,
  handleDelete,
  selectedCount,

  isErrorModalOpen,
  errorMessage,
  closeErrorModal,
}) => {
  return (
    <>
      {/* Модалка добавления / редактирования */}
      <OfferFormModal
        isOpen={isFormModalOpen}
        onClose={onCloseAll}
        editingOffer={editingOffer}
        handleSave={handleSave}
      />

      {/* Модалка подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={onCloseAll}
        handleDelete={handleDelete}
        selectedCount={selectedCount}
      />

      {/* Модалка ошибки */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        message={errorMessage}
      />
    </>
  );
};

export default ModalsGroup;
