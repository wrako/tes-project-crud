"use client";

import { FC } from "react";

interface OfferFormMainFieldsProps {
  customerName: string;
  onCustomerNameChange: (v: string) => void;
  note: string;
  onNoteChange: (v: string) => void;
  validUntil: string;
  onValidUntilChange: (v: string) => void;
  discountPercent: number;
  onDiscountPercentChange: (v: number) => void;
}

const OfferFormMainFields: FC<OfferFormMainFieldsProps> = ({
  customerName,
  onCustomerNameChange,
  note,
  onNoteChange,
  validUntil,
  onValidUntilChange,
  discountPercent,
  onDiscountPercentChange,
}) => (
  <>
    {/* Meno zákazníka */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Meno zákazníka
      </label>
      <input
        type="text"
        value={customerName}
        onChange={(e) => onCustomerNameChange(e.target.value)}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Poznámka */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Poznámka</label>
      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Platné do */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Platné do</label>
      <input
        type="date"
        value={validUntil}
        onChange={(e) => onValidUntilChange(e.target.value)}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Zľava (%) */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Zľava (%)</label>
      <input
        type="number"
        value={discountPercent}
        min={0}
        max={100}
        step={0.01}
        onChange={(e) => onDiscountPercentChange(Number(e.target.value))}
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </>
);

export default OfferFormMainFields;
