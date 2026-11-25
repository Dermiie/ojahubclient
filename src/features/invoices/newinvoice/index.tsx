import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Trash2,
  Warehouse,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import ChooseCustomerDialog from "../choosecustomer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InvoiceLine {
  name: string;
  qty: number;
  price: number;
}

interface InvoiceDraft {
  customerName: string;
  customerPhone: string;
  lines: InvoiceLine[];
  total: number;
}

interface SampleProduct {
  id: string;
  name: string;
  stock: number;
  warehouse: string;
  price: number;
  bulk: boolean;
  emoji: string;
  color: string;
}

const DRAFT_KEY = "ojahub-invoice-draft";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const initialProducts: SampleProduct[] = [
  {
    id: "P001",
    name: "Super Wax Ankara",
    stock: 85,
    warehouse: "Maza Maza Warehouse",
    price: 6000,
    bulk: true,
    emoji: "🧵",
    color: "#F2E5D8",
  },
  {
    id: "P002",
    name: "Hollandais Wax Print",
    stock: 40,
    warehouse: "Maza Maza Warehouse",
    price: 10000,
    bulk: true,
    emoji: "🪡",
    color: "#F5E5E7",
  },
  {
    id: "P003",
    name: "Swiss Voile Lace",
    stock: 64,
    warehouse: "Maza Maza Warehouse",
    price: 6500,
    bulk: false,
    emoji: "🧶",
    color: "#E5EDF3",
  },
  {
    id: "P004",
    name: "George Wrapper",
    stock: 0,
    warehouse: "Maza Maza Warehouse",
    price: 25000,
    bulk: false,
    emoji: "👘",
    color: "#EAE9DB",
  },
  {
    id: "P005",
    name: "Aso-oke Bundle",
    stock: 12,
    warehouse: "Maza Maza Warehouse",
    price: 38000,
    bulk: false,
    emoji: "🧣",
    color: "#E8E5F2",
  },
];

/* --------------------------------------------------
   ADD ITEM MODAL
-------------------------------------------------- */

interface AddItemModalProps {
  lines: InvoiceLine[];
  onAdd: (line: InvoiceLine) => void;
  onClose: () => void;
}

function AddItemModal({ lines, onAdd, onClose }: AddItemModalProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("1");
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.warehouse.toLowerCase().includes(term),
    );
  }, [products, search]);

  const isAdded = (name: string) =>
    lines.some(
      (line) => line.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

  const handleAdd = (product: SampleProduct) => {
    if (product.stock <= 0 || isAdded(product.name)) return;

    onAdd({
      name: product.name,
      qty: 1,
      price: product.price,
    });
  };

  const createProduct = () => {
    const name = newName.trim();
    const price = Number(newPrice);
    const stock = Number(newStock);

    if (!name) {
      setError("Enter a product name.");
      return;
    }

    if (!newPrice || !Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }

    if (
      products.some(
        (product) => product.name.trim().toLowerCase() === name.toLowerCase(),
      )
    ) {
      setError("A product with this name already exists.");
      return;
    }

    const product: SampleProduct = {
      id: `P-${Date.now()}`,
      name,
      stock,
      warehouse: "Maza Maza Warehouse",
      price,
      bulk: false,
      emoji: "📦",
      color: "#E8F1E9",
    };

    setProducts((current) => [...current, product]);

    if (stock > 0) {
      onAdd({
        name: product.name,
        qty: 1,
        price: product.price,
      });
    }

    setNewName("");
    setNewPrice("");
    setNewStock("1");
    setError("");
    setShowCreateForm(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-text-primary/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[24px] border border-border-subtle bg-background-main shadow-2xl sm:max-h-[85vh] sm:rounded-[22px]"
      >
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2
              id="add-item-title"
              className="text-xl font-bold text-text-primary sm:text-2xl"
            >
              {showCreateForm ? "Create new product" : "Add item"}
            </h2>

            <p className="mt-1.5 text-sm text-text-secondary">
              Prices shown from Bulk importer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add item dialog"
            className="flex size-10 items-center justify-center rounded-full border border-primary-light bg-background-main text-primary-base transition hover:bg-primary-subtle"
          >
            <X size={19} />
          </button>
        </div>

        {showCreateForm ? (
          <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
            <div className="space-y-5 pt-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Product name
                </label>

                <input
                  value={newName}
                  onChange={(event) => {
                    setNewName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter product name"
                  className="h-12 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Selling price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={newPrice}
                  onChange={(event) => {
                    setNewPrice(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter selling price"
                  className="h-12 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Available stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(event) => {
                    setNewStock(event.target.value);
                    setError("");
                  }}
                  className="h-12 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition focus:border-primary-base"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm font-medium text-primary-active"
                >
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                  className="h-12 flex-1 rounded-full border border-primary-base bg-background-main text-sm font-semibold text-primary-base transition hover:bg-primary-subtle"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createProduct}
                  className="h-12 flex-1 rounded-full bg-primary-base text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  Create product
                </button>
              </div>

              <p className="text-center text-xs leading-5 text-text-secondary">
                Temporary product data. Backend integration will be added later.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-5 pb-4 sm:px-6">
              <div className="flex h-12 items-center gap-3 rounded-full border border-border-default bg-background-main px-4">
                <Search size={18} className="shrink-0 text-primary-base" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product or warehouse"
                  aria-label="Search products"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-primary-base"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-3 sm:px-6">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag
                    size={30}
                    className="mx-auto mb-3 text-primary-base"
                  />

                  <p className="text-base font-semibold text-text-primary">
                    No products found
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Try a different search or create a new product.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {filteredProducts.map((product) => {
                    const added = isAdded(product.name);
                    const outOfStock = product.stock <= 0;

                    return (
                      <div
                        key={product.id}
                        className="flex min-h-[76px] items-center gap-3 py-3"
                      >
                        <div
                          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                          style={{ backgroundColor: product.color }}
                        >
                          {product.emoji}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-text-primary sm:text-base">
                            {product.name}
                          </p>

                          <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                            {product.stock > 0
                              ? `${product.stock} at ${product.warehouse}`
                              : `None at ${product.warehouse}`}

                            {product.bulk && (
                              <span className="ml-2 inline-block rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-primary-base">
                                Bulk
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <p className="text-sm font-bold text-text-primary sm:text-base">
                            {formatNaira(product.price)}
                          </p>

                          {outOfStock ? (
                            <span className="text-xs font-medium text-text-secondary">
                              Out of stock
                            </span>
                          ) : added ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-success-base">
                              <Check size={13} strokeWidth={3} />
                              Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAdd(product)}
                              aria-label={`Add ${product.name}`}
                              className="flex size-9 items-center justify-center rounded-full bg-primary-active text-text-inverse transition hover:bg-primary-base"
                            >
                              <Plus size={19} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-border-subtle bg-background-main px-5 pb-5 pt-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-dashed border-primary-base text-sm font-semibold text-primary-base transition hover:bg-primary-subtle"
              >
                <Plus size={18} />
                Create a new product
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* --------------------------------------------------
   NEW INVOICE PAGE
-------------------------------------------------- */

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDevRoute = location.pathname.startsWith("/__dev");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [lines, setLines] = useState<InvoiceLine[]>([]);

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [customerExpanded, setCustomerExpanded] = useState(false);
  const [warehouseExpanded, setWarehouseExpanded] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_KEY);

      if (storedDraft) {
        const draft = JSON.parse(storedDraft) as InvoiceDraft;

        setCustomerName(draft.customerName ?? "");
        setCustomerPhone(draft.customerPhone ?? "");
        setLines(Array.isArray(draft.lines) ? draft.lines : []);
      }
    } catch (err) {
      console.error("Unable to restore invoice draft:", err);
    } finally {
      setRestored(true);
    }
  }, []);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty * line.price, 0),
    [lines],
  );

  const totalQuantity = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty, 0),
    [lines],
  );

  const today = new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Generate initials from the first two words of the customer name.
  const customerInitials = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const addProductToInvoice = (newLine: InvoiceLine) => {
    setLines((current) => {
      const existingIndex = current.findIndex(
        (line) =>
          line.name.trim().toLowerCase() === newLine.name.trim().toLowerCase(),
      );

      if (existingIndex >= 0) {
        return current.map((line, index) =>
          index === existingIndex
            ? { ...line, qty: line.qty + newLine.qty }
            : line,
        );
      }

      return [...current, newLine];
    });

    setError("");
    setSaved(false);
  };

  const increaseQuantity = (index: number) => {
    setLines((current) =>
      current.map((line, i) =>
        i === index ? { ...line, qty: line.qty + 1 } : line,
      ),
    );

    setSaved(false);
  };

  const decreaseQuantity = (index: number) => {
    setLines((current) =>
      current
        .map((line, i) => (i === index ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0),
    );

    setSaved(false);
  };

  const removeProduct = (index: number) => {
    setLines((current) => current.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updateDraft = () => {
    const draft: InvoiceDraft = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      lines,
      total,
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const validateInvoice = () => {
    if (!customerName.trim()) {
      setError("Please choose a customer before continuing.");
      return false;
    }

    if (lines.length === 0) {
      setError("Please add at least one product to your invoice.");
      return false;
    }

    return true;
  };

  const saveDraft = () => {
    if (!validateInvoice()) return false;

    try {
      updateDraft();
      setSaved(true);
      setError("");
      return true;
    } catch (err) {
      console.error("Unable to save invoice draft:", err);
      setError("Unable to save your invoice. Please try again.");
      return false;
    }
  };

  const reviewInvoice = () => {
    if (!saveDraft()) return;

    navigate(isDevRoute ? "/__dev/review-invoice" : "/invoices/new/review");
  };

  const goBack = () => {
    navigate(isDevRoute ? "/__dev/invoice-preview" : "/invoices");
  };

  if (!restored) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background-main">
        <p className="text-base font-medium text-text-primary">
          Loading invoice...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main pb-24 lg:pb-8">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-5">
        {/* Page heading */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="mb-2 text-sm font-medium text-primary-base transition hover:text-primary-hover"
            >
              ‹ Back to Invoices
            </button>

            <p className="text-xs font-medium text-text-secondary">Invoices</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              New Invoice
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-primary-subtle px-4 py-2 text-sm font-semibold text-primary-base sm:flex">
            <Receipt size={16} />
            New Invoice
          </div>
        </div>

        {/* Desktop form and live preview */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-6">
          {/* Left column */}
          <div className="min-w-0 space-y-3">
            {/* Customer and warehouse dropdown cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Customer card */}
              <section className="min-w-0 self-start overflow-hidden rounded-xl bg-primary-active p-2.5 text-text-inverse">
                <div className="relative min-w-0">
                  <div
                    className="
                      [&>button]:!min-h-[48px]
                      [&>button]:!w-full
                      [&>button]:!rounded-lg
                      [&>button]:!border-transparent
                      [&>button]:!bg-primary-active
                      [&>button]:!p-0
                      [&>button]:!pr-9
                      [&>button]:!text-left
                      [&>button>div:first-child]:!size-8
                      [&>button>div:first-child]:!shrink-0
                      [&>button>div:first-child]:!rounded-lg
                      [&>button>div:first-child]:!bg-secondary-base
                      [&>button>div:first-child]:!text-text-inverse
                      [&>button>div:nth-child(2)>p:first-child]:!hidden
                      [&>button>div:nth-child(2)>p:nth-child(2)]:!text-sm
                      [&>button>div:nth-child(2)>p:nth-child(2)]:!font-semibold
                      [&>button>div:nth-child(2)>p:nth-child(2)]:!text-text-inverse
                      [&>button>div:nth-child(2)>p:nth-child(3)]:!hidden
                      [&>button>span]:!text-text-inverse
                      [&>button>svg]:!hidden
                    "
                  >
                    <ChooseCustomerDialog
                      value={customerName}
                      onChange={(name) => {
                        setCustomerName(name);
                        setSaved(false);
                        setError("");
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomerExpanded((current) => !current)}
                    aria-label={
                      customerExpanded
                        ? "Hide customer details"
                        : "Show customer details"
                    }
                    aria-expanded={customerExpanded}
                    className="absolute right-1 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-text-inverse transition hover:bg-text-inverse/10"
                  >
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        customerExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {customerExpanded && (
                  <div className="mt-2 border-t border-text-inverse/15 pt-3">
                    {customerName && (
                      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-text-secondary-inverse">
                        <CheckCircle2 size={13} />
                        {customerName} selected
                      </div>
                    )}

                    <label
                      htmlFor="customer-phone"
                      className="mb-1.5 block text-xs font-medium text-text-secondary-inverse"
                    >
                      Customer phone number
                      <span className="ml-1 opacity-75">(optional)</span>
                    </label>

                    <Input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(event) => {
                        setCustomerPhone(event.target.value);
                        setSaved(false);
                      }}
                      placeholder="Enter phone number"
                      className="h-9 rounded-lg border-text-inverse/20 bg-text-inverse text-sm text-text-primary placeholder:text-text-tertiary focus-visible:ring-text-inverse/30"
                    />
                  </div>
                )}
              </section>

              {/* Warehouse card */}
              <section className="min-w-0 self-start overflow-hidden rounded-xl border border-border-default bg-background-main p-2.5">
                <button
                  type="button"
                  onClick={() => setWarehouseExpanded((current) => !current)}
                  aria-expanded={warehouseExpanded}
                  className="flex min-h-[48px] w-full items-center gap-2 rounded-lg text-left"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary-base">
                    <Warehouse size={16} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-text-secondary">
                      Take stock from
                    </span>

                    <span className="mt-0.5 block truncate text-sm font-semibold text-text-primary">
                      Maza Maza Warehouse
                    </span>
                  </span>

                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-text-secondary transition-transform ${
                      warehouseExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {warehouseExpanded && (
                  <div className="mt-2 border-t border-border-subtle px-1 pt-3">
                    <p className="text-xs font-semibold text-text-primary">
                      Warehouse details
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Stock for the products on this invoice will be deducted
                      from Maza Maza Warehouse.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Bulk importer notice */}
            <div className="flex min-h-9 items-center gap-2 rounded-lg bg-success-light px-3 py-2 text-success-base">
              <CheckCircle2 size={15} className="shrink-0" />

              <p className="text-xs font-medium">
                Bulk importer prices applied automatically
              </p>
            </div>

            {/* Items section */}
            <section className="overflow-hidden rounded-xl border border-border-default bg-background-main">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <h2 className="text-base font-semibold text-text-primary">
                    Items
                  </h2>

                  <p className="mt-1 text-xs text-text-secondary">
                    Add products to this invoice.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddItemModal(true)}
                  className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary-base px-3.5 text-xs font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  <Plus size={15} />
                  Add item
                </button>
              </div>

              {lines.length === 0 ? (
                <div className="border-t border-border-subtle px-5 py-10 text-center">
                  <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-primary-subtle text-primary-base">
                    <ShoppingBag size={22} />
                  </div>

                  <p className="text-base font-semibold text-text-primary">
                    No items added yet
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Select products from your inventory to add them here.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(true)}
                    className="mt-4 text-sm font-semibold text-primary-base"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop table headings */}
                  <div className="hidden grid-cols-[minmax(0,1.5fr)_110px_110px_110px_24px] items-center gap-3 border-y border-border-subtle px-4 py-2.5 text-xs font-medium text-text-secondary md:grid">
                    <span>Product</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Line total</span>
                    <span />
                  </div>

                  <div className="divide-y divide-border-subtle">
                    {lines.map((line, index) => {
                      const product = initialProducts.find(
                        (item) =>
                          item.name.trim().toLowerCase() ===
                          line.name.trim().toLowerCase(),
                      );

                      return (
                        <div
                          key={`${line.name}-${index}`}
                          className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.5fr)_110px_110px_110px_24px] md:items-center md:gap-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {product && (
                              <span
                                className="grid size-9 shrink-0 place-items-center rounded-lg text-lg"
                                style={{
                                  backgroundColor: product.color,
                                }}
                              >
                                {product.emoji}
                              </span>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {line.name}
                              </p>

                              <p className="mt-1 text-xs text-text-secondary md:hidden">
                                {formatNaira(line.price)} per unit
                              </p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center justify-between md:justify-center">
                            <span className="text-xs text-text-secondary md:hidden">
                              Quantity
                            </span>

                            <div className="flex h-8 items-center gap-1 rounded-lg border border-border-default px-1">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(index)}
                                aria-label={`Decrease ${line.name} quantity`}
                                className="grid size-6 place-items-center rounded-md text-text-secondary transition hover:bg-primary-subtle hover:text-primary-base"
                              >
                                <Minus size={13} />
                              </button>

                              <span className="min-w-5 text-center text-sm font-semibold text-text-primary">
                                {line.qty}
                              </span>

                              <button
                                type="button"
                                onClick={() => increaseQuantity(index)}
                                aria-label={`Increase ${line.name} quantity`}
                                className="grid size-6 place-items-center rounded-md bg-primary-base text-text-inverse transition hover:bg-primary-hover"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Unit price */}
                          <div className="hidden text-right md:block">
                            <p className="text-sm font-medium text-text-primary">
                              {formatNaira(line.price)}
                            </p>

                            {product?.bulk && (
                              <span className="mt-1 inline-block rounded-full bg-success-light px-2 py-0.5 text-[10px] font-medium text-success-base">
                                Bulk price
                              </span>
                            )}
                          </div>

                          {/* Line total */}
                          <div className="flex items-center justify-between md:justify-end">
                            <span className="text-xs text-text-secondary md:hidden">
                              Line total
                            </span>

                            <p className="text-sm font-semibold text-text-primary">
                              {formatNaira(line.qty * line.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            aria-label={`Remove ${line.name}`}
                            className="hidden size-7 items-center justify-center rounded-lg text-secondary-base transition hover:bg-secondary-base/10 md:flex"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            aria-label={`Remove ${line.name}`}
                            className="flex h-9 items-center justify-center gap-2 rounded-lg border border-border-subtle text-xs font-medium text-secondary-base md:hidden"
                          >
                            <Trash2 size={14} />
                            Remove item
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Subtotal */}
              {lines.length > 0 && (
                <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3.5">
                  <span className="text-sm font-medium text-text-secondary">
                    Subtotal
                  </span>

                  <span className="text-base font-bold text-text-primary">
                    {formatNaira(total)}
                  </span>
                </div>
              )}

              {/* Mobile invoice totals */}
              <div className="border-t border-border-subtle p-3 lg:hidden">
                <div className="space-y-3 rounded-lg border border-border-subtle bg-background-main p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-text-secondary">
                      Items ({totalQuantity}{" "}
                      {totalQuantity === 1 ? "bundle" : "bundles"})
                    </span>

                    <span className="text-sm font-semibold text-text-primary">
                      {formatNaira(total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-text-secondary">
                      Earlier balance
                    </span>

                    <span className="text-sm font-semibold text-text-primary">
                      ₦0.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
                    <span className="text-sm font-semibold text-text-primary">
                      Total due
                    </span>

                    <span className="text-base font-bold text-text-primary">
                      {formatNaira(total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Error and saved messages */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-secondary-base/30 bg-secondary-base/10 px-4 py-3 text-sm font-medium text-secondary-base"
              >
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 rounded-lg border border-success-base/20 bg-success-light px-4 py-3 text-sm font-medium text-success-base">
                <CheckCircle2 size={17} />
                Your invoice draft has been saved.
              </div>
            )}
          </div>

          {/* Desktop live invoice preview */}
          <aside className="hidden min-w-0 lg:sticky lg:top-5 lg:block">
            {/* Preview label */}
            <p className="mb-2 text-xs font-medium text-text-secondary">
              Live Preview
            </p>

            <div className="overflow-hidden rounded-xl border border-border-default bg-background-main">
              {/* Preview body */}
              <div className="space-y-4 p-3.5">
                {/* Customer identity */}
                <div className="flex min-w-0 items-center gap-3 border-b border-border-subtle pb-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary-base text-sm font-bold text-text-inverse">
                    {customerInitials || "CU"}
                  </span>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-text-primary">
                      {customerName || "Customer name"}
                    </p>

                    <p className="mt-1 break-all text-xs text-text-secondary">
                      {customerPhone || "Customer phone number"}
                    </p>
                  </div>
                </div>

                {/* Invoice number and date */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-primary">
                    <span className="text-text-secondary">Invoice </span>
                    <span className="font-semibold">INV-DRAFT</span>
                  </p>

                  <p className="shrink-0 text-xs text-text-secondary">
                    {today}
                  </p>
                </div>

                {/* Bill to customer */}
                <p className="break-words text-sm text-text-secondary">
                  Bill to{" "}
                  <span className="font-semibold text-text-primary">
                    {customerName || "Customer name"}
                  </span>
                </p>

                {/* Invoice items */}
                {lines.length === 0 ? (
                  <p className="py-4 text-center text-sm text-text-secondary">
                    Added items will appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lines.map((line, index) => (
                      <div
                        key={`${line.name}-preview-${index}`}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-text-primary">
                            {line.name}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            {line.qty} × {formatNaira(line.price)}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-text-primary">
                          {formatNaira(line.qty * line.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-text-primary/5 px-3 py-2.5">
                  <span className="text-sm font-medium text-text-secondary">
                    Total
                  </span>

                  <span className="break-words text-sm font-bold text-text-primary">
                    {formatNaira(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop actions below preview */}
            <div className="mt-3 flex flex-col gap-2.5">
              <Button
                type="button"
                onClick={reviewInvoice}
                className="h-11 w-full rounded-full bg-primary-base text-sm font-semibold text-text-inverse hover:bg-primary-hover"
              >
                Review invoice
              </Button>

              <Button
                type="button"
                onClick={saveDraft}
                variant="outline"
                className="h-11 w-full rounded-full border-primary-base bg-background-main text-sm font-semibold text-primary-base hover:bg-primary-subtle"
              >
                Save draft
              </Button>
            </div>
          </aside>
        </div>

        {/* Mobile actions only */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-subtle bg-background-main p-3.5 lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2">
            <Button
              type="button"
              onClick={reviewInvoice}
              className="h-11 w-full rounded-full bg-primary-base text-sm font-semibold text-text-inverse hover:bg-primary-hover"
            >
              Review invoice
            </Button>

            <Button
              type="button"
              onClick={saveDraft}
              variant="outline"
              className="h-11 w-full rounded-full border-primary-base bg-background-main text-sm font-semibold text-primary-base hover:bg-primary-subtle"
            >
              Save draft
            </Button>
          </div>
        </div>
      </div>

      {/* Add item modal */}
      {showAddItemModal && (
        <AddItemModal
          lines={lines}
          onAdd={addProductToInvoice}
          onClose={() => setShowAddItemModal(false)}
        />
      )}
    </div>
  );
}
