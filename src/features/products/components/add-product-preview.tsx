// The right side of the Add product page: the live preview, the "After you save" note and the save buttons.
import boxIcon from "../assets/icons/box.svg";
import ringsIcon from "../assets/icons/after-save-rings.svg";

export default function AddProductPreview() {
  return (
    // desktop view
    <div className="hidden flex-col gap-[25px] lg:flex">
      {/* preview card, it will show what the user types in the form */}
      <div className="flex flex-col gap-[18px] overflow-hidden rounded-[24px] border border-border-default">
        {/* photo area */}
        <div className="flex h-[151px] items-center justify-center bg-background-card">
          <img src={boxIcon} alt="" className="size-9" />
        </div>

        {/* name bar, price and note */}
        <div className="flex flex-col gap-[10px] p-3">
          <div className="h-[10px] w-[239px] rounded-[6px] bg-border-subtle" />
          <div className="flex items-baseline justify-between">
            <div className="flex w-[151px] flex-col gap-1">
              <span className="text-[30px] font-bold leading-[1.3] text-text-secondary">
                ₦–
              </span>
              <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-secondary">
                Fill in the form to see it here
              </span>
            </div>
            <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-secondary">
              per bundle
            </span>
          </div>
        </div>
      </div>

      {/* the green note and the two buttons */}
      <div className="flex flex-col gap-[18px]">
        <div className="relative flex flex-col gap-[12.98px] overflow-hidden rounded-[22.72px] bg-[#12432A] p-[21.1px]">
          {/* faint circles in the background */}
          <img
            src={ringsIcon}
            alt=""
            className="pointer-events-none absolute left-[185px] top-[-115px] size-[292.15px] max-w-none"
          />
          <h2 className="relative text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#E7F3EC]">
            After you save
          </h2>
          <p className="relative text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-[#CDE7D8]">
            It’s ready to sell straight away. Prices fill in on invoices and
            OjaHub start watching how fast it sells.
          </p>
        </div>

        <div className="flex flex-col gap-[14px]">
          <button
            type="button"
            className="flex h-[50px] w-full items-center justify-center rounded-[60px] bg-primary-base px-[10px] py-3 text-[14px] font-bold leading-[1.3] text-white"
          >
            Save product
          </button>
          <button
            type="button"
            className="flex h-[50px] w-full items-center justify-center rounded-[60px] border border-primary-base px-[10px] py-3 text-[14px] font-bold leading-[1.3] text-primary-base"
          >
            Save and add another
          </button>
        </div>
      </div>
    </div>
  );
}
