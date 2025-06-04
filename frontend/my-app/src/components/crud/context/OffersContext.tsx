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


interface OffersContextProps {
  // Данные таблицы
  offers: Offer[];
  totalPages: number;
  page: number;
  size: number;

  // Чекбоксы выбора
  selectedIds: Set<number>;
  toggleSelectAll: () => void;
  toggleSelectOne: (id: number) => void;

  // Сортировка
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSortChange: (field: string) => void;

  // Фильтры (временные и активные)
  tempFilter: OfferFilter;
  tempPriceRange: [number, number];
  tempDiscountPriceRange: [number, number];
  tempQuantityRange: [number, number];
  tempDiscountPercentRange: [number, number];

  activeFilter: OfferFilter;
  activePriceRange: [number, number];
  activeDiscountPriceRange: [number, number];
  activeQuantityRange: [number, number];
  activeDiscountPercentRange: [number, number];

  allProducts: Product[];
  loadingProducts: boolean;
  productsError: string | null;

  onTempFilterChange: (key: keyof OfferFilter, value: any) => void;
  onPriceSliderChange: (idx: 0 | 1, value: number) => void;
  onDiscountPriceSliderChange: (idx: 0 | 1, value: number) => void;
  onQuantitySliderChange: (idx: 0 | 1, value: number) => void;
  onDiscountPercentSliderChange: (idx: 0 | 1, value: number) => void;

  applyFilters: () => void;
  resetFilters: () => void;

  // Модалки и действия
  isFormModalOpen: boolean;
  isConfirmDeleteOpen: boolean;
  isErrorModalOpen: boolean;
  editingOffer: Offer | null;
  errorMessage: string;

  openAddModal: () => void;
  openEditModal: (offer: Offer) => void;
  openDeleteModal: () => void;
  closeAllModals: () => void;
  closeErrorModal: () => void;

  handleSave: (newOffer: Offer) => Promise<void>;
  handleDelete: () => Promise<void>;

  // Пагинация
  goToPage: (p: number) => void;
  changeSize: (newSize: number) => void;
}

const OffersContext = createContext<OffersContextProps | undefined>(undefined);

export default function OffersProvider({ children }: { children: ReactNode }) {
  // ====== Состояния ======

  // таблица
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  // выбор записей
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // сортировка
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ====== Фильтры ======
  // Note: добавили поле username в OfferFilter
  const [tempFilter, setTempFilter] = useState<OfferFilter>({
    username: "",             // здесь будем хранить "name" при галочке
    customerName: "",
    date: "",
    productsNames: [],
    priceFrom: undefined,
    priceTo: undefined,
    discountPriceFrom: undefined,
    discountPriceTo: undefined,
    quantityFrom: undefined,
    quantityTo: undefined,
    discountPercentFrom: undefined,
    discountPercentTo: undefined,
  });

  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0,
    10000,
  ]);
  const [tempDiscountPriceRange, setTempDiscountPriceRange] = useState<
    [number, number]
  >([0, 10000]);
  const [tempQuantityRange, setTempQuantityRange] = useState<[number, number]>(
    [0, 1000]
  );
  const [tempDiscountPercentRange, setTempDiscountPercentRange] = useState<
    [number, number]
  >([0, 100]);

  // активные фильтры, которые отправятся на бэк
  const [activeFilter, setActiveFilter] = useState<OfferFilter>({});
  const [activePriceRange, setActivePriceRange] = useState<[number, number]>([
    0,
    10000,
  ]);
  const [activeDiscountPriceRange, setActiveDiscountPriceRange] = useState<
    [number, number]
  >([0, 10000]);
  const [activeQuantityRange, setActiveQuantityRange] = useState<
    [number, number]
  >([0, 1000]);
  const [activeDiscountPercentRange, setActiveDiscountPercentRange] = useState<
    [number, number]
  >([0, 100]);

  // продукты (для мультиселект)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ====== Модалки и ошибки ======
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ==============================

  // ===== Загрузка всех продуктов при монтировании =====
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

  // ===== Отправка запроса за списком Offer’ов (с учётом фильтров, сортировки и пагинации) =====
  const fetchOffers = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken") || "";

      const url = new URL("http://localhost:8080/api/offers/get");
      url.searchParams.set("page", page.toString());
      url.searchParams.set("size", size.toString());
      if (sortField) {
        url.searchParams.set("sort", `${sortField},${sortDirection}`);
      }

      // Формируем тело из activeFilter + диапазонов
      const filterBody: OfferFilter = {};

      // username (если установлена галочка «Moje ponuky»)
      if (activeFilter.username && activeFilter.username.trim()) {
        filterBody.username = activeFilter.username.trim();
      }
      // остальные текстовые фильтры
      if (activeFilter.customerName?.trim()) {
        filterBody.customerName = activeFilter.customerName.trim();
      }
      if (activeFilter.date) {
        filterBody.date = activeFilter.date;
      }
      if (
        activeFilter.productsNames &&
        activeFilter.productsNames.length > 0
      ) {
        filterBody.productsNames = activeFilter.productsNames;
      }

      // диапазоны
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

  // При изменении page, size, sortField, sortDirection или активных фильтров — перезапрашиваем
  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ===== Вспомогательные функции =====

  // Выбрать / снять выбор всех
  const toggleSelectAll = () => {
    if (selectedIds.size === offers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(offers.map((o) => o.id!)));
    }
  };
  // Выбрать / снять выбор одного
  const toggleSelectOne = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Сортировка (при клике на заголовок)
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  // Применить фильтры (по кнопке «Filtruj»)
  const applyFilters = () => {
    setActiveFilter({ ...tempFilter });
    setActivePriceRange([...tempPriceRange]);
    setActiveDiscountPriceRange([...tempDiscountPriceRange]);
    setActiveQuantityRange([...tempQuantityRange]);
    setActiveDiscountPercentRange([...tempDiscountPercentRange]);
    setPage(0);
  };

  // Сбросить фильтры
  const resetFilters = () => {
    setTempFilter({
      username: "",
      customerName: "",
      date: "",
      productsNames: [],
      priceFrom: undefined,
      priceTo: undefined,
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

  // Изменить временные текстовые фильтры (включая username)
  const onTempFilterChange = (key: keyof OfferFilter, value: any) => {
    setTempFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Изменить временные диапазоны (слайдеры)
  const onPriceSliderChange = (idx: 0 | 1, value: number) => {
    setTempPriceRange((prev) => {
      const newArr: [number, number] = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onDiscountPriceSliderChange = (idx: 0 | 1, value: number) => {
    setTempDiscountPriceRange((prev) => {
      const newArr: [number, number] = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onQuantitySliderChange = (idx: 0 | 1, value: number) => {
    setTempQuantityRange((prev) => {
      const newArr: [number, number] = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };
  const onDiscountPercentSliderChange = (idx: 0 | 1, value: number) => {
    setTempDiscountPercentRange((prev) => {
      const newArr: [number, number] = [...prev] as [number, number];
      if (idx === 0) newArr[0] = Math.min(value, newArr[1]);
      else newArr[1] = Math.max(value, newArr[0]);
      return newArr;
    });
  };

  // ===== Модалки: открытие / закрытие =====
  const openAddModal = () => {
    setEditingOffer(null);
    setIsFormModalOpen(true);
  };
  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setIsFormModalOpen(true);
  };
  const openDeleteModal = () => setIsConfirmDeleteOpen(true);

  const closeAllModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setEditingOffer(null);
  };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  // ===== Обработка сохранения (создание/редактирование) =====
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

  // ===== Обработка удаления =====
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

  // ===== Пагинация =====
  const goToPage = (p: number) => {
    if (p >= 0 && p < totalPages) setPage(p);
  };
  const changeSize = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  // ==============================

  return (
    <OffersContext.Provider
      value={{
        // таблица
        offers,
        totalPages,
        page,
        size,

        // выбор
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,

        // сортировка
        sortField,
        sortDirection,
        handleSortChange,

        // фильтры
        tempFilter,
        tempPriceRange,
        tempDiscountPriceRange,
        tempQuantityRange,
        tempDiscountPercentRange,

        activeFilter,
        activePriceRange,
        activeDiscountPriceRange,
        activeQuantityRange,
        activeDiscountPercentRange,

        allProducts,
        loadingProducts,
        productsError,

        onTempFilterChange,
        onPriceSliderChange,
        onDiscountPriceSliderChange,
        onQuantitySliderChange,
        onDiscountPercentSliderChange,

        applyFilters,
        resetFilters,

        // модалки
        isFormModalOpen,
        isConfirmDeleteOpen,
        isErrorModalOpen,
        editingOffer,
        errorMessage,

        openAddModal,
        openEditModal,
        openDeleteModal,
        closeAllModals,
        closeErrorModal,

        handleSave,
        handleDelete,

        // пагинация
        goToPage,
        changeSize,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
}

// Хук-обёртка для удобного использования контекста
export const useOffersContext = (): OffersContextProps => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error(
      "useOffersContext must be used inside an OffersProvider"
    );
  }
  return context;
};
