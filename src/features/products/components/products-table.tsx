// The products table: the header row, then one row for each product.
import { LOCATIONS, SAMPLE_PRODUCTS } from "../data/sample-data";

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

export default function ProductsTable() {
  return (
    <div className="flex flex-col rounded-[28.94px] border-[1.03px] border-background-muted pt-[6.2px]">
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

      {SAMPLE_PRODUCTS.map((product) => {
        const total = Object.values(product.stock).reduce((a, b) => a + b, 0);

        // first location where stock is above 0 but under the low-stock level
        const lowAt = LOCATIONS.find((location) => {
          const qty = product.stock[location.id] ?? 0;
          return qty > 0 && qty < product.lowStockLevel;
        });

        return (
          <div
            key={product.id}
            className={`${COLUMNS} [&:last-child>*]:border-b-0`}
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
                <span className={`${BADGE} bg-success-light text-success-base`}>
                  <span className="size-[6.2px] rounded-full bg-success-base" />
                  Healthy
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
