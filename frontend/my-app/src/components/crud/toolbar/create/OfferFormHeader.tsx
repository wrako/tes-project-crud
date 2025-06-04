// src/components/crud/OfferFormHeader.tsx
"use client";

import { FC } from "react";

interface OfferFormHeaderProps {
  editing: boolean;
}

const OfferFormHeader: FC<OfferFormHeaderProps> = ({ editing }) => (
  <h4 className="text-xl font-semibold mb-4">
    {editing ? "Edit Offer" : "Add Offer"}
  </h4>
);

export default OfferFormHeader;
