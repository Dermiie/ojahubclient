// Top of the Add product page: the back button, the label and the title.
import { Link } from "react-router";
import backIcon from "../assets/icons/back.svg";

export default function AddProductHeader() {
  return (
    <>
      {/* desktop view */}
      <div className="hidden items-center gap-[14px] lg:flex">
        {/* round back button, goes to the products list */}
        <Link
          to="/products"
          aria-label="Back to products"
          className="flex size-[44px] items-center justify-center rounded-full border border-[#E3E7E5]"
        >
          <img src={backIcon} alt="" className="size-5" />
        </Link>

        {/* the label and the title */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] leading-[1.3] tracking-[-0.02em] text-[#5F6B66]">
            Products
          </span>
          <h1 className="text-[24px] font-semibold leading-[1.3] text-text-primary">
            Add product
          </h1>
        </div>
      </div>
    </>
  );
}
