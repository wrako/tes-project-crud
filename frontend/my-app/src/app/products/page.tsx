// src/app/products/new/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
}

const NewProductPage = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>(""); // uchovávame ako text pre kontrolu vstupu
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Stav zoznamu všetkých produktov
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Režim úprav: ak editingId ≠ null, upravujeme produkt s týmto ID
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  // Načítanie všetkých produktov pri načítaní stránky
  useEffect(() => {
    fetchProducts();
  }, []);

  // Funkcia na načítanie produktov
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";
      const response = await fetch("http://localhost:8080/api/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Nepodarilo sa načítať produkty");
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setProductsError(err.message || "Chyba pri načítaní produktov");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Obsluha odoslania formulára (vytvorenie alebo úprava)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (name.trim() === "") {
      setError("Názov nesmie byť prázdny");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Cena musí byť nenegatívne číslo");
      return;
    }

    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";
      let response: Response;
      let resultText: string;

      if (editingId !== null) {
        // PUT pre úpravu
        response = await fetch("http://localhost:8080/api/products", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            id: editingId,
            name: name.trim(),
            price: parsedPrice,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Chyba pri úprave produktu");
        }
        resultText = await response.text();
        setSuccessMessage(`Aktualizované: ${resultText}`);
      } else {
        // POST pre vytvorenie
        response = await fetch("http://localhost:8080/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            price: parsedPrice,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Chyba pri vytvorení produktu");
        }
        resultText = await response.text();
        setSuccessMessage(`Vytvorené: ${resultText}`);
      }

      // Reset formulára
      setName("");
      setPrice("");
      setEditingId(null);

      // Znovu načítať zoznam produktov
      await fetchProducts();
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err.message || "Niečo sa pokazilo");
    }
  };

  // Obsluha kliknutia na "Upraviť" v tabuľke
  const handleEditClick = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setPrice(prod.price.toString());
    setError(null);
    setSuccessMessage(null);
  };

  // Obsluha kliknutia na "Zmazať" v tabuľke
  const handleDeleteClick = async (prod: Product) => {
    const confirmed = window.confirm(
      `Naozaj chcete zmazať produkt "${prod.name}"?`
    );
    if (!confirmed) return;

    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";
      const response = await fetch("http://localhost:8080/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          id: prod.id,
          name: prod.name,
          price: prod.price,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Chyba pri mazaní produktu");
      }

      const resultText = await response.text();
      setSuccessMessage(`Odstránené: ${resultText}`);

      // Znovu načítať zoznam produktov
      await fetchProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message || "Niečo sa pokazilo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Formulár na vytvorenie / úpravu produktu */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {editingId !== null ? "Upraviť produkt" : "Vytvoriť nový produkt"}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-4 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-800 border border-green-300 rounded-md p-2 mb-4 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="product-name"
                className="block text-sm font-medium text-gray-700"
              >
                Názov
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="Zadajte názov produktu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="block text-sm font-medium text-gray-700"
              >
                Cena (€)
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
              >
                {editingId !== null ? "Uložiť zmeny" : "Vytvoriť produkt"}
              </button>
            </div>
          </form>
        </div>

        {/* Zoznam všetkých produktov s tlačidlami Upraviť/Zmazať */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Všetky produkty</h2>

          {loadingProducts ? (
            <div className="text-center py-4">Načítavajú sa produkty...</div>
          ) : productsError ? (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 text-sm">
              {productsError}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500">Žiadne produkty.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase text-sm">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Názov</th>
                    <th className="px-4 py-3">Cena (€)</th>
                    <th className="px-4 py-3">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{prod.id}</td>
                      <td className="px-4 py-3">{prod.name}</td>
                      <td className="px-4 py-3">{prod.price.toFixed(2)}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          Upraviť
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prod)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Zmazať
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;
