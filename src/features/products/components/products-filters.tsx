// The row under the cards: search box, location dropdown, and the All / Low stock buttons.

import { useState } from "react";
import searchIcon from "../assets/icons/search.svg";
import dropdownIcon from "../assets/icons/dropdown.svg";
import dropdownMobileIcon from "../assets/icons/dropdown-mobile.svg";
import pinIcon from "../assets/icons/pin.svg";
import { LOCATIONS } from "../data/sample-data";
import type { StockFilter } from "../types";

export default function ProductsFilters({
  search,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  locationId,
  onLocationChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  stockFilter: StockFilter;
  onStockFilterChange: (value: StockFilter) => void;
  locationId: string;
  onLocationChange: (value: string) => void;
}) {
  // the two looks a button can have: picked (green) or not picked (white)
  const pickedStyle =
    "border border-primary-base bg-primary-base text-text-inverse";
  const notPickedStyle =
    "border border-border-default bg-background-main text-text-primary";

  // is the location list open or closed (only this row cares, so it stays here)
  const [isOpen, setIsOpen] = useState(false);
  // the location that is picked, so we can show its name on the button
  const pickedLocation = LOCATIONS.find(
    (location) => location.id === locationId,
  );

  // pick a location and close the list
  const pickLocation = (id: string) => {
    onLocationChange(id);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-[8.86px] lg:gap-[10px]">
      {/* search box, desktop only (on mobile the search button in the header does this) */}
      <div className="hidden h-[46px] min-w-px flex-1 items-center gap-[10px] rounded-[14px] bg-background-card px-[14px] lg:flex">
        <img src={searchIcon} alt="" className="size-[18px]" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className="min-w-0 flex-1 bg-transparent text-[16px] tracking-[-0.02em] text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {/* location dropdown */}
      <div className="relative mr-[4.55px] lg:mr-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[40px] items-center gap-[6px] rounded-[14px] border border-border-default bg-background-main px-[14px] text-[14px] font-medium tracking-[-0.02em] text-text-primary lg:h-[46px] lg:gap-2 lg:font-semibold"
        >
          {/* pin is mobile only */}
          <img src={pinIcon} alt="" className="size-[15px] lg:hidden" />
          {pickedLocation ? pickedLocation.shortName : "All locations"}
          <img
            src={dropdownMobileIcon}
            alt=""
            className="size-[14px] lg:hidden"
          />
          <img src={dropdownIcon} alt="" className="hidden size-4 lg:block" />
        </button>

        {isOpen && (
          <>
            {/* invisible layer behind the list, clicking it closes the list */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-2 flex min-w-[190px] flex-col gap-1 rounded-[14px] border border-border-default bg-background-main p-1">
              <button
                type="button"
                onClick={() => pickLocation("all")}
                className={`rounded-[10px] px-3 py-2 text-left text-[14px] tracking-[-0.02em] ${
                  locationId === "all"
                    ? "bg-primary-subtle font-semibold text-primary-base"
                    : "text-text-primary"
                }`}
              >
                All locations
              </button>
              {LOCATIONS.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => pickLocation(location.id)}
                  className={`rounded-[10px] px-3 py-2 text-left text-[14px] tracking-[-0.02em] ${
                    locationId === location.id
                      ? "bg-primary-subtle font-semibold text-primary-base"
                      : "text-text-primary"
                  }`}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* All (selected) */}
      {/* green when picked, white when not */}
      <button
        type="button"
        onClick={() => onStockFilterChange("all")}
        className={`h-[40px] rounded-[13px] px-[14px] text-[14px] font-medium tracking-[-0.02em] lg:h-[46px] lg:rounded-[14px] lg:px-4 lg:font-semibold ${
          stockFilter === "all" ? pickedStyle : notPickedStyle
        }`}
      >
        All
      </button>

      {/* Low stock */}
      <button
        type="button"
        onClick={() => onStockFilterChange("low")}
        className={`h-[40px] rounded-[14px] px-[14px] text-b2-regular lg:h-[46px] lg:px-4 ${
          stockFilter === "low" ? pickedStyle : notPickedStyle
        }`}
      >
        Low stock
      </button>
    </div>
  );
}
