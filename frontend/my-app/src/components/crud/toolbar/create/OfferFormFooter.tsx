"use client";

import { FC } from "react";

interface OfferFormFooterProps {
  totalQuantity: number;
  totalPriceRaw: number;
  discountedPrice: number;
  onCancel: () => void;
  editing: boolean;
}

const OfferFormFooter: FC<OfferFormFooterProps> = ({
  totalQuantity,
  totalPriceRaw,
  discountedPrice,
  onCancel,
  editing,
}) => (
  <>
    <div className="border-t pt-4 mt-4 space-y-1">
      <div className="flex justify-between text-gray-700">
        <span>Celkové množstvo:</span>
        <span>{totalQuantity}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Celková cena:</span>
        <span>€{totalPriceRaw.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Cena so zľavou:</span>
        <span>€{isNaN(discountedPrice) ? "0.00" : discountedPrice.toFixed(2)}</span>
      </div>
    </div>

    <div className="flex justify-end space-x-2 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        Zrušiť
      </button>
      <button
        type="submit"
        className={`px-4 py-2 rounded-md text-white ${
          editing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {editing ? "Uložiť" : "Pridať"}
      </button>
    </div>
  </>
);

export default OfferFormFooter;
