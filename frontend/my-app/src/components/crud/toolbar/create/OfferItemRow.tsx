"use client";

import { FC } from "react";
import { OfferItem, Product } from "../../../../types/offer";

interface OfferItemRowProps {
  item: OfferItem;
  index: number;
  products: Product[];
  onProductChange: (idx: number, product: Product) => void;
  onQuantityChange: (idx: number, qty: number) => void;
  onPriceChange: (idx: number, price: number) => void;
  onRemove: (idx: number) => void;
}

const OfferItemRow: FC<OfferItemRowProps> = ({
  item,
  index,
  products,
  onProductChange,
  onQuantityChange,
  onPriceChange,
  onRemove,
}) => (
  <div className="grid grid-cols-12 gap-2 items-end mb-2">
    {/* Выбор продукта */}
    <div className="col-span-4">
      <label className="block text-xs font-medium text-gray-600">Produkt</label>
      <select
        value={item.product.id}
        onChange={(e) => {
          const pid = Number(e.target.value);
          const sel = products.find((p) => p.id === pid);
          if (sel) onProductChange(index, sel);
        }}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={0}>— Vyberte produkt —</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (€{p.price.toFixed(2)})
          </option>
        ))}
      </select>
    </div>

    {/* Количество */}
    <div className="col-span-3">
      <label className="block text-xs font-medium text-gray-600">Množstvo</label>
      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => onQuantityChange(index, Number(e.target.value))}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Цена за единицу */}
    <div className="col-span-3">
      <label className="block text-xs font-medium text-gray-600">Cena (€)</label>
      <input
        type="number"
        min={0}
        step={0.01}
        value={item.price}
        onChange={(e) => onPriceChange(index, Number(e.target.value))}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Удалить строку */}
    <div className="col-span-2 flex justify-center">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-600"
        title="Odstrániť položku"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

export default OfferItemRow;
