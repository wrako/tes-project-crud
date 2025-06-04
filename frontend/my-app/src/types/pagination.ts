// src/types/pagination.ts
import { Offer } from "./offer";

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;          // текущая страница (0-based)
  size: number;            // текущий размер страницы
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  // остальные поля (если понадобятся): sort, pageable и т.д.
}
