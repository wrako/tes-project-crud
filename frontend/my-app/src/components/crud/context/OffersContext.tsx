"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import { Offer, Product } from "../../../types/offer";
import { PageResponse } from "../../../types/pagination";
import { OfferFilter } from "../../../types/offerFilter";

interface OffersContextType {
  // Таблица + пагинация
  offers: Offer[];
  page: number;
  size: number;
  totalPages: number;
  sortField: string;
  sortDirection: "asc" | "desc";

  // Выбранные строки (checkbox)
  selectedIds: Set<number>;

  // Фильтры (временные)
  tempFilter: OfferFilter;
  tempPriceRange: [number, number];
  tempDiscountPriceRange: [number, number];
  tempQuantityRange: [number, number];
  tempDiscountPercentRange: [number, number];

  // Фильтры (активные, которые отправляем на бэк)
  activeFilter: OfferFilter;
  activePriceRange: [number, number];
  activeDiscountPriceRange: [number, number];
  activeQuantityRange: [number, number];
  activeDiscountPercentRange: [number, number];

  // Список всех продуктов (для фильтра «Продукты»)
  allProducts: Product[];
  loadingProducts: boolean;
  productsError: string | null;

  // Модальные окна
  isFormModalOpen: boolean;
  isConfirmDeleteOpen: boolean;
  isErrorModalOpen: boolean;
  editingOffer: Offer | null;
  errorMessage: string;

  // Методы для таблицы / пагинации / сортировки
  goToPage: (p: number) => void;
  changeSize: (newSize: number) => void;
  toggleSelectAll: () => void;
  toggleSelectOne: (id: number) => void;
  handleSortChange: (field: string) => void;

  // Методы фильтров
  onTempFilterChange: (key: keyof OfferFilter, value: any) => void;
  onPriceSliderChange: (idx: 0 | 1, v: number) => void;
  onDiscountPriceSliderChange: (idx: 0 | 1, v: number) => void;
  onQuantitySliderChange: (idx: 0 | 1, v: number) => void;
  onDiscountPercentSliderChange: (idx: 0 | 1, v: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;

  // Методы модалок (Add/Edit/Delete/Error)
  openAddModal: () => void;
  openEditModal: (offer: Offer) => void;
  closeAllModals: () => void;
  closeErrorModal: () => void;

  handleSave: (newOffer: Offer) => Promise<void>;
  openDeleteModal: () => void;
  handleDelete: () => Promise<void>;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export default function OffersProvider({ children }: { children: ReactNode }) {
  // ======= СТАНДАРТНЫЕ СТЕЙТЫ =======

  // — Таблица + пагинация —
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  // — Выбранные строки (checkbox) —
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // — Сортировка —
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ======= ФИЛЬТРЫ =======

  // Временные (вводимые) значения фильтрации
  const [tempFilter, setTempFilter] = useState<OfferFilter>({
    customerName: "",
    date: "",
    productsNames: [],
    discountPriceFrom: undefined,
    discountPriceTo: undefined,
    quantityFrom: undefined,
    quantityTo: undefined,
    discountPercentFrom: undefined,
    discountPercentTo: undefined,
  });

  // Текущие диапазоны ползунков «от/до»
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000]);
  const [tempDiscountPriceRange, setTempDiscountPriceRange] = useState<[number, number]>([0, 10000]);
  const [tempQuantityRange, setTempQuantityRange] = useState<[number, number]>([0, 1000]);
  const [tempDiscountPercentRange, setTempDiscountPercentRange] = useState<[number, number]>([0, 100]);

  // Активные значения фильтров (те, что отправляем на бэк)
  const [activeFilter, setActiveFilter] = useState<OfferFilter>({});
  const [activePriceRange, setActivePriceRange] = useState<[number, number]>([0, 10000]);
  const [activeDiscountPriceRange, setActiveDiscountPriceRange] = useState<[number, number]>([0, 10000]);
  const [activeQuantityRange, setActiveQuantityRange] = useState<[number, number]>([0, 1000]);
  const [activeDiscountPercentRange, setActiveDiscountPercentRange] = useState<[number, number]>([0, 100]);

  // Список всех продуктов (для мультивыбора «productsNames»)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ======= МОДАЛКИ =======
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ==============================

  // === ЗАГРУЗКА ВСЕХ ПРОДУКТОВ (для фильтра «Продукты») ===
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const jwtToken = localStorage.getItem("jwtToken") || "";
        const res = await fetch("http://localhost:8080/api/products", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!res.ok) throw new Error("Nepodarilo sa načítať produkty");
        const data: Product[] = await res.json();
        setAllProducts(data);
      } catch (err: any) {
        console.error("Chyba pri načítaní produktov:", err);
        setProductsError(err.message || "Chyba pri načítaní produktov");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  // ==============================

  // === ЗАГРУЗКА СПИСКА ОФЕРТ (с учётом фильтров, сортировки, пагинации) ===
  const fetchOffers = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";

      // Готовим URL с query‐параметрами для page/size/sort
      const url = new URL("http://localhost:8080/api/offers/get");
      url.searchParams.set("page", page.toString());
      url.searchParams.set("size", size.toString());
      if (sortField) {
        url.searchParams.set("sort", `${sortField},${sortDirection}`);
      }

      // Строим JSON‐тело POST-запроса
      const filterBody: OfferFilter = {};
      if (activeFilter.customerName?.trim()) {
        filterBody.customerName = activeFilter.customerName.trim();
      }
      if (activeFilter.date) {
        filterBody.date = activeFilter.date;
      }
      if (activeFilter.productsNames && activeFilter.productsNames.length > 0) {
        filterBody.productsNames = activeFilter.productsNames;
      }
      filterBody.priceFrom = activePriceRange[0];
      filterBody.priceTo = activePriceRange[1];
      filterBody.discountPriceFrom = activeDiscountPriceRange[0];
      filterBody.discountPriceTo = activeDiscountPriceRange[1];
      filterBody.quantityFrom = activeQuantityRange[0];
      filterBody.quantityTo = activeQuantityRange[1];
      filterBody.discountPercentFrom = activeDiscountPercentRange[0];
      filterBody.discountPercentTo = activeDiscountPercentRange[1];

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(filterBody),
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || `Status ${response.status}`);
      }

      const data: PageResponse<Offer> = await response.json();
      setOffers(data.content);
      setTotalPages(data.totalPages);
      setSelectedIds(new Set());
    } catch (err: any) {
      console.error("Error fetching offers:", err);
      setErrorMessage(`Nepodarilo sa načítať ponuky:\n${err.message}`);
      setIsErrorModalOpen(true);
    }
  };

  // Перезагружаем список, когда меняются page/size/sort/фильтры
  useEffect(() => {
    fetchOffers();
  }, [
    page,
    size,
    sortField,
    sortDirection,
    activeFilter,
    activePriceRange,
    activeDiscountPriceRange,
    activeQuantityRange,
    activeDiscountPercentRange,
  ]);

  // ==============================

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

  // — Сменить страницу —
  const goToPage = (p: number) => {
    if (p >= 0 && p < totalPages) setPage(p);
  };

  // — Сменить size (элементов на страницу) —
  const changeSize = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  // — Выбрать/снять выбор всего (checkbox в заголовке) —
  const toggleSelectAll = () => {
    if (selectedIds.size === offers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(offers.map((o) => o.id!)));
    }
  };

  // — Выбрать/снять выбор одной строки —
  const toggleSelectOne = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // — Смена сортировки столбца —
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  // — Применить фильтры («Filtruj») —
  const applyFilters = () => {
    setActiveFilter({ ...tempFilter });
    setActivePriceRange([...tempPriceRange]);
    setActiveDiscountPriceRange([...tempDiscountPriceRange]);
    setActiveQuantityRange([...tempQuantityRange]);
    setActiveDiscountPercentRange([...tempDiscountPercentRange]);
    setPage(0);
  };

  // — Сбросить фильтры («Vymazať filter») —
  const resetFilters = () => {
    setTempFilter({
      customerName: "",
      date: "",
      productsNames: [],
      discountPriceFrom: undefined,
      discountPriceTo: undefined,
      quantityFrom: undefined,
      quantityTo: undefined,
      discountPercentFrom: undefined,
      discountPercentTo: undefined,
    });
    setTempPriceRange([0, 10000]);
    setTempDiscountPriceRange([0, 10000]);
    setTempQuantityRange([0, 1000]);
    setTempDiscountPercentRange([0, 100]);

    setActiveFilter({});
    setActivePriceRange([0, 10000]);
    setActiveDiscountPriceRange([0, 10000]);
    setActiveQuantityRange([0, 1000]);
    setActiveDiscountPercentRange([0, 100]);
    setPage(0);
  };

  // — Изменение временных фильтров —
  const onTempFilterChange = (key: keyof OfferFilter, value: any) => {
    setTempFilter((prev) => ({ ...prev, [key]: value }));
  };

  // — Изменение диапазонов ползунков —
  const onPriceSliderChange = (idx: 0 | 1, value: number) => {
    setTempPriceRange((prev) => {
      const newArr = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onDiscountPriceSliderChange = (idx: 0 | 1, value: number) => {
    setTempDiscountPriceRange((prev) => {
      const newArr = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onQuantitySliderChange = (idx: 0 | 1, value: number) => {
    setTempQuantityRange((prev) => {
      const newArr = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onDiscountPercentSliderChange = (idx: 0 | 1, value: number) => {
    setTempDiscountPercentRange((prev) => {
      const newArr = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };

  // ====== МОДАЛКИ: Add/Edit/Delete/Error ======

  const openAddModal = () => {
    setEditingOffer(null);
    setIsFormModalOpen(true);
  };
  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setIsFormModalOpen(true);
  };
  const closeAllModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setEditingOffer(null);
  };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  // — handleSave (POST/EDIT) —
  const handleSave = async (newOffer: Offer) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";
      let response: Response;

      if (editingOffer) {
        response = await fetch(
          `http://localhost:8080/api/offers/edit?id=${editingOffer.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newOffer),
          }
        );
      } else {
        response = await fetch("http://localhost:8080/api/offers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newOffer),
        });
      }

      const resultText = await response.text();

      // Если вернулось «not enough permission», то показываем ошибку
      if (resultText.toLowerCase().includes("not enough permission")) {
        setErrorMessage(resultText);
        setIsErrorModalOpen(true);
        return;
      }

      if (!response.ok) {
        throw new Error(resultText || `Status ${response.status}`);
      }

      setIsFormModalOpen(false);
      setEditingOffer(null);
      await fetchOffers();
    } catch (err: any) {
      console.error("Error saving offer:", err);
      setErrorMessage(`Nepodarilo sa uložiť ponuku:\n${err.message}`);
      setIsErrorModalOpen(true);
    }
  };

  // — handleDelete (DELETE) —
  const openDeleteModal = () => setIsConfirmDeleteOpen(true);
  const handleDelete = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";
      const response = await fetch("http://localhost:8080/api/offers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(Array.from(selectedIds)),
      });

      const resultText = await response.text();

      if (resultText.toLowerCase().includes("not enough permission")) {
        setErrorMessage(resultText);
        setIsErrorModalOpen(true);
        return;
      }

      if (!response.ok) {
        throw new Error(resultText || `Status ${response.status}`);
      }

      setIsConfirmDeleteOpen(false);
      setSelectedIds(new Set());
      await fetchOffers();
    } catch (err: any) {
      console.error("Error deleting offers:", err);
      setErrorMessage(`Nepodarilo sa odstrániť ponuky:\n${err.message}`);
      setIsErrorModalOpen(true);
    }
  };

  // ==============================

  return (
    <OffersContext.Provider
      value={{
        // Таблица + пагинация
        offers,
        page,
        size,
        totalPages,
        sortField,
        sortDirection,

        selectedIds,

        // Фильтры (временные)
        tempFilter,
        tempPriceRange,
        tempDiscountPriceRange,
        tempQuantityRange,
        tempDiscountPercentRange,

        // Фильтры (активные)
        activeFilter,
        activePriceRange,
        activeDiscountPriceRange,
        activeQuantityRange,
        activeDiscountPercentRange,

        // Список продуктов для мультивыбора
        allProducts,
        loadingProducts,
        productsError,

        // Модалки
        isFormModalOpen,
        isConfirmDeleteOpen,
        isErrorModalOpen,
        editingOffer,
        errorMessage,

        goToPage,
        changeSize,
        toggleSelectAll,
        toggleSelectOne,
        handleSortChange,

        onTempFilterChange,
        onPriceSliderChange,
        onDiscountPriceSliderChange,
        onQuantitySliderChange,
        onDiscountPercentSliderChange,
        applyFilters,
        resetFilters,

        openAddModal,
        openEditModal,
        closeAllModals,
        closeErrorModal,

        handleSave,
        openDeleteModal,
        handleDelete,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
}

// Хук для доступа к контексту извне
export function useOffersContext(): OffersContextType {
  const ctx = useContext(OffersContext);
  if (!ctx) {
    throw new Error("useOffersContext must be used within OffersProvider");
  }
  return ctx;
}
