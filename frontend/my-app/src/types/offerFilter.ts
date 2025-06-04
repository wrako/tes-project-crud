// src/types/offerFilter.ts

export interface OfferFilter {
  customerName?: string;
  username?: string;
  date?: string;                    // "YYYY-MM-DD"
  productsNames?: string[];         // список имён продуктов для фильтрации

  price?: number;
  priceFrom?: number;
  priceTo?: number;

  discountPrice?: number;
  discountPriceFrom?: number;
  discountPriceTo?: number;

  quantity?: number;
  quantityFrom?: number;
  quantityTo?: number;

  discountPercent?: number;
  discountPercentFrom?: number;
  discountPercentTo?: number;
}
