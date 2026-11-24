import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceStatusValue } from "@/lib/invoices";

export type InvoiceStatus = "All" | InvoiceStatusValue;

const invoiceStatuses: InvoiceStatus[] = [
  "All",
  "Waiting",
  "Paid",
  "Part-paid",
  "Owing",
];

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeStatus: InvoiceStatus;
  onStatusChange: (status: InvoiceStatus) => void;
  /** Shown beside the "Waiting" tab on mobile, e.g. "Waiting · 2" */
  waitingCount: number;
  /** Mobile only: the header search button toggles the search field. */
  searchOpen?: boolean;
}

export default function InvoiceFilters({
  searchTerm,
  onSearchChange,
  activeStatus,
  onStatusChange,
  waitingCount,
  searchOpen = false,
}: InvoiceFiltersProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 @3xl:mt-5 @3xl:flex-row @3xl:items-center">
      {/* Search: always visible on desktop, opened from the header on mobile */}
      <div
        className={`relative ${searchOpen ? "block" : "hidden"} @3xl:block @3xl:flex-1`}
      >
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
        />

        <Input
          id="invoice-search-input"
          type="search"
          aria-label="Search invoices"
          autoFocus={searchOpen}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search invoice, customer or product"
          className="h-11 w-full rounded-full border-border-default bg-background-card pl-10 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:border-primary-base focus-visible:ring-primary-base/20"
        />
      </div>

      {/* Status tabs */}
      <div
        role="group"
        aria-label="Filter invoices by status"
        className="flex gap-2 overflow-x-auto"
      >
        {invoiceStatuses.map((status) => {
          const isActive = activeStatus === status;

          return (
            <button
              key={status}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStatusChange(status)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary-base bg-primary-base text-text-inverse"
                  : "border-border-default bg-background-card text-text-secondary hover:border-primary-base hover:text-primary-base"
              }`}
            >
              {status}
              {status === "Waiting" && (
                <span className="@3xl:hidden"> · {waitingCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
