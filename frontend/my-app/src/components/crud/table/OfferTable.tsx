"use client";

import { FC } from "react";
import { Offer, OfferItem } from "../../../types/offer";

interface OfferTableProps {
  offers: Offer[];
  selectedIds: Set<number>;
  toggleSelectAll: () => void;
  toggleSelectOne: (id: number) => void;
  openEdit: (offer: Offer) => void;

  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

const OfferTable: FC<OfferTableProps> = ({
  offers,
  selectedIds,
  toggleSelectAll,
  toggleSelectOne,
  openEdit,
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-b-lg mt-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-black uppercase text-sm">
            <th className="px-4 py-3 text-center w-12">
              <input
                type="checkbox"
                checked={selectedIds.size === offers.length && offers.length > 0}
                onChange={toggleSelectAll}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => onSortChange("customerName")}
            >
              Meno zákazníka{renderSortIcon("customerName")}
            </th>
            <th className="px-4 py-3">Produkty</th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => onSortChange("validUntil")}
            >
              Platné do{renderSortIcon("validUntil")}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => onSortChange("quantity")}
            >
              Celkové množstvo{renderSortIcon("quantity")}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => onSortChange("price")}
            >
              Celková cena{renderSortIcon("price")}
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none"
              onClick={() => onSortChange("discountPrice")}
            >
              Cena so zľavou{renderSortIcon("discountPrice")}
            </th>
            <th className="px-4 py-3 text-center w-24">Akcie</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => {
            const validDate = new Date(offer.validUntil)
              .toISOString()
              .split("T")[0];

            return (
              <tr
                key={offer.id}
                className={`border-b hover:bg-gray-50 ${
                  selectedIds.has(offer.id!) ? "bg-gray-100" : ""
                }`}
              >
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(offer.id!)}
                    onChange={() => toggleSelectOne(offer.id!)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                </td>
                <td className="px-4 py-3">{offer.customerName}</td>
                <td className="px-4 py-3 space-y-1">
                  {offer.items.map((it: OfferItem) => (
                    <div key={it.id} className="text-sm text-gray-700">
                      {it.product.name} — {it.quantity}×€{it.price.toFixed(2)}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3">{validDate}</td>
                <td className="px-4 py-3">{offer.quantity}</td>
                <td className="px-4 py-3">€{offer.price.toFixed(2)}</td>
                <td className="px-4 py-3">€{offer.discountPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openEdit(offer)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Upraviť"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-5-5l5-5m0 0L13 9m5-5v5"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}

          {offers.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                Žiadne ponuky na zobrazenie.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfferTable;
