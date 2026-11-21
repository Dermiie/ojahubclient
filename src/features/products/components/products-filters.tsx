// The row under the cards: search box, location dropdown, and the All / Low stock buttons.

import searchIcon from "../assets/icons/search.svg";
import dropdownIcon from "../assets/icons/dropdown.svg";

export default function ProductsFilters() {
  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      {/* search box */}
      <div className="flex h-[46px] min-w-px flex-1 items-center gap-[10px] rounded-[14px] bg-background-card px-[14px]">
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
        className="flex h-[46px] items-center gap-2 rounded-[14px] border border-border-default bg-background-main px-[14px] text-[14px] font-semibold tracking-[-0.02em] text-text-primary"
      >
        All locations
        <img src={dropdownIcon} alt="" className="size-4" />
      </button>

      {/* All (selected) */}
      <button
        type="button"
        className="h-[46px] rounded-[14px] bg-primary-base px-4 text-[14px] font-semibold tracking-[-0.02em] text-text-inverse"
      >
        All
      </button>

      {/* Low stock */}
      <button
        type="button"
        className="h-[46px] rounded-[14px] border border-border-default bg-background-main px-4 text-b2-regular text-text-primary"
      >
        Low stock
      </button>
    </div>
  );
}
