// The Opening stock card on the Add product form: a counter for each location and the total.
import shopIcon from "../assets/icons/shop.svg";
import warehouseBoxIcon from "../assets/icons/warehouse-box.svg";
import minusIcon from "../assets/icons/minus.svg";
import plusSmallIcon from "../assets/icons/plus-small.svg";

// the locations from the design, sample data until the backend gives the real ones
const LOCATION_ROWS = [
  {
    id: "stall-3",
    name: "Balogun Stall 3",
    type: "Shop · main",
    warehouse: false,
  },
  {
    id: "maza-maza",
    name: "Maza Maza Warehouse",
    type: "Warehouse",
    warehouse: true,
  },
  {
    id: "trade-fair",
    name: "Trade Fair Shop B12",
    type: "Shop",
    warehouse: false,
  },
];

// the numbers when the form is empty, every location starts at 0
export const EMPTY_STOCK: Record<string, number> = {
  "stall-3": 0,
  "maza-maza": 0,
  "trade-fair": 0,
};

// the page gives us the unit, the numbers and a way to change one
type Props = {
  unit: string;
  quantities: Record<string, number>;
  onChange: (id: string, amount: number) => void;
};

export default function AddProductOpeningStock({
  unit,
  quantities,
  onChange,
}: Props) {
  // the total across all locations
  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-[#E3E7E5] px-[19.48px] py-[17.85px] lg:flex">
        {/* title and subtitle */}
        <div className="flex flex-col gap-[3.25px]">
          <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
            Opening stock
          </h2>
          <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            How many you have right now at each location
          </p>
        </div>

        {/* one row for each location */}
        <div className="flex flex-col gap-3">
          {LOCATION_ROWS.map((row, index) => (
            <div
              key={row.id}
              className={`flex items-center justify-between py-2 ${
                index < LOCATION_ROWS.length - 1
                  ? "border-b border-[#E3E7E5]"
                  : ""
              }`}
            >
              {/* icon, name and type */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-9 items-center justify-center rounded-[10.29px] ${
                    row.warehouse ? "bg-[#F8F1E8]" : "bg-primary-subtle"
                  }`}
                >
                  <img
                    src={row.warehouse ? warehouseBoxIcon : shopIcon}
                    alt=""
                    className="size-[22.28px]"
                  />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
                    {row.name}
                  </span>
                  <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                    {row.type}
                  </span>
                </div>
              </div>

              {/* the counter: minus, number, plus */}
              <div className="flex items-center gap-[17.25px] rounded-[9px] bg-background-card p-[3px]">
                <button
                  type="button"
                  aria-label={`Take one away from ${row.name}`}
                  onClick={() => onChange(row.id, -1)}
                  className="flex size-[30px] items-center justify-center rounded-[9px] bg-background-main"
                >
                  <img src={minusIcon} alt="" className="size-[15px]" />
                </button>
                <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                  {quantities[row.id]}
                </span>
                <button
                  type="button"
                  aria-label={`Add one to ${row.name}`}
                  onClick={() => onChange(row.id, 1)}
                  className="flex size-[30px] items-center justify-center rounded-[9px] bg-primary-base"
                >
                  <img src={plusSmallIcon} alt="" className="size-[15px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* the total bar */}
        <div className="flex items-center justify-between rounded-[12px] bg-[#F8F1E8] px-[10px] py-3">
          <span className="text-[14px] leading-[1.3] tracking-[-0.02em] text-[#8A5A33]">
            Total
          </span>
          <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#4E331C]">
            {total} {unit}s
          </span>
        </div>
      </div>

      {/* mobile view: a tighter card, no icon boxes */}
      <div className="flex flex-col gap-3 rounded-[11.041px] border-[0.394px] border-[#E3E7E5] px-[9.464px] py-[8.675px] lg:hidden">
        {/* title and subtitle */}
        <div className="flex flex-col gap-[1.577px]">
          <h2 className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Opening stock
          </h2>
          <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            How many you have right now at each location
          </p>
        </div>

        {/* one row for each location */}
        <div className="flex flex-col gap-3">
          {LOCATION_ROWS.map((row, index) => (
            <div
              key={row.id}
              className={`flex items-center justify-between py-[3.887px] ${
                index < LOCATION_ROWS.length - 1
                  ? "border-b-[0.486px] border-[#E3E7E5]"
                  : ""
              }`}
            >
              {/* name and type */}
              <div className="flex flex-col gap-[0.972px]">
                <span className="text-[14px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                  {row.name}
                </span>
                <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                  {row.type}
                </span>
              </div>

              {/* the counter: minus, number, plus */}
              <div className="flex h-[34px] w-[102.691px] shrink-0 items-center justify-center gap-[16.292px] rounded-[8.5px] bg-background-card p-[2.833px]">
                <button
                  type="button"
                  aria-label={`Take one away from ${row.name}`}
                  onClick={() => onChange(row.id, -1)}
                  className="flex items-center rounded-[8.5px] bg-background-main p-[7.083px]"
                >
                  <img src={minusIcon} alt="" className="size-[14.167px]" />
                </button>
                <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                  {quantities[row.id]}
                </span>
                <button
                  type="button"
                  aria-label={`Add one to ${row.name}`}
                  onClick={() => onChange(row.id, 1)}
                  className="flex items-center rounded-[8.5px] bg-primary-base p-[7.083px]"
                >
                  <img src={plusSmallIcon} alt="" className="size-[14.167px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* the total bar */}
        <div className="flex items-center justify-between rounded-[5.831px] bg-[#F8F1E8] px-[4.859px] py-[5.831px]">
          <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-[#8A5A33]">
            Total
          </span>
          <span className="text-[14px] font-medium leading-[1.3] tracking-[-0.02em] text-[#4E331C]">
            {total} {unit}s
          </span>
        </div>
      </div>
    </>
  );
}
