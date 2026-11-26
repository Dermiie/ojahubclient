import { useEffect, useMemo, useState } from "react";

import { Banknote, Building2, Check, CreditCard, X } from "lucide-react";

import {
  formatNaira,
  getInvoiceBalance,
  getInvoiceTotal,
  recordInvoicePayment,
  type Invoice,
  type Customer,
  type PaymentMode,
  type PaymentMethod,
} from "@/lib/invoices";

interface RecordPaymentModalProps {
  invoice: Invoice;
  customer: Customer;
  onClose: () => void;
  onSaved: (invoice: Invoice, customer: Customer) => void;
}

const modes: { label: string; value: PaymentMode }[] = [
  { label: "Paid in full", value: "full" },
  { label: "Part payment", value: "partial" },
  { label: "Book me down", value: "book-down" },
];

const methods: {
  label: PaymentMethod;
  icon: typeof Banknote;
}[] = [
  { label: "Cash", icon: Banknote },
  { label: "Transfer to my account", icon: Building2 },
  { label: "POS", icon: CreditCard },
];

export default function RecordPaymentModal({
  invoice,
  customer,
  onClose,
  onSaved,
}: RecordPaymentModalProps) {
  const outstanding = getInvoiceBalance(invoice);
  const total = getInvoiceTotal(invoice);

  const [mode, setMode] = useState<PaymentMode>("partial");
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const customerFirstName = customer.name.split(" ")[0];

  const numericAmount = useMemo(() => {
    const parsed = Number(amount.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const amountToRecord =
    mode === "full" || mode === "book-down" ? outstanding : numericAmount;

  const paidNow = mode === "book-down" ? 0 : amountToRecord;

  const remainingBalance = Math.max(0, outstanding - paidNow);

  const newCustomerBalance =
    (customer.balance ?? 0) + (mode === "book-down" ? amountToRecord : 0);

  const amountLabel =
    mode === "book-down" ? "Amount to book down" : "Amount received";

  const saveLabel = mode === "partial" ? "Save part payment" : "Save payment";

  useEffect(() => {
    if (mode === "full" || mode === "book-down") {
      setAmount(String(outstanding));
    } else {
      setAmount("");
    }

    setError("");
  }, [mode, outstanding]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, saving]);

  // Lock the page scroll behind the modal so only the modal can scroll.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSave = async () => {
    if (saving) return;

    setError("");

    if (amountToRecord <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (amountToRecord > outstanding) {
      setError("Amount cannot exceed the outstanding balance.");
      return;
    }

    if (
      mode === "partial" &&
      (!Number.isInteger(amountToRecord) || !Number.isFinite(amountToRecord))
    ) {
      setError("Enter a valid whole-number amount.");
      return;
    }

    setSaving(true);

    try {
      const result = await recordInvoicePayment(invoice.no, {
        mode,
        amount: amountToRecord,
        method: mode === "book-down" ? undefined : method,
      });

      onSaved(result.invoice, result.customer);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save payment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-text-primary/55 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-payment-title"
        className="relative max-h-[94dvh] w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-t-[22px] bg-background-main px-5 pb-5 pt-6 shadow-2xl sm:max-h-[90vh] sm:max-w-[420px] sm:rounded-[18px] sm:px-5 sm:py-5"
      >
        {/* Mobile handle */}
        <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border-default sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="record-payment-title"
              className="text-lg font-bold text-text-primary"
            >
              Record Payment
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              {invoice.no} · {customer.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close payment modal"
            className="grid size-7 flex-none place-items-center rounded-full bg-background-muted text-text-primary transition hover:bg-border-default disabled:opacity-50 sm:bg-text-primary sm:text-text-inverse sm:hover:bg-text-primary/80"
          >
            <X size={14} />
          </button>
        </div>

        {/* Payment mode */}
        <div className="mt-4 grid grid-cols-3 rounded-full bg-primary-subtle p-1">
          {modes.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={saving}
              onClick={() => setMode(item.value)}
              aria-pressed={mode === item.value}
              className={`min-h-9 rounded-full px-2 text-xs font-semibold transition ${
                mode === item.value
                  ? "bg-primary-base text-text-inverse shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Payment method */}
        <div className="mt-4">
          <p className="mb-2.5 text-sm font-medium text-text-primary">
            {mode === "book-down" ? "Credit arrangement" : "How did they pay?"}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {methods.map((item) => {
              const Icon = item.icon;
              const selected = method === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={mode === "book-down" || saving}
                  onClick={() => setMethod(item.label)}
                  aria-pressed={selected}
                  className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 transition ${
                    mode === "book-down"
                      ? "cursor-not-allowed border-border-subtle bg-background-main text-text-disabled"
                      : selected
                        ? "border-primary-base bg-primary-subtle text-primary-base"
                        : "border-border-default bg-background-main text-text-primary hover:border-primary-base hover:bg-primary-subtle"
                  }`}
                >
                  <Icon size={18} />

                  <span className="text-center text-xs font-medium leading-4">
                    {item.label === "Transfer to my account" ? (
                      <>
                        Transfer to my
                        <br />
                        account
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4">
          <label
            htmlFor="payment-amount"
            className="mb-2 block text-xs font-medium text-text-secondary"
          >
            {amountLabel}
          </label>

          <div className="flex h-11 items-center rounded-lg border border-primary-base bg-primary-subtle px-3">
            <span className="mr-2 text-base font-bold text-primary-base">
              ₦
            </span>

            <input
              id="payment-amount"
              type="number"
              inputMode="numeric"
              min="1"
              max={outstanding}
              step="1"
              value={amount}
              disabled={mode === "full" || mode === "book-down" || saving}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
              placeholder="Enter amount"
              className="h-full w-full bg-transparent text-sm font-semibold text-text-primary outline-none placeholder:font-normal placeholder:text-text-tertiary disabled:opacity-70"
            />
          </div>
        </div>

        {/* Payment summary */}
        <div className="mt-3 space-y-2.5 rounded-lg bg-secondary-base/15 p-3.5">
          <div className="flex justify-between gap-3 text-xs text-secondary-base">
            <span>Invoice total</span>
            <span className="font-medium text-text-primary">
              {formatNaira(total)}
            </span>
          </div>

          <div className="flex justify-between gap-3 text-xs text-secondary-base">
            <span>Paid now</span>
            <span className="font-medium text-text-primary">
              {paidNow > 0 ? "-" : ""}
              {formatNaira(paidNow)}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-secondary-base/50 pt-2.5 text-xs font-bold text-text-primary">
            <span>
              {mode === "book-down"
                ? `Added to ${customerFirstName}'s balance`
                : "Remaining invoice balance"}
            </span>

            <span>
              {formatNaira(
                mode === "book-down" ? newCustomerBalance : remainingBalance,
              )}
            </span>
          </div>
        </div>

        {/* OjaHub notice */}
        <div className="mt-3 flex gap-2 rounded-lg bg-success-light p-3">
          <Check size={13} className="mt-0.5 flex-none text-success-base" />

          <p className="text-xs leading-relaxed text-text-secondary">
            {mode === "book-down" ? (
              "This amount will be added to the customer's balance. No payment will be recorded as received."
            ) : (
              <>
                <span className="font-semibold text-text-primary">
                  Paid through the OjaHub link?
                </span>{" "}
                You don't need to record it. Transfer and card payments are
                marked paid automatically.
              </>
            )}
          </p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-text-tertiary">
          {mode === "book-down"
            ? "The customer can pay the outstanding balance later."
            : `${customerFirstName} can still pay the rest by transfer with the same link`}
        </p>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-11 rounded-full border border-border-default bg-background-main px-7 text-sm font-semibold text-text-primary transition hover:bg-primary-subtle disabled:opacity-50 sm:min-w-[104px]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving || outstanding <= 0}
            onClick={handleSave}
            className="h-11 rounded-full bg-primary-base px-7 text-sm font-semibold text-text-inverse transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[140px]"
          >
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </section>
    </div>
  );
}