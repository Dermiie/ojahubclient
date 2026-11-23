import { Link } from "react-router";
import {
  formatNaira,
  getInvoicePath,
  getInvoiceTotal,
  getItemsSummary,
  type Customer,
  type Invoice,
  type InvoiceStatusValue,
} from "@/lib/invoices";

interface InvoiceTableProps {
  invoices: Invoice[];
  customers: Customer[];
}

const EMPTY_MESSAGE =
  "Nothing here yet. Invoices with this status will show up as they happen.";

const DESKTOP_GRID =
  "grid grid-cols-[100px_1.5fr_1.6fr_130px_100px_110px] items-center gap-3";

/* ---------- Small pieces ---------- */

const statusStyles: Record<InvoiceStatusValue, string> = {
  Waiting: "bg-background-muted text-text-secondary",
  Paid: "bg-success-light text-success-base",
  "Part-paid": "bg-primary-subtle text-primary-base",
  Owing: "bg-secondary-base/15 text-secondary-base",
};

function StatusBadge({ status }: { status: InvoiceStatusValue }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      <i aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// Swap for your shared avatar component if you already have one.
const avatarTints = [
  "bg-success-light text-success-base",
  "bg-primary-subtle text-primary-base",
];

function CustomerAvatar({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  // The same customer always gets the same tint.
  const tint = avatarTints[(id.charCodeAt(0) + (id.charCodeAt(1) || 0)) % 2];

  return (
    <div
      aria-hidden="true"
      className={`grid size-10 flex-none place-items-center rounded-xl text-xs font-bold ${tint} ${className}`}
    >
      {id}
    </div>
  );
}

/* ---------- Table ---------- */

export default function InvoiceTable({
  invoices,
  customers,
}: InvoiceTableProps) {
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  );

  const getCustomerName = (invoice: Invoice) =>
    customerNames.get(invoice.customerId) ?? invoice.customerId;

  if (invoices.length === 0) {
    return (
      <p className="mt-6 text-center text-text-tertiary">{EMPTY_MESSAGE}</p>
    );
  }

  // Mobile groups in the order days first appear (Today, Yesterday, ...).
  const days = [...new Set(invoices.map((invoice) => invoice.day))];

  return (
    <>
      {/* Desktop */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-border-default bg-background-card px-5 py-2 @max-3xl:hidden">
        <div
          aria-hidden="true"
          className={`${DESKTOP_GRID} py-3 text-xs text-text-tertiary`}
        >
          <span>Invoice</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {invoices.map((invoice) => (
          <Link
            key={invoice.no}
            to={getInvoicePath(invoice.no)}
            className={`${DESKTOP_GRID} py-3.5 hover:bg-background-muted/50`}
          >
            <span className="font-medium">{invoice.no}</span>

            <span className="flex items-center gap-2.5">
              <CustomerAvatar
                id={invoice.customerId}
                className="size-8 text-[10px]"
              />
              <b className="font-medium">{getCustomerName(invoice)}</b>
            </span>

            <span className="truncate text-text-tertiary">
              {getItemsSummary(invoice)}
            </span>

            <span className="text-text-tertiary">
              {invoice.day} {invoice.time}
            </span>

            <b>{formatNaira(getInvoiceTotal(invoice))}</b>

            <span>
              <StatusBadge status={invoice.status} />
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile, grouped by day */}
      <div className="mt-4 @3xl:hidden">
        {days.map((day) => (
          <div key={day}>
            <div className="py-2 text-text-tertiary">{day}</div>

            {invoices
              .filter((invoice) => invoice.day === day)
              .map((invoice) => (
                <Link
                  key={invoice.no}
                  to={getInvoicePath(invoice.no)}
                  className="flex items-center gap-3 border-b border-border-default py-3"
                >
                  <CustomerAvatar id={invoice.customerId} className="size-12" />

                  <div className="min-w-0 flex-1">
                    <b className="block truncate font-medium">
                      {getCustomerName(invoice)}
                    </b>
                    <span className="text-xs text-text-tertiary">
                      {invoice.no} {invoice.time}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <b className="text-base">
                      {formatNaira(getInvoiceTotal(invoice))}
                    </b>
                    <StatusBadge status={invoice.status} />
                  </div>
                </Link>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
