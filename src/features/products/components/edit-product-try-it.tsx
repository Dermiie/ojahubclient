// Dark green card on the Edit page: shows what a customer would pay for a few sample amounts.
import ringsIcon from "../assets/icons/after-save-rings.svg";
import type { PriceBreak } from "./add-product-price-breaks";

type Props = {
  unit: string;
  retailPrice: string;
  bulkPrice: string;
  breaks: PriceBreak[];
  onSave: () => void;
};

// the three sample lines from Figma
const SAMPLE_LINES = [
  { customer: "retail", label: "Retail", quantity: 3 },
  { customer: "retail", label: "Retail", quantity: 8 },
  { customer: "bulk", label: "Bulk", quantity: 25 },
];

// price for one item: use the best price break the customer has reached, else the normal price
function unitPrice(
  customer: string,
  quantity: number,
  basePrice: string,
  breaks: PriceBreak[],
) {
  const reached = breaks
    .filter((b) => b.customer === customer && b.quantity <= quantity)
    .sort((a, b) => b.quantity - a.quantity)[0];
  return Number(reached ? reached.price : basePrice);
}

export default function EditProductTryIt({
  unit,
  retailPrice,
  bulkPrice,
  breaks,
  onSave,
}: Props) {
  return (
    // desktop only, the mobile design does not have this card
    <div className="relative hidden flex-col gap-[12.98px] overflow-hidden rounded-[22.72px] bg-[#12432A] p-[21.1px] lg:flex">
      {/* faint circles in the background */}
      <img
        src={ringsIcon}
        alt=""
        className="pointer-events-none absolute left-[185px] top-[-114px] size-[292.15px] max-w-none"
      />

      {/* title */}
      <p className="relative text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-[#CDE7D8]">
        Try it: what would a customer pay?
      </p>

      {/* the three sample lines, the last one is highlighted */}
      <div className="relative flex flex-col gap-[8.12px]">
        {SAMPLE_LINES.map((line, index) => {
          const each = unitPrice(
            line.customer,
            line.quantity,
            line.customer === "bulk" ? bulkPrice : retailPrice,
            breaks,
          );
          const total = each * line.quantity;
          const highlighted = index === SAMPLE_LINES.length - 1;

          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-[12.98px] px-[12.98px] py-[11.36px] text-[12px] leading-[1.3] tracking-[-0.02em] ${
                highlighted ? "bg-[#CDE7D8] text-[#12432A]" : "bg-white/10 text-white"
              }`}
            >
              <span>
                {line.label} · {line.quantity} {unit}s
              </span>
              {/* show a dash until the price is filled in */}
              <span className="font-medium">
                {each > 0 ? `₦${total.toLocaleString("en-US")}` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* note */}
      <p className="relative text-[12px] leading-[1.3] tracking-[-0.02em] text-[#CDE7D8]">
        These prices fill in automatically when you create <br />an invoice.
      </p>

      {/* white save button */}
      <button
        type="button"
        onClick={onSave}
        className="relative h-[40px] w-full cursor-pointer rounded-[60px] bg-white px-[25px] py-[12px] text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-[#1C5E3A]"
      >
        Save Product
      </button>
    </div>
  );
}