"use client";

import { FC } from "react";
import { OfferItem, Product } from "../../../../types/offer";
import OfferItemRow from "./OfferItemRow";

interface OfferItemsListProps {
  items: OfferItem[];
  products: Product[];
  onAddItem: () => void;
  onProductChange: (idx: number, product: Product) => void;
  onQuantityChange: (idx: number, qty: number) => void;
  onPriceChange: (idx: number, price: number) => void;
  onRemoveItem: (idx: number) => void;
}

const OfferItemsList: FC<OfferItemsListProps> = ({
  items,
  products,
  onAddItem,
  onProductChange,
  onQuantityChange,
  onPriceChange,
  onRemoveItem,
}) => (
  <div>
    <h5 className="text-lg font-medium mb-2">Produkty (max. 5)</h5>
    {items.length === 0 && (
      <div className="text-sm text-gray-500 mb-2">Žiadne položky</div>
    )}
    {items.map((item, idx) => (
      <OfferItemRow
        key={idx}
        item={item}
        index={idx}
        products={products}
        onProductChange={onProductChange}
        onQuantityChange={onQuantityChange}
        onPriceChange={onPriceChange}
        onRemove={onRemoveItem}
      />
    ))}

    {items.length < 5 && (
      <button
        type="button"
        onClick={onAddItem}
        className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
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
        <span>Pridať položku</span>
      </button>
    )}
  </div>
);

export default OfferItemsList;
