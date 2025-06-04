// src/components/crud/OfferFormModal.tsx
"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import Modal from "../../Modal";
import { Offer, OfferItem, Product } from "../../../../types/offer";


interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingOffer: Offer | null;
  handleSave: (offerToSave: Offer) => void;
}

const blankItem = (): OfferItem => ({
  product: { id: 0, name: "", price: 0 },
  quantity: 1,
  price: 0,
});

const OfferFormModal: FC<OfferFormModalProps> = ({
  isOpen,
  onClose,
  editingOffer,
  handleSave,
}) => {
  // Основные поля
  const [customerName, setCustomerName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [validUntil, setValidUntil] = useState<string>(""); // "YYYY-MM-DD"
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Список позиций
  const [items, setItems] = useState<OfferItem[]>([blankItem()]);

  // Список продуктов
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // При открытии или редактировании
  useEffect(() => {
    if (editingOffer) {
      setCustomerName(editingOffer.customerName);
      setNote(editingOffer.note);
      setValidUntil(editingOffer.validUntil);
      setDiscountPercent(editingOffer.discountPercent);
      setItems(
        editingOffer.items.map((it) => ({
          id: it.id,
          product: it.product,
          quantity: it.quantity,
          price: it.price,
        }))
      );
    } else {
      setCustomerName("");
      setNote("");
      setValidUntil("");
      setDiscountPercent(0);
      setItems([blankItem()]);
    }
  }, [editingOffer, isOpen]);

  // Загрузка продуктов на каждое открытие формы
  useEffect(() => {
    if (!isOpen) return;
    setLoadingProducts(true);
    setProductsError(null);

    fetch("http://localhost:8080/api/products", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Nepodarilo sa načítať produkty");
        return r.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setProductsError(err.message || "Chyba pri načítaní produktov");
      })
      .finally(() => setLoadingProducts(false));
  }, [isOpen]);

  // Обновление одной строки
  const updateItem = (idx: number, updated: Partial<OfferItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...updated } : it))
    );
  };

  // Удалить строку
  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Добавить строку
  const addItem = () => {
    if (items.length < 5) setItems((prev) => [...prev, blankItem()]);
  };

  // Подсчёты
  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const priceRaw = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const discountPrice = priceRaw * (1 - discountPercent / 100);

  // Сабмит
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Валидация
    if (
      items.length === 0 ||
      items.some((it) => it.product.id === 0 || it.quantity <= 0)
    ) {
      alert("Vyberte aspoň jeden produkt a nastavte kladné množstvo");
      return;
    }

    // Сборка Offer
    const offerToSave: Offer = {
      ...(editingOffer ? { id: editingOffer.id! } : {}),
      customerName: customerName.trim(),
      note: note.trim(),
      validUntil,
      discountPercent,
      price: priceRaw,
      discountPrice,
      quantity: totalQuantity,
      items: items.map((it) => ({
        ...(it.id ? { id: it.id } : {}),
        product: { id: it.product.id, name: it.product.name, price: it.product.price },
        quantity: it.quantity,
        price: it.price,
      })),
    };

    handleSave(offerToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4 className="text-xl font-semibold mb-4">
        {editingOffer ? "Upraviť ponuku" : "Pridať ponuku"}
      </h4>

      {loadingProducts ? (
        <div className="text-center py-4">Načítavam produkty...</div>
      ) : productsError ? (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-4 text-sm">
          {productsError}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Meno zákazníka */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meno zákazníka
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Poznámka */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Poznámka</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Platné do */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Platné do</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
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
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Список позиций */}
          <div>
            <h5 className="text-lg font-medium mb-2">Produkty (max. 5)</h5>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-end mb-2">
                {/* Выбор продукта */}
                <div className="col-span-4">
                  <label className="block text-xs font-medium text-gray-600">Produkt</label>
                  <select
                    value={item.product.id}
                    onChange={(e) => {
                      const pid = Number(e.target.value);
                      const sel = products.find((p) => p.id === pid);
                      if (sel) updateItem(idx, { product: sel, price: sel.price });
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>— Vyberte produkt —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (€{p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Množstvo */}
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-600">Množstvo</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cena za jednotku */}
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-600">Cena (€)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.price}
                    onChange={(e) => updateItem(idx, { price: Number(e.target.value) })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Удалить строку */}
                <div className="col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-500 hover:text-red-600"
                    title="Odstrániť položku"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Добавить ещё строку */}
            {items.length < 5 && (
              <button
                type="button"
                onClick={addItem}
                className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Pridať položku</span>
              </button>
            )}
          </div>

          {/* Подсчёты */}
          <div className="border-t pt-4 mt-4 space-y-1">
            <div className="flex justify-between text-gray-700">
              <span>Celkové množstvo:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Celková cena:</span>
              <span>€{priceRaw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Cena so zľavou:</span>
              <span>€{isNaN(discountPrice) ? "0.00" : discountPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Кнопки Cancel / Save */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                editingOffer ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {editingOffer ? "Uložiť" : "Pridať"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default OfferFormModal;
