// Top of the Product details page: the back button, the label, the name and the two buttons.
import { Link } from "react-router";
import backIcon from "../assets/icons/back.svg";
import editIcon from "../assets/icons/edit.svg";
import addIcon from "../assets/icons/add.svg";
import { Button } from "@/components/ui/button";

export default function ProductDetailsHeader({ name }: { name: string }) {
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
              {name}
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
    </>
  );
}
