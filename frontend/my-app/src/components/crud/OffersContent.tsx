"use client";

import { Offer } from "@/types/offer";
import { FC } from "react";
import Pagination from "./table/pagination/Pagination";
import OfferTable from "./table/OfferTable";

interface OffersContentProps {
  offers: Offer[];
  selectedIds: Set<number>;
  toggleSelectAll: () => void;
  toggleSelectOne: (id: number) => void;
  openEdit: (offer: Offer) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;

  page: number;
  totalPages: number;
  size: number;
  onPageChange: (newPage: number) => void;
  onSizeChange: (newSize: number) => void;
}

const OffersContent: FC<OffersContentProps> = ({
  offers,
  selectedIds,
  toggleSelectAll,
  toggleSelectOne,
  openEdit,
  sortField,
  sortDirection,
  onSortChange,

  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
}) => {
  return (
    <div className="px-6 flex-1 overflow-auto">
      <OfferTable
        offers={offers}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectOne={toggleSelectOne}
        openEdit={openEdit}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          size={size}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
        />
      </div>
    </div>
  );
};

export default OffersContent;
