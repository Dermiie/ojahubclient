// The row under the cards: search box, location dropdown, and the All / Low stock buttons.

import searchIcon from "../assets/icons/search.svg";
import dropdownIcon from "../assets/icons/dropdown.svg";
import dropdownMobileIcon from "../assets/icons/dropdown-mobile.svg";
import pinIcon from "../assets/icons/pin.svg";

export default function ProductsFilters() {
  return (
    <div className="flex flex-wrap items-center gap-[8.86px] lg:gap-[10px]">
      {/* search box, desktop only (on mobile the search button in the header does this) */}
      <div className="hidden h-[46px] min-w-px flex-1 items-center gap-[10px] rounded-[14px] bg-background-card px-[14px] lg:flex">
        <img src={searchIcon} alt="" className="size-[18px]" />
        <input
          type="text"
          placeholder="Search products"
          className="min-w-0 flex-1 bg-transparent text-[16px] tracking-[-0.02em] text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {/* location dropdown */}
      <button
        type="button"
        className="mr-[4.55px] flex h-[40px] items-center gap-[6px] rounded-[14px] border border-border-default bg-background-main px-[14px] text-[14px] font-medium tracking-[-0.02em] text-text-primary lg:mr-0 lg:h-[46px] lg:gap-2 lg:font-semibold"
      >
        {/* pin is mobile only */}
        <img src={pinIcon} alt="" className="size-[15px] lg:hidden" />
        All locations
        <img
          src={dropdownMobileIcon}
          alt=""
          className="size-[14px] lg:hidden"
        />
        <img src={dropdownIcon} alt="" className="hidden size-4 lg:block" />
      </button>

      {/* All (selected) */}
      <button
        type="button"
        className="h-[40px] rounded-[13px] bg-primary-base px-[14px] text-[14px] font-medium tracking-[-0.02em] text-text-inverse lg:h-[46px] lg:rounded-[14px] lg:px-4 lg:font-semibold"
      >
        All
      </button>

      {/* Low stock */}
      <button
        type="button"
        className="h-[40px] rounded-[14px] border border-border-default bg-background-main px-[14px] text-b2-regular text-text-primary lg:h-[46px] lg:px-4"
      >
        Low stock
      </button>
    </div>
  );
}
