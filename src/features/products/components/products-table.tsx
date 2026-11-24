// The products table: the header row, then one row for each product. On mobile it is a card for each product instead.
import { Link } from "react-router";
import { LOCATIONS } from "../data/sample-data";
import type { Product } from "../types";

const COLUMNS =
  "grid grid-cols-[338.281fr_131.778fr_86.849fr_128.47fr_119.323fr_75.708fr_226.482fr]";

const HEAD =
  "border-b-[1.034px] border-border-subtle text-[14px] font-semibold tracking-[-0.02em] text-text-secondary";
const HEAD_RIGHT = `${HEAD} p-[12.403px] text-right`;
const HEAD_LEFT = `${HEAD} px-[24.805px] py-[12.403px] text-left`;

const CELL = "border-b-[1.034px] border-border-subtle";
const NUMBER = `${CELL} px-[12.403px] pt-[25.32px] pb-[24.29px] text-right text-[16px] leading-[1.3] tracking-[-0.02em]`;
const BADGE =
  "inline-flex items-center gap-[6.2px] rounded-full px-[10.34px] py-[5.17px] text-[14px] font-semibold leading-[1.3] tracking-[-0.02em]";

// the total stock of a product across all locations
function getTotal(product: Product) {
  return Object.values(product.stock).reduce((a, b) => a + b, 0);
}

// first location where stock is above 0 but under the low-stock level
function getLowAt(product: Product) {
  return LOCATIONS.find((location) => {
    const qty = product.stock[location.id] ?? 0;
    return qty > 0 && qty < product.lowStockLevel;
  });
}

export default function ProductsTable({ products }: { products: Product[] }) {
  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col overflow-hidden rounded-[28.94px] border-[1.03px] border-background-muted pt-[6.2px] lg:flex">
        <div className={COLUMNS}>
          <div className={HEAD_LEFT}>Product</div>
          <div className={HEAD_RIGHT}>Retail price</div>
          {LOCATIONS.map((location) => (
            <div key={location.id} className={HEAD_RIGHT}>
              {location.shortName}
            </div>
          ))}
          <div className={HEAD_RIGHT}>Total</div>
          <div className={HEAD_LEFT}>Status</div>
        </div>

        {products.map((product) => {
          const total = getTotal(product);
          const lowAt = getLowAt(product);

          // the whole row is a link to that product's page
          return (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={`${COLUMNS} hover:bg-background-card [&:last-child>*]:border-b-0`}
            >
              {/* product */}
              <div
                className={`${CELL} flex items-center gap-[12.4px] px-[24.805px] py-[12.4px]`}
              >
                <img
                  src={product.image}
                  alt=""
                  className="size-[45.48px] shrink-0 rounded-[13.44px] object-cover"
                />
                <div className="flex flex-col gap-[2.07px]">
                  <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-[#101A14]">
                    {product.name}
                  </span>
                  <span className="text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                    per {product.unit}
                  </span>
                </div>
              </div>

              {/* price */}
              <div className={`${NUMBER} font-medium text-text-primary`}>
                ₦{product.retailPrice.toLocaleString()}
              </div>

              {/* stock at each location */}
              {LOCATIONS.map((location) => {
                const qty = product.stock[location.id] ?? 0;
                const isLow = qty > 0 && qty < product.lowStockLevel;
                return (
                  <div
                    key={location.id}
                    className={`${NUMBER} ${isLow ? "font-medium text-[#CC5500]" : "font-normal text-text-primary"}`}
                  >
                    {qty > 0 ? qty : "—"}
                  </div>
                );
              })}

              {/* total */}
              <div className={`${NUMBER} font-medium text-text-primary`}>
                {total}
              </div>

              {/* status */}
              <div className={`${CELL} flex items-center px-[24.805px]`}>
                {lowAt ? (
                  <span className={`${BADGE} bg-[#FBEDE3] text-[#CC5500]`}>
                    <span className="size-[6.2px] rounded-full bg-[#CC5500]" />
                    Low at {lowAt.shortName}
                  </span>
                ) : (
                  <span
                    className={`${BADGE} bg-success-light text-success-base`}
                  >
                    <span className="size-[6.2px] rounded-full bg-success-base" />
                    Healthy
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* mobile view: one card for each product */}
      <div className="flex flex-col gap-[10px] lg:hidden">
        {products.map((product) => {
          const total = getTotal(product);
          const lowAt = getLowAt(product);

          // "Stall 3: 15 · Warehouse: 85", only the locations that have stock
          const stockLine = LOCATIONS.filter(
            (location) => (product.stock[location.id] ?? 0) > 0,
          )
            .map(
              (location) =>
                `${location.mobileName ?? location.shortName}: ${product.stock[location.id]}`,
            )
            .join(" · ");

          // the whole card is a link to that product's page
          return (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="flex items-center gap-3 rounded-[22px] border border-border-default p-3"
            >
              {/* photo */}
              <img
                src={product.image}
                alt=""
                className="size-14 shrink-0 rounded-[16px] object-cover"
              />

              {/* name, price and stock */}
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
                  {product.name}
                </span>
                <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                  ₦{product.retailPrice.toLocaleString()} / {product.unit}
                </span>
                <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                  {stockLine}
                </span>
              </div>

              {/* total and status on the right */}
              <div className="flex shrink-0 flex-col items-end gap-[5px]">
                <span className="text-[18px] font-bold leading-[1.3] text-text-primary">
                  {total}
                </span>
                {lowAt ? (
                  <span className="rounded-full bg-[#FBEDE3] px-2 py-[3px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#853700]">
                    Low at {lowAt.shortName}
                  </span>
                ) : (
                  <span className="rounded-full bg-success-light px-2 py-[3px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#14733A]">
                    Healthy
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}