"use client";

import { FC } from "react";
import OfferTable from "./OfferTable";
import Pagination from "./pagination/Pagination";
import OfferFormModal from "../toolbar/create/OfferFormModal";
import ConfirmDeleteModal from "../toolbar/delete/ConfirmDeleteModal";
import ErrorModal from "../ErrorModal";
import { useOffersContext } from "../context/OffersContext";

const OffersTableSection: FC = () => {
  const {
    // данные для таблицы и чекбоксы
    offers,
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,

    // сортировка
    sortField,
    sortDirection,
    handleSortChange,

    // пагинация
    page,
    totalPages,
    size,
    goToPage,
    changeSize,

    // модалки
    isFormModalOpen,
    isConfirmDeleteOpen,
    isErrorModalOpen,
    editingOffer,
    errorMessage,

    closeAllModals,
    closeErrorModal,

    handleSave,
    handleDelete,
  } = useOffersContext();

  return (
    <div className="px-6 flex-1 overflow-auto">
      {/* Таблица */}
      <OfferTable
        offers={offers}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectOne={toggleSelectOne}
        openEdit={(offer) => {
          // переклеиваем в контекст
          const { openEditModal } = useOffersContext();
          openEditModal(offer);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Пагинация */}
      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          size={size}
          onPageChange={goToPage}
          onSizeChange={changeSize}
        />
      </div>

      {/* Модалка «Добавить/Редактировать» */}
      <OfferFormModal
        isOpen={isFormModalOpen}
        onClose={closeAllModals}
        editingOffer={editingOffer}
        handleSave={handleSave}
      />

      {/* Модалка «Удалить» */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeAllModals}
        handleDelete={handleDelete}
        selectedCount={selectedIds.size}
      />

      {/* Модалка «Ошибка» */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        message={errorMessage}
      />
    </div>
  );
};

export default OffersTableSection;
