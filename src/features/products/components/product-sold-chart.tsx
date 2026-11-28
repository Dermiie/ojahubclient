// The Sold this week card on the Product details page: the totals and a small bar chart.
import type { Product } from "../types";

export default function ProductSoldChart({ product }: { product: Product }) {
  const sales = product.weeklySales;
  // no sales data, no card
  if (!sales) return null;

  // the total sold this week
  const total = sales.days.reduce((sum, day) => sum + day.quantity, 0);
  // the biggest day, so the tallest bar fills the chart
  const max = Math.max(...sales.days.map((day) => day.quantity));
  // the best day before today gets the medium green
  const earlier = sales.days.slice(0, -1);
  const best = Math.max(...earlier.map((day) => day.quantity));
  const bestIndex = earlier.findIndex((day) => day.quantity === best);

  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-border-subtle px-[19.48px] py-[17.85px] lg:flex">
        {/* title and totals */}
        <div className="flex flex-col gap-[3.25px]">
          <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
            Sold this week
          </span>
          <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            {total} {product.unit}s · ₦{sales.revenue.toLocaleString()}
          </span>
        </div>

        {/* the chart: a bar and a day label in each column */}
        <div className="flex h-[146.07px] justify-between pb-[12.57px] pl-[11.8px] pr-[15.17px]">
          {sales.days.map((day, index) => {
            // today is dark, the best earlier day is medium, the rest are light
            const color =
              index === sales.days.length - 1
                ? "bg-[#12432A]"
                : index === bestIndex
                  ? "bg-[#6FB58D]"
                  : "bg-[#CDE7D8]";

            return (
              <div key={day.day} className="flex flex-col items-center">
                <div className="flex h-[111.71px] items-end">
                  <div
                    className={`w-[43.84px] rounded-[12.98px] ${color}`}
                    style={{ height: `${(day.quantity / max) * 64.45}px` }}
                  />
                </div>
                <span className="mt-[5.79px] text-[12px] leading-[16px] tracking-[-0.02em] text-text-secondary">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* mobile view */}
      <div className="flex flex-col gap-[10px] rounded-[24px] border border-border-default p-4 lg:hidden">
        {/* title and the total */}
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Sold this week
          </span>
          <span className="text-[22px] font-bold leading-[1.3] text-text-primary">
            {total} {product.unit}s
          </span>
        </div>

        {/* the chart: a bar and a one letter day label in each column */}
        <div className="flex h-[90px] justify-between px-[7.31px]">
          {sales.days.map((day, index) => {
            const isToday = index === sales.days.length - 1;
            // today is dark, the best earlier day is medium, the rest are light
            const color = isToday
              ? "bg-[#12432A]"
              : index === bestIndex
                ? "bg-[#6FB58D]"
                : "bg-[#CDE7D8]";

            return (
              <div
                key={day.day}
                className="flex w-[31.09px] flex-col items-center justify-end pb-[1.83px]"
              >
                <div
                  className={`w-full rounded-[9.2px] ${color}`}
                  style={{ height: `${(day.quantity / max) * 57.6}px` }}
                />
                <span
                  className={`text-[10px] font-medium leading-[1.3] tracking-[-0.02em] ${
                    isToday ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {day.day[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
