// data/products.ts
export interface Product {
  id: number;
  name: string;
}

export const products: Product[] = [
  { id: 1, name: "Product A" },
  { id: 2, name: "Product B" },
  { id: 3, name: "Product C" },
  { id: 4, name: "Product D" },
  { id: 5, name: "Product E" },
];
