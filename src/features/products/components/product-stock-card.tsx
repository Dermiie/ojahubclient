// The Stock by location card on the Product details page: the total and a row for each location.
import stallIcon from "../assets/icons/stall.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import truckIcon from "../assets/icons/truck.svg";
import { Button } from "@/components/ui/button";
import { LOCATIONS } from "../data/sample-data";
import type { Product } from "../types";

export default function ProductStockCard({ product }: { product: Product }) {
  // the total stock across all locations
  const total = Object.values(product.stock).reduce((a, b) => a + b, 0);
  // only the locations that have stock
  const locations = LOCATIONS.filter(
    (location) => (product.stock[location.id] ?? 0) > 0,
  );

  return (
    <div className="flex flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-border-subtle px-[19.48px] py-[17.85px]">
      {/* title, total and the move stock button */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[3.25px]">
          <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
            Stock by location
          </span>
          <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            {total} {product.unit}s in total
          </span>
        </div>
        <Button
          variant="outline"
          className="h-[40px] gap-1.5 rounded-[30px] border-border-default bg-background-main px-3 py-2.5 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary"
        >
          <img src={truckIcon} alt="" className="size-5" />
          Move stock
        </Button>
      </div>

      {/* one row for each location */}
      <div className="flex flex-col gap-[9.74px]">
        {locations.map((location) => {
          const qty = product.stock[location.id];
          // low means some stock, but less than the low level
          const isLow = qty < product.lowStockLevel;
          // how full the bar is, in percent
          const bar = product.stockBars?.[location.id] ?? (qty / total) * 100;
          const note = product.stockNotes?.[location.id];

          return (
            <div
              key={location.id}
              className={`flex flex-col gap-[6.49px] rounded-[16.23px] p-[12.98px] ${
                isLow ? "bg-[#FBF2E2]" : "bg-background-card"
              }`}
            >
              {/* icon, name and the number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[6.49px]">
                  <img
                    src={
                      location.id === "maza-maza" ? warehouseIcon : stallIcon
                    }
                    alt=""
                    className="size-[12.98px]"
                  />
                  <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
                    {location.name}
                  </span>
                </div>
                <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                  {qty}
                </span>
              </div>

              {/* the bar */}
              <div className="h-[6.49px] rounded-[3.25px] bg-background-main">
                <div
                  className={`h-full rounded-[3.25px] ${
                    isLow ? "bg-[#D28A01]" : "bg-primary-base"
                  }`}
                  style={{ width: `${bar}%` }}
                />
              </div>

              {/* the note, only if there is one */}
              {note && (
                <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-[#946409]">
                  {note}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
