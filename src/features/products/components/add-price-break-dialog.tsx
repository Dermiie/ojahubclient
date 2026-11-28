// The Add a price break popup. A box in the middle on desktop, a sheet from the bottom on mobile.
import { useState } from "react";
import closeIcon from "../assets/icons/close.svg";
import arrowDownIcon from "../assets/icons/arrow-down.svg";
import minusIcon from "../assets/icons/minus.svg";
import plusSmallIcon from "../assets/icons/plus-small.svg";

// what the popup hands to the page when a price break is added
export type NewPriceBreak = {
  customer: string;
  quantity: number;
  price: string;
};

type Props = {
  open: boolean;
  unit: string;
  productName: string;
  onClose: () => void;
  onAdd: (priceBreak: NewPriceBreak) => void;
};

// the small bold labels above each part (mobile left 18, desktop left 26)
const labelStyle =
  "absolute left-[18px] text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary lg:left-[26px]";

// the grey small lines under a title or label
const smallTextStyle =
  "absolute left-[18px] text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary lg:left-[26px]";

export default function AddPriceBreakDialog({
  open,
  unit,
  productName,
  onClose,
  onAdd,
}: Props) {
  // what the user picks inside the popup
  const [customer, setCustomer] = useState("retail");
  const [quantity, setQuantity] = useState(6);
  const [price, setPrice] = useState("");

  // put the popup back to how it started
  const reset = () => {
    setCustomer("retail");
    setQuantity(6);
    setPrice("");
  };

  // close without adding anything
  const close = () => {
    reset();
    onClose();
  };

  // send the price break to the page, then close
  const add = () => {
    if (!price) return;
    onAdd({ customer, quantity, price });
    reset();
    onClose();
  };

  // when it is closed, show nothing
  if (!open) return null;

  return (
    // the dark green see-through background, clicking it closes the popup
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#12432A]/55 lg:items-center"
    >
      {/* the white box, clicking inside it should not close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[544px] w-full rounded-t-[32px] bg-white lg:h-[536px] lg:w-[520px] lg:rounded-[32px]"
      >
        {/* the small grab handle, mobile only */}
        <div className="absolute left-1/2 top-[12px] h-1 w-[44px] -translate-x-1/2 rounded-[2px] bg-border-default lg:hidden" />

        {/* title and the line under it, it shows the name typed on the page */}
        <h2 className="absolute left-[18px] top-[34px] text-[18px] font-bold leading-[1.3] text-text-primary lg:left-[26px] lg:top-[28px]">
          Add a price break
        </h2>
        <p
          className={`${smallTextStyle} top-[64px] max-w-[calc(100%-100px)] truncate lg:top-[58px]`}
        >
          {productName.trim() || "New product"} · per {unit}
        </p>

        {/* the close button */}
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-[18px] top-[32px] flex size-[44px] items-center justify-center rounded-full bg-background-card lg:right-[26px] lg:top-[26px]"
        >
          <img src={closeIcon} alt="" className="size-4" />
        </button>

        {/* for which customers */}
        <span className={`${labelStyle} top-[98px] lg:top-[96px]`}>
          For which customers?
        </span>
        <div className="absolute inset-x-[18px] top-[124px] h-[54px] lg:inset-x-[26px] lg:top-[122px]">
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="size-full appearance-none rounded-[16px] border border-border-default bg-white pl-4 pr-10 text-[16px] leading-[1.3] tracking-[-0.02em] text-text-primary outline-none"
          >
            <option value="retail">Retail</option>
            <option value="semi-wholesale">Semi-wholesale</option>
            <option value="bulk">Bulk importer</option>
          </select>
          <img
            src={arrowDownIcon}
            alt=""
            className="pointer-events-none absolute right-3 top-1/2 size-[14px] -translate-y-1/2"
          />
        </div>

        {/* when they buy at least, with the counter on the right */}
        <span className={`${labelStyle} top-[198px] lg:top-[194px]`}>
          When they buy at least
        </span>
        <span className={`${smallTextStyle} top-[218px] lg:top-[214px]`}>
          {unit}s in one invoice
        </span>
        <div className="absolute right-[18px] top-[196px] flex h-[40px] w-[138px] items-center lg:right-[26px] lg:top-[192px]">
          {/* minus, it stops at 1 */}
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-[40px] items-center justify-center rounded-[14px] border border-border-subtle bg-background-card"
          >
            <img src={minusIcon} alt="" className="size-4" />
          </button>
          <span className="w-[58px] text-center text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
            {quantity}
          </span>
          {/* plus, green on mobile and dark on desktop */}
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-[40px] items-center justify-center rounded-[14px] bg-primary-base lg:bg-text-primary"
          >
            <img src={plusSmallIcon} alt="" className="size-4" />
          </button>
        </div>

        {/* price per unit */}
        <span className={`${labelStyle} top-[264px] lg:top-[254px]`}>
          Price per {unit}
        </span>
        <div className="absolute inset-x-[18px] top-[290px] flex h-[52px] items-center gap-1 rounded-[16px] border border-border-default bg-white px-4 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary lg:inset-x-[26px] lg:top-[280px]">
          <span>₦</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="8,500"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-secondary"
          />
        </div>

        {/* the green example box, fixed text for now */}
        <div className="absolute inset-x-[18px] top-[348px] h-[100px] rounded-[16px] bg-primary-subtle text-[12px] leading-[1.3] tracking-[-0.02em] text-[#12432A] lg:inset-x-[26px] lg:top-[340px]">
          <span className="absolute left-4 top-3 font-semibold">Example</span>
          <span className="absolute left-4 top-10">
            5 bundles → 5 × ₦10,000 = ₦50,000
          </span>
          <span className="absolute left-4 top-[68px]">
            8 bundles → 8 × ₦8,500 = ₦68,000
          </span>
        </div>

        {/* the two buttons at the bottom, equal halves on mobile */}
        <button
          type="button"
          onClick={close}
          className="absolute left-[18px] top-[464px] h-[46px] w-[calc((100%-46px)/2)] rounded-[60px] border border-border-default bg-white text-[16px] font-bold leading-[1.3] text-text-primary lg:left-[26px] lg:top-[456px] lg:w-[221px]"
        >
          Cancel
        </button>
        {/* it needs a price first, then it adds the break to the page */}
        <button
          type="button"
          onClick={add}
          disabled={!price}
          className="absolute right-[18px] top-[464px] h-[46px] w-[calc((100%-46px)/2)] rounded-[60px] bg-primary-base text-[16px] font-bold leading-[1.3] text-white disabled:opacity-50 lg:right-[26px] lg:top-[456px] lg:w-[229px]"
        >
          Add price break
        </button>
      </div>
    </div>
  );
}
