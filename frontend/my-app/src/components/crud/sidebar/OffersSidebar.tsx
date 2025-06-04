"use client";

import { ChangeEvent, FC } from "react";
import { useOffersContext } from "../context/OffersContext";
import { OfferFilter } from "../../../types/offerFilter";

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

  return (
    <aside className="w-72 bg-white shadow-lg p-6 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Filter ponúk</h3>

      {/* Meno zákazníka */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Meno zákazníka
        </label>
        <input
          type="text"
          value={tempFilter.customerName || ""}
          onChange={(e) =>
            onTempFilterChange("customerName", e.target.value)
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Zadajte meno..."
        />
      </div>

      {/* Platné do (дата) */}
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

      {/* Produkty (мультивыбор) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Produkty
        </label>
        <select
          multiple
          value={tempFilter.productsNames || []}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const selected: string[] = Array.from(
              e.target.selectedOptions
            ).map((opt) => opt.value);
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
        <p className="mt-1 text-xs text-gray-500">
          (Držte Ctrl/Cmd, aby ste vybrali viaceré.)
        </p>
      </div>

      {/* ЦЕНИ ОТ/ДО (двойной ползунок от 0 до 10 000) */}
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
            onChange={(e) =>
              onPriceSliderChange(0, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={10000}
            value={tempPriceRange[1]}
            onChange={(e) =>
              onPriceSliderChange(1, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempPriceRange[0].toFixed(2)} € — {tempPriceRange[1].toFixed(2)} €
        </div>
      </div>

      {/* ЦЕНЫ СО СКИДКОЙ ОТ/ДО (двойной ползунок от 0 до 10 000) */}
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
            onChange={(e) =>
              onDiscountPriceSliderChange(0, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={10000}
            value={tempDiscountPriceRange[1]}
            onChange={(e) =>
              onDiscountPriceSliderChange(1, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempDiscountPriceRange[0].toFixed(2)} € —{" "}
          {tempDiscountPriceRange[1].toFixed(2)} €
        </div>
      </div>

      {/* КОЛИЧЕСТВО ОТ/ДО (двойной ползунок от 0 до 1000) */}
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
            onChange={(e) =>
              onQuantitySliderChange(0, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={1000}
            value={tempQuantityRange[1]}
            onChange={(e) =>
              onQuantitySliderChange(1, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempQuantityRange[0]} — {tempQuantityRange[1]}
        </div>
      </div>

      {/* СКИДКА (%) ОТ/ДО (двойной ползунок от 0 до 100) */}
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
            onChange={(e) =>
              onDiscountPercentSliderChange(0, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={tempDiscountPercentRange[1]}
            onChange={(e) =>
              onDiscountPercentSliderChange(1, Number(e.target.value))
            }
            className="w-full accent-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {tempDiscountPercentRange[0].toFixed(2)}% —{" "}
          {tempDiscountPercentRange[1].toFixed(2)}%
        </div>
      </div>

      {/* Кнопки «Filtruj» и «Vymazať filter» */}
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
