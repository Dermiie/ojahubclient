// Top of the Product details page: the back button, the label, the name and the two buttons.
import { Link } from "react-router";
import backIcon from "../assets/icons/back.svg";
import editIcon from "../assets/icons/edit.svg";
import addIcon from "../assets/icons/add.svg";
import { Button } from "@/components/ui/button";
import type { Product } from "../types";

export default function ProductDetailsHeader({
  product,
}: {
  product: Product;
}) {
  // the big photo if the product has one, if not the normal photo
  const photo = product.coverImage ?? product.image;

  return (
    <>
      {/* desktop view */}
      <div className="hidden min-h-[68px] items-center justify-between lg:flex">
        {/* back button, label and name */}
        <div className="flex items-center gap-[14px]">
          <Link
            to="/products"
            aria-label="Back to products"
            className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-border-subtle"
          >
            <img src={backIcon} alt="" className="size-5" />
          </Link>
          <div className="flex flex-col gap-[6px]">
            <span className="text-b2-regular text-text-secondary">
              Products
            </span>
            <h1 className="text-[24px] font-semibold leading-[1.3] text-text-primary">
              {product.name}
            </h1>
          </div>
        </div>

        {/* the two buttons on the right */}
        <div className="flex items-center gap-[25px]">
          <Button
            variant="outline"
            className="h-[46px] w-[100px] gap-1.5 rounded-[30px] border-border-default bg-background-main px-3 py-2.5 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary"
          >
            <img src={editIcon} alt="" className="size-5" />
            Edit
          </Button>

          <Button className="h-[46px] w-[125px] gap-1.5 rounded-[30px] px-3 py-2.5 text-[16px] font-medium leading-[1.3] tracking-[-0.02em]">
            <img src={addIcon} alt="" className="size-5" />
            Add stock
          </Button>
        </div>
      </div>

      {/* mobile view: the cover photo with the back and edit buttons on it */}
      <div className="relative -mx-4 -mt-4 h-[227px] overflow-hidden sm:-mx-6 sm:-mt-6 lg:hidden">
        {product.mobileCoverImage ? (
          <img
            src={product.mobileCoverImage}
            alt={product.name}
            className="absolute bottom-0 left-0 h-[270px] w-full object-cover"
          />
        ) : (
          <img
            src={photo}
            alt={product.name}
            className="absolute left-[-32px] top-[-88px] h-[401px] w-[454px] max-w-none object-cover"
          />
        )}

        {/* the two buttons on the photo */}
        <div className="absolute left-[18px] right-[18px] top-[11px] flex items-start justify-between">
          <Link
            to="/products"
            aria-label="Back to products"
            className="flex size-[46px] items-center justify-center rounded-full bg-background-main"
          >
            <img src={backIcon} alt="" className="size-5" />
          </Link>
          <button
            type="button"
            className="flex h-[46px] items-center gap-[6px] rounded-full bg-background-main px-[18px] text-[14px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary"
          >
            <img src={editIcon} alt="" className="size-4" />
            Edit
          </button>
        </div>
      </div>

      {/* mobile view: the white sheet under the cover with the tag, name and description */}
      <div className="relative -mx-4 -mt-[33px] flex flex-col rounded-t-[28px] bg-background-main px-[18px] pb-[18px] pt-[22px] sm:-mx-6 sm:px-6 lg:hidden">
        <span className="self-start rounded-full bg-background-card px-[10px] py-1 text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-secondary">
          {product.category
            ? `${product.category} · Sold by the ${product.unit}`
            : `Sold by the ${product.unit}`}
        </span>
        <h1 className="pt-1 text-[30px] font-bold leading-[34px] text-text-primary">
          {product.name}
        </h1>
        <p className="text-b2-regular text-text-secondary">
          {Object.values(product.stock).reduce((a, b) => a + b, 0)}{" "}
          {product.unit}s across{" "}
          {Object.values(product.stock).filter((qty) => qty > 0).length}{" "}
          locations
        </p>
      </div>
    </>
  );
}
