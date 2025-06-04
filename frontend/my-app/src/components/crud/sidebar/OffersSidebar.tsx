// src/components/crud/sidebar/OffersSidebar.tsx
"use client";

import { ChangeEvent, FC } from "react";
import { useOffersContext } from "../context/OffersContext";

const OffersSidebar: FC = () => {
  const {
    tempFilter,
    tempPriceRange,
    tempDiscountPriceRange,
    tempQuantityRange,
    tempDiscountPercentRange,
    allProducts,
    loadingProducts,
    productsError,
    onTempFilterChange,
    onPriceSliderChange,
    onDiscountPriceSliderChange,
    onQuantitySliderChange,
    onDiscountPercentSliderChange,
    applyFilters,
    resetFilters,
  } = useOffersContext();

  // Обработчик для чекбокса «Moje ponuky»
  const handleOwnOffersToggle = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // При установке галочки записываем "name" в tempFilter.username
      onTempFilterChange("username", "name");
    } else {
      // Если галочка снята, очищаем поле username
      onTempFilterChange("username", "");
    }
  };

  return (
    <aside className="w-72 bg-white shadow-lg p-6 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Filter ponúk</h3>

      {/* Moje ponuky (zobraziť iba vlastné) */}
      <div className="mb-4 flex items-center">
        <input
          id="myOffers"
          type="checkbox"
          checked={tempFilter.username === "name"}
          onChange={handleOwnOffersToggle}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="myOffers" className="ml-2 text-sm text-gray-700">
          Moje ponuky
        </label>
      </div>

      {/* Meno zákazníka */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Meno zákazníka
        </label>
        <input
          type="text"
          value={tempFilter.customerName || ""}
          onChange={(e) => onTempFilterChange("customerName", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Zadajte meno..."
        />
      </div>

      {/* Platné do (dátum) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Platné do
        </label>
        <input
          type="date"
          value={tempFilter.date || ""}
          onChange={(e) => onTempFilterChange("date", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Produkty (multi-select) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Produkty
        </label>
        <select
          multiple
          value={tempFilter.productsNames || []}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const selected: string[] = Array.from(e.target.selectedOptions).map((opt) => opt.value);
            onTempFilterChange("productsNames", selected);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        >
          {loadingProducts ? (
            <option disabled>Načítavam...</option>
          ) : productsError ? (
            <option disabled>Chyba: {productsError}</option>
          ) : (
            allProducts.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} (€{p.price.toFixed(2)})
              </option>
            ))
          )}
        </select>
        <p className="mt-1 text-xs text-gray-500">(Držte Ctrl/Cmd, aby ste vybrali viaceré.)</p>
      </div>

      {/* Cena (€) od/do */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cena (€)
        </label>
        <div className="flex space-x-2">
          <input
            type="range"
            min={0}
            max={10000}
            value={tempPriceRange[0]}
            onChange={(e) => onPriceSliderChange(0, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={10000}
            value={tempPriceRange[1]}
            onChange={(e) => onPriceSliderChange(1, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempPriceRange[0].toFixed(2)} € — {tempPriceRange[1].toFixed(2)} €
        </div>
      </div>

      {/* Cena so zľavou (€) od/do */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cena so zľavou (€)
        </label>
        <div className="flex space-x-2">
          <input
            type="range"
            min={0}
            max={10000}
            value={tempDiscountPriceRange[0]}
            onChange={(e) => onDiscountPriceSliderChange(0, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={10000}
            value={tempDiscountPriceRange[1]}
            onChange={(e) => onDiscountPriceSliderChange(1, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempDiscountPriceRange[0].toFixed(2)} € — {tempDiscountPriceRange[1].toFixed(2)} €
        </div>
      </div>

      {/* Množstvo od/do */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Množstvo
        </label>
        <div className="flex space-x-2">
          <input
            type="range"
            min={0}
            max={1000}
            value={tempQuantityRange[0]}
            onChange={(e) => onQuantitySliderChange(0, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={1000}
            value={tempQuantityRange[1]}
            onChange={(e) => onQuantitySliderChange(1, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempQuantityRange[0]} — {tempQuantityRange[1]}
        </div>
      </div>

      {/* Zľava (%) od/do */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zľava (%)
        </label>
        <div className="flex space-x-2">
          <input
            type="range"
            min={0}
            max={100}
            value={tempDiscountPercentRange[0]}
            onChange={(e) => onDiscountPercentSliderChange(0, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={tempDiscountPercentRange[1]}
            onChange={(e) => onDiscountPercentSliderChange(1, Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempDiscountPercentRange[0].toFixed(2)}% — {tempDiscountPercentRange[1].toFixed(2)}%
        </div>
      </div>

      {/* Кнопки „Filtruj“ и „Vymazať filter“ */}
      <div className="flex space-x-2">
        <button
          onClick={applyFilters}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Filtruj
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Vymazať filter
        </button>
      </div>
    </aside>
  );
};

export default OffersSidebar;
