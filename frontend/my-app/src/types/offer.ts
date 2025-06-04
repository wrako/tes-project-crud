// src/types/offer.ts

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface OfferItem {
  id?: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Offer {
  id?: number;
  customerName: string;
  note: string;
  validUntil: string;           // формат "YYYY-MM-DD"
  discountPercent: number;
  price: number;                // Общая сумма (без скидки)
  discountPrice: number;        // Цена со скидкой
  quantity: number;             // Общее количество всех позиций
  items: OfferItem[];
}
