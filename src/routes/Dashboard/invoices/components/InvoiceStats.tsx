import {
  formatNaira,
  getInvoiceBalance,
  getInvoiceTotal,
  type Invoice,
} from "@/lib/invoices";

interface InvoiceStatsProps {
  invoices: Invoice[];
}

type Tone = "forest" | "sand" | "plain";

const toneStyles: Record<Tone, string> = {
  forest: "bg-primary-active text-text-inverse",
  sand: "bg-secondary-base/15 text-text-primary",
  plain: "border border-border-subtle bg-background-card text-text-primary",
};

const ARC_SIZES = [200, 150, 100];
const ARC_BOX = 200;
const ARC_OFFSET = 40;

function Arcs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -top-10"
    >
      {ARC_SIZES.map((size) => (
        <div
          key={size}
          className="absolute rounded-full border border-white/15"
          style={{
            width: size,
            height: size,
            right: (ARC_BOX - size) / 2 - ARC_OFFSET,
            top: (ARC_BOX - size) / 2 - ARC_OFFSET,
          }}
        />
      ))}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  note: string;
  tone: Tone;
  className?: string;
}

function StatCard({ label, value, note, tone, className = "" }: StatCardProps) {
  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-3xl p-4 @3xl:p-5 ${toneStyles[tone]} ${className}`}
    >
      {tone === "forest" && <Arcs />}

      <div className="relative z-10 text-xs font-medium @3xl:text-sm">
        {label}
      </div>

      <b className="relative z-10 my-1 block text-xl font-semibold tracking-tight @3xl:text-3xl">
        {value}
      </b>

      <div className="relative z-10 text-[11px] opacity-80 @3xl:text-xs">
        {note}
      </div>
    </div>
  );
}

const sum = (invoices: Invoice[], pick: (invoice: Invoice) => number) =>
  invoices.reduce((total, invoice) => total + pick(invoice), 0);

const countLabel = (count: number) =>
  `${count} ${count === 1 ? "invoice" : "invoices"}`;

export default function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const waiting = invoices.filter((invoice) => invoice.status === "Waiting");

  const owing = invoices.filter(
    (invoice) => invoice.status === "Part-paid" || invoice.status === "Owing",
  );

  const paidToday = invoices.filter(
    (invoice) => invoice.status === "Paid" && invoice.day === "Today",
  );

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 @3xl:mt-5 @3xl:grid-cols-3 @3xl:gap-5">
      {/* Green card: Waiting for transfer */}
      <StatCard
        tone="forest"
        label="Waiting for transfer"
        value={formatNaira(sum(waiting, getInvoiceTotal))}
        note={countLabel(waiting.length)}
      />

      {/* Beige card: Owing or part-paid */}
      <StatCard
        tone="sand"
        label="Owing or part-paid"
        value={formatNaira(sum(owing, getInvoiceBalance))}
        note={countLabel(owing.length)}
      />

      {/* Light card: Paid today */}
      <StatCard
        tone="plain"
        label="Paid today"
        value={formatNaira(sum(paidToday, getInvoiceTotal))}
        note={`${countLabel(paidToday.length)} · all verified`}
      />
    </div>
  );
}
