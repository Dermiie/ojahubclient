// The Quantity price breaks card on the Add product form: the example box and the add button.
import priceTagIcon from "../assets/icons/price-tag.svg";
import plusIcon from "../assets/icons/plus.svg";

export default function AddProductPriceBreaks() {
  return (
    // desktop view
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

      {/* the green example box */}
      <div className="flex items-center gap-[9.74px] rounded-[14.61px] bg-primary-subtle px-[12.98px] py-[11.36px] text-[12px] leading-[1.3] text-[#12432A]">
        <img src={priceTagIcon} alt="" className="size-4 shrink-0" />
        <p>
          <span className="tracking-[-0.02em]">Example: </span>
          <span className="font-medium tracking-[-0.02em]">6 or more at</span>
          <span className="text-[12.17px]">
            {" "}
            ₦8,500 each. When a customer buys that many, the price drops by
            itself.
          </span>
        </p>
      </div>

      {/* add a price break button */}
      <button
        type="button"
        className="flex h-[40px] w-full items-center justify-center gap-[6px] rounded-[60px] border border-border-default bg-background-main px-4 py-3 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary"
      >
        Add a price break
        <img src={plusIcon} alt="" className="size-[18px]" />
      </button>
    </div>
  );
}
