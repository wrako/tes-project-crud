// src/components/crud/pagination/Pagination.tsx
"use client";

import { FC } from "react";

interface PaginationProps {
  page: number;               // тек. страница (0-based)
  totalPages: number;         // кол-во страниц
  size: number;               // элементов на странице
  onPageChange: (newPage: number) => void;
  onSizeChange: (newSize: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
}) => {
  const goToPrevious = () => onPageChange(page - 1);
  const goToNext = () => onPageChange(page + 1);

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Кнопки Prev / номера страниц / Next */}
      <div>
        <button
          onClick={goToPrevious}
          disabled={page === 0}
          className={`px-3 py-1 rounded ${
            page === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Predchádzajúca
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onPageChange(idx)}
            className={`mx-1 px-3 py-1 rounded ${
              idx === page
                ? "bg-blue-700 text-white font-semibold"
                : "bg-blue-300 text-blue-800 hover:bg-blue-400"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={goToNext}
          disabled={page === totalPages - 1}
          className={`px-3 py-1 rounded ${
            page === totalPages - 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Nasledujúca
        </button>
      </div>

      {/* Селект “элементов на страницу” */}
      <div className="flex items-center space-x-2">
        <span>Položiek na stránku:</span>
        <select
          value={size}
          onChange={(e) => {
            onSizeChange(Number(e.target.value));
          }}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
