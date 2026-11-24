import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { fetchCustomers, saveCustomer, type Customer } from "@/lib/invoices";

interface ChooseCustomerDialogProps {
  value: string;
  onChange: (customerName: string) => void;
}

export default function ChooseCustomerDialog({
  value,
  onChange,
}: ChooseCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchCustomers();
      setCustomers(result);
    } catch (err) {
      console.error("Unable to load customers:", err);
      setError("Unable to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadCustomers();
    }
  }, [open]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(term),
    );
  }, [customers, search]);

  const selectedCustomer = customers.find(
    (customer) =>
      customer.name.trim().toLowerCase() === value.trim().toLowerCase(),
  );

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const selectCustomer = (customer: Customer) => {
    onChange(customer.name);
    setOpen(false);
    setSearch("");
    setShowNewCustomer(false);
    setNewCustomerName("");
    setError("");
  };

  const createCustomer = async () => {
    const name = newCustomerName.trim();

    if (!name) {
      setError("Enter the customer's name.");
      return;
    }

    const existing = customers.find(
      (customer) => customer.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (existing) {
      selectCustomer(existing);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const customer: Customer = {
        id: `C-${Date.now()}`,
        name,
      };

      await saveCustomer(customer);

      setCustomers((current) => [...current, customer]);
      selectCustomer(customer);
    } catch (err) {
      console.error("Unable to save customer:", err);
      setError("Unable to save this customer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Selected customer field */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-border-default bg-background-main p-3 text-left transition hover:border-primary-base hover:bg-primary-subtle"
      >
        <div className="grid size-11 flex-none place-items-center rounded-xl bg-primary-subtle text-sm font-bold text-primary-base">
          {selectedCustomer ? (
            getInitials(selectedCustomer.name)
          ) : (
            <UserRound size={20} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-secondary">Customer</p>

          <p className="mt-1 truncate text-sm font-semibold text-text-primary sm:text-base">
            {value || "Choose a customer"}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            {selectedCustomer
              ? "Selected customer"
              : "Select from your saved customers"}
          </p>
        </div>

        <span className="flex-none text-sm font-semibold text-primary-base">
          {value ? "Change" : "Choose"}
        </span>

        <ChevronRight size={18} className="flex-none text-icon-grey" />
      </button>

      {/* Customer selection dialog */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-text-primary/40 sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="choose-customer-title"
            className="flex max-h-[88dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[24px] bg-background-main shadow-2xl sm:max-h-[min(680px,90dvh)] sm:rounded-[24px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="choose-customer-title"
                  className="text-xl font-bold text-text-primary"
                >
                  {showNewCustomer ? "New customer" : "Choose customer"}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {showNewCustomer
                    ? "Add a customer to your saved customer list."
                    : "Select a customer for this invoice."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowNewCustomer(false);
                  setError("");
                }}
                aria-label="Close customer selection"
                className="grid size-10 place-items-center rounded-full border border-border-default bg-background-main text-icon-grey transition hover:bg-primary-subtle"
              >
                <X size={19} />
              </button>
            </div>

            {showNewCustomer ? (
              /* New customer form */
              <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
                <div>
                  <label
                    htmlFor="new-customer-name"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Customer name
                  </label>

                  <input
                    id="new-customer-name"
                    autoFocus
                    value={newCustomerName}
                    onChange={(event) => {
                      setNewCustomerName(event.target.value);
                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        createCustomer();
                      }
                    }}
                    placeholder="Enter customer or business name"
                    className="h-12 w-full rounded-xl border border-border-default bg-background-main px-3 text-base text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCustomer(false);
                      setNewCustomerName("");
                      setError("");
                    }}
                    className="h-12 flex-1 rounded-full border border-border-default bg-background-main text-sm font-semibold text-text-primary transition hover:bg-primary-subtle"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={createCustomer}
                    disabled={saving}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-base text-sm font-semibold text-text-inverse transition hover:bg-primary-hover disabled:opacity-60"
                  >
                    {saving && (
                      <LoaderCircle size={18} className="animate-spin" />
                    )}
                    {saving ? "Saving..." : "Save customer"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="px-5 pt-5 sm:px-6">
                  <div className="relative">
                    <Search
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name"
                      className="h-12 w-full rounded-xl border border-border-default bg-background-main pl-11 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base"
                    />
                  </div>
                </div>

                {/* New customer action */}
                <div className="px-5 pt-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCustomer(true);
                      setSearch("");
                      setError("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-primary-light bg-primary-subtle px-3 py-4 text-left transition hover:bg-primary-light/50"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-background-main text-primary-base">
                      <Plus size={20} />
                    </span>

                    <span className="flex-1 text-sm font-semibold text-primary-hover">
                      New customer
                    </span>

                    <ChevronRight size={18} className="text-primary-base" />
                  </button>
                </div>

                {/* Customer list */}
                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-4 sm:px-4">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Saved customers
                    </p>

                    <span className="text-xs text-text-secondary">
                      {filteredCustomers.length} customers
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex min-h-32 items-center justify-center gap-3 text-sm text-text-secondary">
                      <LoaderCircle
                        size={20}
                        className="animate-spin text-primary-base"
                      />
                      Loading customers...
                    </div>
                  ) : error ? (
                    <div className="p-5 text-center">
                      <p className="text-sm text-red-600">{error}</p>

                      <button
                        type="button"
                        onClick={loadCustomers}
                        className="mt-3 text-sm font-semibold text-primary-base"
                      >
                        Try again
                      </button>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-subtle">
                        <UserRound size={21} className="text-primary-base" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-text-primary">
                        No customers found
                      </p>

                      <p className="mt-1 text-sm text-text-secondary">
                        {search
                          ? "Try another search."
                          : "Add your first customer to continue."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => {
                        const isSelected =
                          customer.name.trim().toLowerCase() ===
                          value.trim().toLowerCase();

                        return (
                          <button
                            type="button"
                            key={customer.id}
                            onClick={() => selectCustomer(customer)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                              isSelected
                                ? "border border-primary-light bg-primary-subtle"
                                : "border border-transparent bg-background-main hover:border-primary-light hover:bg-primary-subtle"
                            }`}
                          >
                            <span
                              className={`grid size-11 flex-none place-items-center rounded-xl text-sm font-bold ${
                                isSelected
                                  ? "bg-primary-light text-primary-base"
                                  : "bg-secondary-base/15 text-secondary-base"
                              }`}
                            >
                              {getInitials(customer.name)}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-text-primary sm:text-base">
                                {customer.name}
                              </span>

                              <span className="mt-1 block text-xs text-text-secondary">
                                Saved customer
                              </span>
                            </span>

                            {isSelected ? (
                              <CheckCircle2
                                size={21}
                                className="flex-none text-primary-base"
                              />
                            ) : (
                              <ChevronRight
                                size={18}
                                className="flex-none text-text-tertiary"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
