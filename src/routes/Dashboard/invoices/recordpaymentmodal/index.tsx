import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  X,
} from "lucide-react";

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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#10251B]/35 sm:items-center sm:p-5"
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
        className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-[22px] bg-white px-4 pb-5 pt-5 shadow-2xl sm:max-h-[90vh] sm:max-w-[448px] sm:rounded-[18px] sm:px-6 sm:py-5"
      >
        {/* Mobile handle */}
        <div className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-[#DDE4DF] sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="record-payment-title"
              className="text-[15px] font-bold text-[#26382D]"
            >
              Record Payment
            </h2>

            <p className="mt-1 text-[9px] text-[#879188]">
              {invoice.no} · {customer.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close payment modal"
            className="grid size-7 flex-none place-items-center rounded-full bg-[#EDF3EF] text-[#405448] transition hover:bg-[#E1EBE4] disabled:opacity-50"
          >
            <X size={13} />
          </button>
        </div>

        {/* Payment mode */}
        <div className="mt-4 grid grid-cols-3 rounded-full bg-[#EAF3ED] p-0.5">
          {modes.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={saving}
              onClick={() => setMode(item.value)}
              aria-pressed={mode === item.value}
              className={`min-h-8 rounded-full px-1 text-[9px] font-semibold transition ${
                mode === item.value
                  ? "bg-[#218B57] text-white shadow-sm"
                  : "text-[#718078] hover:text-[#26382D]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Payment method */}
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold text-[#26382D]">
            {mode === "book-down" ? "Credit arrangement" : "How did they pay?"}
          </p>

          <div className="grid grid-cols-3 gap-1.5">
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
                  className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 transition ${
                    mode === "book-down"
                      ? "cursor-not-allowed border-[#E8EDE9] bg-[#FAFBFA] text-[#B1BBB4]"
                      : selected
                        ? "border-[#82B69A] bg-[#EFF7F1] text-[#218B57]"
                        : "border-[#E3E9E4] bg-white text-[#4E5D53] hover:border-[#A6C8B2]"
                  }`}
                >
                  <Icon size={14} />

                  <span className="text-center text-[8px] font-medium leading-3">
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

                  {selected && mode !== "book-down" && (
                    <span className="absolute right-1 top-1">
                      <Check size={9} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4">
          <label
            htmlFor="payment-amount"
            className="mb-2 block text-[10px] font-semibold text-[#26382D]"
          >
            {amountLabel}
          </label>

          <div className="flex h-11 items-center rounded-lg border border-[#7CA98D] bg-[#F9FBF9] px-3 shadow-[0_0_0_2px_rgba(33,139,87,0.05)]">
            <span className="mr-1 text-sm font-bold text-[#218B57]">₦</span>

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
              className="h-full w-full bg-transparent text-sm font-semibold text-[#26382D] outline-none placeholder:font-normal placeholder:text-[#A1AAA3] disabled:opacity-70"
            />
          </div>

          {mode === "partial" && (
            <p className="mt-1 text-[8px] text-[#9AA49C]">
              Outstanding balance: {formatNaira(outstanding)}
            </p>
          )}
        </div>

        {/* Payment summary */}
        <div className="mt-3 space-y-2 rounded-lg bg-[#F7EEE3] p-3">
          <div className="flex justify-between gap-3 text-[9px] text-[#806D59]">
            <span>Invoice total</span>
            <span>{formatNaira(total)}</span>
          </div>

          <div className="flex justify-between gap-3 text-[9px] text-[#806D59]">
            <span>Paid now</span>
            <span>{formatNaira(paidNow)}</span>
          </div>

          <div className="flex justify-between gap-3 border-t border-[#E9DCCB] pt-2 text-[9px] font-semibold text-[#71563B]">
            <span>
              {mode === "book-down"
                ? `Added to ${customer.name.split(" ")[0]}'s balance`
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
        <div className="mt-2.5 flex gap-2 rounded-lg bg-[#E7F4EB] p-2.5">
          <div className="grid size-5 flex-none place-items-center rounded-full bg-[#D3EBDD]">
            <CheckCircle2 size={11} className="text-[#218B57]" />
          </div>

          <p className="text-[8px] leading-[1.5] text-[#52745F]">
            {mode === "book-down"
              ? "This amount will be added to the customer's balance. No payment will be recorded as received."
              : "Paid through the OjaHub link? You don't need to record it. Transfer and card payments are marked paid automatically."}
          </p>
        </div>

        <p className="mt-3 text-[8px] leading-4 text-[#9AA49C]">
          {mode === "book-down"
            ? "The customer can pay the outstanding balance later."
            : "The remaining balance can be paid later using the same link."}
        </p>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[9px] text-red-700"
          >
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-10 rounded-full border border-[#E3E9E4] px-7 text-[10px] font-semibold text-[#405146] transition hover:bg-[#F6F8F6] disabled:opacity-50 sm:min-w-[110px]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving || outstanding <= 0}
            onClick={handleSave}
            className="h-10 rounded-full bg-[#218B57] px-7 text-[10px] font-semibold text-white transition hover:bg-[#176F43] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[130px]"
          >
            {saving ? "Saving..." : "Save payment"}
          </button>
        </div>
      </section>
    </div>
  );
}
