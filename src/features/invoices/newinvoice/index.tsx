import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
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

// --------------------------------------------------
// ADD ITEM MODAL
// --------------------------------------------------

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
    if (product.stock <= 0) return;

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
      setError("Please enter a product name.");
      return;
    }

    if (!newPrice || !Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (
      products.some(
        (product) => product.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setError("This product already exists.");
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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-text-primary/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[24px] bg-background-main shadow-2xl sm:max-h-[85vh] sm:rounded-[22px]"
      >
        {/* Modal header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
          <div>
            <h2
              id="add-item-title"
              className="text-base font-bold text-text-primary"
            >
              {showCreateForm ? "Create new product" : "Add item"}
            </h2>

            <p className="mt-1 text-[11px] text-text-tertiary">
              Prices shown from Bulk importer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background-main text-icon-grey transition hover:bg-primary-subtle"
          >
            <X size={16} />
          </button>
        </div>

        {showCreateForm ? (
          /* Create product form */
          <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
            <div className="space-y-4 pt-3">
              <div>
                <label className="mb-2 block text-xs font-semibold text-text-primary">
                  Product name
                </label>

                <input
                  value={newName}
                  onChange={(event) => {
                    setNewName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter product name"
                  className="h-11 w-full rounded-xl border border-border-default bg-background-main px-3 text-sm text-text-primary outline-none focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-text-primary">
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
                  className="h-11 w-full rounded-xl border border-border-default bg-background-main px-3 text-sm text-text-primary outline-none focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-text-primary">
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
                  className="h-11 w-full rounded-xl border border-border-default bg-background-main px-3 text-sm text-text-primary outline-none focus:border-primary-base"
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-secondary-base">
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
                  className="h-11 flex-1 rounded-full border border-border-default bg-background-main text-sm font-semibold text-text-secondary transition hover:bg-primary-subtle"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createProduct}
                  className="h-11 flex-1 rounded-full bg-primary-base text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  Create product
                </button>
              </div>

              <p className="text-center text-[10px] text-text-tertiary">
                Temporary sample product. Backend integration will be added
                later.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search field */}
            <div className="shrink-0 px-5 pb-3 sm:px-6">
              <div className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-background-main px-3">
                <Search size={15} className="shrink-0 text-text-tertiary" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product or warehouse"
                  aria-label="Search products"
                  className="h-full min-w-0 flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-tertiary"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-text-tertiary"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Product list */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 sm:px-6">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag
                    size={26}
                    className="mx-auto mb-3 text-text-tertiary"
                  />

                  <p className="text-sm font-semibold text-text-primary">
                    No products found
                  </p>

                  <p className="mt-1 text-xs text-text-tertiary">
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
                        className="flex min-h-[65px] items-center gap-3 py-2.5"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                          style={{ backgroundColor: product.color }}
                        >
                          {product.emoji}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-text-primary">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] text-text-tertiary">
                            {product.stock > 0
                              ? `${product.stock} at ${product.warehouse}`
                              : `None at ${product.warehouse}`}

                            {product.bulk && (
                              <span className="ml-1.5 rounded-full bg-primary-subtle px-1.5 py-0.5 text-[9px] font-semibold text-primary-base">
                                Bulk
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <p className="text-[11px] font-bold text-text-primary">
                            {formatNaira(product.price)}
                          </p>

                          {outOfStock ? (
                            <span className="text-[10px] font-medium text-text-tertiary">
                              Out of stock
                            </span>
                          ) : added ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-[9px] font-semibold text-success-base">
                              <Check size={10} strokeWidth={3} />
                              Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAdd(product)}
                              aria-label={`Add ${product.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-active text-text-inverse transition hover:bg-primary-base"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="shrink-0 border-t border-border-subtle bg-background-main px-5 pb-5 pt-3 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-dashed border-primary-light text-xs font-semibold text-primary-base transition hover:bg-primary-subtle"
              >
                <Plus size={15} />
                Create a new product
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// --------------------------------------------------
// NEW INVOICE PAGE
// --------------------------------------------------

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDevRoute = location.pathname.startsWith("/__dev");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [lines, setLines] = useState<InvoiceLine[]>([]);

  const [showAddItemModal, setShowAddItemModal] = useState(false);

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
    month: "long",
    year: "numeric",
  });

  const inputClass =
    "h-12 rounded-xl border-border-default bg-background-main text-text-primary placeholder:text-text-tertiary focus-visible:ring-primary-base";

  // Add selected product.
  // If it already exists, increase its quantity.
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
        <div className="text-sm font-medium text-text-primary">
          Loading invoice...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main pb-28 lg:pb-10">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="mb-3 text-sm font-medium text-primary-base transition hover:text-primary-hover"
            >
              ← Back to invoices
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Create new invoice
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Add your customer and products to create an invoice.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-primary-subtle px-4 py-2 text-sm font-semibold text-primary-base">
            <Receipt size={17} />
            New invoice
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Customer */}
            <section className="overflow-hidden rounded-2xl border border-border-default bg-background-main">
              <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary-base">
                  <UserRound size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-text-primary">
                    Customer details
                  </h2>

                  <p className="mt-1 text-xs text-text-secondary">
                    Choose an existing customer or add a new one.
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Customer
                  </label>

                  <ChooseCustomerDialog
                    value={customerName}
                    onChange={(name) => {
                      setCustomerName(name);
                      setSaved(false);
                      setError("");
                    }}
                  />

                  {customerName && (
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-success-base">
                      <CheckCircle2 size={14} />
                      {customerName} selected
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Customer phone number
                    <span className="ml-1 font-normal text-text-tertiary">
                      (optional)
                    </span>
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
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Products and items */}
            <section className="overflow-hidden rounded-2xl border border-border-default bg-background-main">
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary-base">
                    <ShoppingBag size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-text-primary">Items</h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Add products to this invoice.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddItemModal(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-base px-4 text-xs font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  <Plus size={15} />
                  Add item
                </button>
              </div>

              {lines.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary-base">
                    <ShoppingBag size={25} />
                  </div>

                  <p className="text-sm font-semibold text-text-primary">
                    No items added yet
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    Select products from your inventory to add them here.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(true)}
                    className="mt-4 text-xs font-semibold text-primary-base"
                  >
                    + Browse products
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {lines.map((line, index) => (
                    <div
                      key={`${line.name}-${index}`}
                      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-text-primary">
                          {line.name}
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                          {formatNaira(line.price)} per unit
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center gap-3 rounded-xl border border-border-default p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(index)}
                            aria-label={`Decrease ${line.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-primary hover:bg-primary-subtle"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-5 text-center text-sm font-semibold text-text-primary">
                            {line.qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(index)}
                            aria-label={`Increase ${line.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-primary hover:bg-primary-subtle"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <div className="min-w-[100px] text-right">
                          <p className="font-bold text-text-primary">
                            {formatNaira(line.qty * line.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          aria-label={`Remove ${line.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-base hover:bg-secondary-base/10"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lines.length > 0 && (
                <div className="border-t border-border-subtle bg-background-main px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-secondary">
                      Subtotal
                    </span>

                    <span className="text-lg font-bold text-text-primary">
                      {formatNaira(total)}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Error and saved messages */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-secondary-base/30 bg-secondary-base/10 px-4 py-3 text-sm font-medium text-secondary-base"
              >
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 rounded-xl border border-success-base/20 bg-success-light px-4 py-3 text-sm font-medium text-success-base">
                <CheckCircle2 size={17} />
                Your invoice draft has been saved.
              </div>
            )}

            {/* Desktop buttons */}
            <div className="hidden items-center gap-3 lg:flex">
              <Button
                type="button"
                onClick={saveDraft}
                variant="outline"
                className="h-12 rounded-xl border-primary-base px-6 font-semibold text-primary-base hover:bg-primary-subtle"
              >
                Save draft
              </Button>

              <Button
                type="button"
                onClick={reviewInvoice}
                className="h-12 flex-1 rounded-xl bg-primary-base font-semibold text-text-inverse hover:bg-primary-hover"
              >
                Review invoice →
              </Button>
            </div>
          </div>

          {/* Right column: live preview */}
          <aside className="xl:sticky xl:top-6">
            <div className="overflow-hidden rounded-2xl border border-border-default bg-background-main shadow-sm">
              <div className="bg-primary-active px-6 py-6 text-text-inverse">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-secondary-inverse">
                      Invoice preview
                    </p>

                    <h2 className="mt-2 text-xl font-bold">OjaHub</h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-text-inverse/10">
                    <Receipt size={23} />
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-text-inverse/15 pt-4">
                  <span className="text-sm text-text-secondary-inverse">
                    Date created
                  </span>

                  <span className="text-sm font-semibold">{today}</span>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Bill to
                  </p>

                  <p className="break-words font-bold text-text-primary">
                    {customerName || "Customer name"}
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    {customerPhone || "Customer phone number"}
                  </p>
                </div>

                <div className="border-t border-dashed border-border-default pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                      Description
                    </p>

                    <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                      Amount
                    </p>
                  </div>

                  {lines.length === 0 ? (
                    <p className="py-5 text-center text-sm text-text-tertiary">
                      Added items will appear here.
                    </p>
                  ) : (
                    <div className="space-y-4">
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
                </div>

                <div className="border-t border-dashed border-border-default pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-secondary">
                      Total items
                    </span>

                    <span className="font-semibold text-text-primary">
                      {lines.length}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-text-secondary">
                      Total quantity
                    </span>

                    <span className="font-semibold text-text-primary">
                      {totalQuantity}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-primary-subtle p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Total amount
                  </p>

                  <p className="mt-2 break-words text-2xl font-bold text-text-primary">
                    {formatNaira(total)}
                  </p>

                  <div className="mt-4 h-1 w-14 rounded-full bg-secondary-base" />
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <CheckCircle2 size={15} className="text-success-base" />
                  Preview updates automatically as you add items.
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile actions */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-default bg-background-main p-4 shadow-sm lg:hidden">
          <div className="mx-auto flex max-w-[1440px] gap-3">
            <Button
              type="button"
              onClick={saveDraft}
              variant="outline"
              className="h-12 flex-1 rounded-xl border-primary-base font-semibold text-primary-base"
            >
              Save draft
            </Button>

            <Button
              type="button"
              onClick={reviewInvoice}
              className="h-12 flex-1 rounded-xl bg-primary-base font-semibold text-text-inverse hover:bg-primary-hover"
            >
              Review invoice →
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
