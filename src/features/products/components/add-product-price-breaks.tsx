// The Quantity price breaks card on the Add product form: the example box, the added rows and the add button.
import { useState } from "react";
import priceTagIcon from "../assets/icons/price-tag.svg";
import plusIcon from "../assets/icons/plus.svg";
import removeIcon from "../assets/icons/remove.svg";
import AddPriceBreakDialog from "./add-price-break-dialog";
import type { NewPriceBreak } from "./add-price-break-dialog";

// one price break the user has added
export type PriceBreak = NewPriceBreak & { id: string };

// the page gives us the unit, the product name, the list and a way to add or remove one
type Props = {
  unit: string;
  productName: string;
  breaks: PriceBreak[];
  onAdd: (priceBreak: NewPriceBreak) => void;
  onRemove: (id: string) => void;
};

// the names we show for each customer type
const CUSTOMER_NAMES: Record<string, string> = {
  retail: "Retail",
  "semi-wholesale": "Semi-wholesale",
  bulk: "Bulk importer",
};

// 8500 becomes 8,500
const formatPrice = (price: string) => Number(price).toLocaleString("en-US");

export default function AddProductPriceBreaks({
  unit,
  productName,
  breaks,
  onAdd,
  onRemove,
}: Props) {
  // remembers if the price break popup is open
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-[#E3E7E5] px-[19.48px] py-[17.85px] lg:flex">
        {/* title and optional */}
        <div className="flex flex-col gap-[3.25px]">
          <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
            Quantity price breaks
          </h2>
          <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            Optional
          </p>
        </div>

        {/* the green example box, only while there are no price breaks */}
        {breaks.length === 0 && (
          <div className="flex items-center gap-[9.74px] rounded-[14.61px] bg-primary-subtle px-[12.98px] py-[11.36px] text-[12px] leading-[1.3] text-[#12432A]">
            <img src={priceTagIcon} alt="" className="size-4 shrink-0" />
            <p>
              <span className="tracking-[-0.02em]">Example: </span>
              <span className="font-medium tracking-[-0.02em]">
                6 or more at
              </span>
              <span className="text-[12.17px]">
                {" "}
                ₦8,500 each. When a customer buys that many, the price drops by
                itself.
              </span>
            </p>
          </div>
        )}

        {/* the price breaks the user has added */}
        {breaks.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-[9.74px] rounded-[14.61px] bg-primary-subtle px-[12.98px] py-[11.36px] text-[12px] leading-[1.3] tracking-[-0.02em] text-[#12432A]"
          >
            <p className="min-w-0 flex-1">
              {CUSTOMER_NAMES[item.customer]} ·{" "}
              <span className="font-medium">{item.quantity} or more</span>
            </p>
            <span className="shrink-0 font-medium">
              ₦{formatPrice(item.price)} each
            </span>
            <button
              type="button"
              aria-label="Remove price break"
              onClick={() => onRemove(item.id)}
              className="flex size-[30.84px] shrink-0 items-center justify-center rounded-[9.74px] bg-white"
            >
              <img src={removeIcon} alt="" className="size-[12.98px]" />
            </button>
          </div>
        ))}

        {/* add a price break button, opens the popup */}
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex h-[40px] w-full items-center justify-center gap-[6px] rounded-[60px] border border-border-default bg-background-main px-4 py-3 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary"
        >
          Add a price break
          <img src={plusIcon} alt="" className="size-[18px]" />
        </button>
      </div>

      {/* mobile view */}
      <div className="flex flex-col gap-3 rounded-[24px] border border-border-default bg-background-main p-4 lg:hidden">
        {/* title and optional */}
        <div className="flex flex-col gap-[3px]">
          <h2 className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Quantity price breaks
          </h2>
          <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            Optional
          </p>
        </div>

        {/* the green example box, only while there are no price breaks */}
        {breaks.length === 0 && (
          <div className="flex items-center gap-5 rounded-[6.88px] bg-primary-subtle px-5 py-2 text-[14px] leading-[1.3] tracking-[-0.02em] text-[#12432A]">
            <img src={priceTagIcon} alt="" className="size-6 shrink-0" />
            <p>
              <span className="block">
                <span>Example</span>
                <span className="font-medium">: 6 or more at ₦8,500 each.</span>
              </span>
              <span className="block">When a customer buys that many, the</span>
              <span className="block">price drops by itself.</span>
            </p>
          </div>
        )}

        {/* the price breaks the user has added */}
        {breaks.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-[10px] rounded-[16px] bg-primary-subtle px-[14px] py-3 text-[#12432A]"
          >
            <p className="min-w-0 flex-1 text-[14px] leading-[1.3] tracking-[-0.02em]">
              {CUSTOMER_NAMES[item.customer]} ·{" "}
              <span className="font-medium">{item.quantity} or more</span>
            </p>
            <span className="shrink-0 text-[16px] font-medium leading-[1.3]">
              ₦{formatPrice(item.price)} each
            </span>
            <button
              type="button"
              aria-label="Remove price break"
              onClick={() => onRemove(item.id)}
              className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-white"
            >
              <img src={removeIcon} alt="" className="size-4" />
            </button>
          </div>
        ))}

        {/* add a price break button, dashed on mobile, opens the popup */}
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[35px] border border-dashed border-[#848E89] bg-background-main text-[16px] font-medium leading-[1.3] text-text-primary"
        >
          <img src={plusIcon} alt="" className="size-4" />
          Add a price break
        </button>
      </div>

      {/* the popup, it shows only when dialogOpen is true */}
      <AddPriceBreakDialog
        open={dialogOpen}
        unit={unit}
        productName={productName}
        onClose={() => setDialogOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
}
