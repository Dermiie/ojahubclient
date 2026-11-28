// The dark green banner at the top of the Price profile page.
import priceTagIcon from "../assets/icons/price-tag-white.svg";
import ringsIcon from "../assets/icons/after-save-rings.svg";

export default function PriceProfileBanner() {
  return (
    <>
      {/* desktop view */}
      <div className="relative hidden items-center gap-[16.23px] overflow-hidden rounded-[22.72px] bg-[#12432A] p-[21.1px] lg:flex">
        {/* faint circles in the background */}
        <img
          src={ringsIcon}
          alt=""
          className="pointer-events-none absolute -right-[97.7px] -top-[121.73px] size-[292.15px] max-w-none"
        />

        {/* the icon box */}
        <div className="relative flex size-[45.445px] shrink-0 items-center justify-center rounded-[14.607px] bg-white/[0.14]">
          <img src={priceTagIcon} alt="" className="size-[21.1px]" />
        </div>

        {/* the title and the line under it */}
        <div className="relative flex min-w-0 flex-1 flex-col gap-[3.246px]">
          <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-white">
            Set a price once, use it everywhere
          </p>
          <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-[#CDE7D8]">
            Give each customer a profile. When you pick them on an invoice, the
            right price for every product fills in by itself.
          </p>
        </div>
      </div>

      {/* mobile view: no bold title, just the short line */}
      <div className="relative flex items-center gap-[14px] overflow-hidden rounded-[24px] bg-[#12432A] p-[18px] lg:hidden">
        {/* faint circles, the position is an estimate from the canvas */}
        <img
          src={ringsIcon}
          alt=""
          className="pointer-events-none absolute -right-[78px] -top-[11px] size-[180px] max-w-none"
        />

        {/* the icon box */}
        <div className="relative flex size-[40px] shrink-0 items-center justify-center rounded-[13px] bg-white/[0.14]">
          <img src={priceTagIcon} alt="" className="size-5" />
        </div>

        <p className="relative max-w-[248px] text-[14px] leading-[1.3] tracking-[-0.02em] text-[#BFD2CA]">
          Give each customer a profile. When you pick them on an invoice, their
          price fills in by itself.
        </p>
      </div>
    </>
  );
}