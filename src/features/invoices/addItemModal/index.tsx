import { useMemo, useState } from "react";
import { Check, Plus, Search, ShoppingBag, X } from "lucide-react";

interface InvoiceLine {
  name: string;
  qty: number;
  price: number;
}

interface SampleProduct {
  id: string;
  name: string;
  stock: number;
  warehouse: string;
  price: number;
  bulk: boolean;
  emoji: string;
  imageColor: string;
}

interface AddItemModalProps {
  lines: InvoiceLine[];
  onAdd: (line: InvoiceLine) => void;
  onClose: () => void;
}

const initialProducts: SampleProduct[] = [
  {
    id: "P001",
    name: "Super Wax Ankara",
    stock: 85,
    warehouse: "Maza Maza Warehouse",
    price: 6000,
    bulk: true,
    emoji: "🧵",
    imageColor: "#F2E5D8",
  },
  {
    id: "P002",
    name: "Hollandais Wax Print",
    stock: 40,
    warehouse: "Maza Maza Warehouse",
    price: 10000,
    bulk: true,
    emoji: "🪡",
    imageColor: "#F5E5E7",
  },
  {
    id: "P003",
    name: "Swiss Voile Lace",
    stock: 64,
    warehouse: "Maza Maza Warehouse",
    price: 6500,
    bulk: false,
    emoji: "🧶",
    imageColor: "#E5EDF3",
  },
  {
    id: "P004",
    name: "George Wrapper",
    stock: 0,
    warehouse: "Maza Maza Warehouse",
    price: 25000,
    bulk: false,
    emoji: "👘",
    imageColor: "#EAE9DB",
  },
  {
    id: "P005",
    name: "Aso-oke Bundle",
    stock: 12,
    warehouse: "Maza Maza Warehouse",
    price: 38000,
    bulk: false,
    emoji: "🧣",
    imageColor: "#E8E5F2",
  },
];

const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

export default function AddItemModal({
  lines,
  onAdd,
  onClose,
}: AddItemModalProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("1");

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

  const isAdded = (productName: string) =>
    lines.some(
      (line) =>
        line.name.trim().toLowerCase() === productName.trim().toLowerCase(),
    );

  const addProduct = (product: SampleProduct) => {
    if (product.stock <= 0 || isAdded(product.name)) return;

    onAdd({
      name: product.name,
      qty: 1,
      price: product.price,
    });
  };

  const createProduct = () => {
    const name = newProductName.trim();
    const price = Number(newProductPrice);
    const stock = Number(newProductStock);

    if (!name) {
      setError("Enter a product name.");
      return;
    }

    if (!newProductPrice || !Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }

    const existing = products.find(
      (product) => product.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (existing) {
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
      imageColor: "#E8F1E9",
    };

    setProducts((current) => [...current, product]);

    if (stock > 0) {
      onAdd({
        name: product.name,
        qty: 1,
        price: product.price,
      });
    }

    setNewProductName("");
    setNewProductPrice("");
    setNewProductStock("1");
    setError("");
    setShowCreateForm(false);
  };

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
        className="flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[24px] border border-border-subtle bg-background-main shadow-2xl sm:max-h-[85vh] sm:rounded-[22px]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-5 pt-6 sm:px-6 sm:pt-6">
          <div>
            <h2
              id="add-item-title"
              className="text-2xl font-bold text-text-primary sm:text-[26px]"
            >
              {showCreateForm ? "Create new product" : "Add item"}
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Prices shown from Bulk importer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add item dialog"
            className="flex size-10 items-center justify-center rounded-full border border-primary-light bg-background-main text-primary-base transition hover:bg-primary-subtle"
          >
            <X size={21} />
          </button>
        </div>

        {showCreateForm ? (
          <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
            <div className="space-y-5 pt-3">
              <div>
                <label className="mb-2 block text-base font-semibold text-text-primary">
                  Product name
                </label>

                <input
                  value={newProductName}
                  onChange={(event) => {
                    setNewProductName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter product name"
                  className="h-13 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-text-primary">
                  Selling price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={newProductPrice}
                  onChange={(event) => {
                    setNewProductPrice(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter selling price"
                  className="h-13 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-text-primary">
                  Available stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={newProductStock}
                  onChange={(event) => {
                    setNewProductStock(event.target.value);
                    setError("");
                  }}
                  className="h-13 w-full rounded-xl border border-border-default bg-background-main px-4 text-base text-text-primary outline-none transition focus:border-primary-base"
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
                  className="h-13 flex-1 rounded-full border border-primary-base bg-background-main text-base font-semibold text-primary-base transition hover:bg-primary-subtle"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createProduct}
                  className="h-13 flex-1 rounded-full bg-primary-base text-base font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  Create product
                </button>
              </div>

              <p className="text-center text-sm leading-6 text-text-secondary">
                Temporary product data. Backend integration will be added later.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="shrink-0 px-5 pb-4 sm:px-6">
              <div className="flex h-13 items-center gap-3 rounded-full border border-border-default bg-background-main px-4">
                <Search size={20} className="flex-none text-primary-base" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or phone"
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-tertiary"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-primary-base transition hover:text-primary-active"
                  >
                    <X size={19} />
                  </button>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 sm:px-6">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag
                    size={34}
                    className="mx-auto mb-3 text-primary-base"
                  />

                  <p className="text-lg font-semibold text-text-primary">
                    No products found
                  </p>

                  <p className="mt-2 text-base leading-6 text-text-secondary">
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
                        className="flex min-h-[88px] items-center gap-3 py-4"
                      >
                        {/* Product thumbnail */}
                        <div
                          className="flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl text-[27px]"
                          style={{
                            backgroundColor: product.imageColor,
                          }}
                        >
                          {product.emoji}
                        </div>

                        {/* Product information */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold leading-6 text-text-primary sm:text-[17px]">
                            {product.name}
                          </p>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-[13px] leading-5 text-text-secondary">
                              {product.stock > 0
                                ? `${product.stock} at ${product.warehouse}`
                                : `None at ${product.warehouse}`}
                            </p>

                            {product.bulk && (
                              <span className="inline-block rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary-base">
                                Bulk
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and action */}
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <p className="text-base font-bold leading-6 text-text-primary sm:text-[17px]">
                            {formatPrice(product.price)}
                          </p>

                          {outOfStock ? (
                            <span className="text-sm font-medium text-text-secondary">
                              Out of stock
                            </span>
                          ) : added ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-success-base">
                              <Check size={14} strokeWidth={3} />
                              Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addProduct(product)}
                              aria-label={`Add ${product.name}`}
                              className="flex size-10 items-center justify-center rounded-full bg-primary-base text-text-inverse transition hover:bg-primary-hover"
                            >
                              <Plus size={21} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border-subtle bg-background-main px-5 pb-5 pt-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                }}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full border border-dashed border-primary-base text-base font-semibold text-primary-base transition hover:bg-primary-subtle"
              >
                <Plus size={20} />
                Create a new product
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
