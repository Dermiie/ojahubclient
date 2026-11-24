// Top of the Products page.... the label, the title and the two buttons

import truckIcon from "../assets/icons/truck.svg";
import addIcon from "../assets/icons/add.svg";
import searchIcon from "../assets/icons/search-mobile.svg";
import { Button } from "@/components/ui/button";

export default function ProductsHeader() {
  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-wrap items-end justify-between gap-4 lg:flex">
        {/* the title and the label */}
        <div className="flex flex-col gap-[4.838px]">
          <span className="text-[11.289px] text-text-secondary">Stock</span>
          <h1 className="text-[27.416px] font-bold leading-[32.254px] tracking-[-0.8064px] text-text-primary">
            Products
          </h1>
        </div>

        {/* the two buttons on the right */}
        <div className="flex items-center gap-[25px]">
          <Button
            variant="outline"
            className="h-[46px] w-[145px] gap-1.5 rounded-full px-3 text-[16px] tracking-[-0.02em]"
          >
            <img src={truckIcon} alt="" className="size-5" />
            Move stock
          </Button>

          <Button className="h-[46px] w-[132px] gap-1.5 rounded-full px-3 text-[16px] tracking-[-0.02em]">
            <img src={addIcon} alt="" className="size-5" />
            Add stock
          </Button>
        </div>
      </div>

      {/* mobile view */}
      <div className="flex items-center gap-3 pl-[58px] lg:hidden">
        {/* the title */}
        <h1 className="text-[30px] font-bold leading-[34px] text-text-primary">
          Stock
        </h1>

        {/* the search and add buttons on the right */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex size-[46px] items-center justify-center rounded-full border border-border-default bg-white"
          >
            <img src={searchIcon} alt="" className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Add stock"
            className="flex size-[46px] items-center justify-center rounded-full bg-primary-base"
          >
            <img src={addIcon} alt="" className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
}
