// The Opening stock list on the mobile Edit page: just shows the numbers, no changing here.
import { LOCATIONS } from "../data/sample-data";

type Props = {
  unit: string;
  // how many are in each location, for example { "stall-3": 15 }
  stock: Record<string, number>;
};

export default function EditProductStock({ unit, stock }: Props) {
  // only the locations that have some stock
  const rows = Object.entries(stock).filter(([, amount]) => amount > 0);

  return (
    // mobile only, the desktop design does not have this
    <div className="mt-6 flex flex-col gap-[10px] lg:hidden">
      <h2 className="text-[16px] font-medium leading-[1.3] text-text-primary">
        Opening stock
      </h2>

      {/* one box for each location */}
      {rows.map(([id, amount]) => (
        <div
          key={id}
          className="flex items-center justify-between rounded-[18px] border border-border-default px-[14px] py-3 text-[16px] font-medium leading-[1.3] text-text-primary"
        >
          {/* the full name from the locations list */}
          <span>{LOCATIONS.find((place) => place.id === id)?.name ?? id}</span>
          <span>
            {amount} {unit}s
          </span>
        </div>
      ))}

      {/* the note, the link will go to the Add or adjust stock page later */}
      <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
        To change counts later, use{" "}
        <span className="font-medium text-[#257349]">Add or adjust stock</span>{" "}
        so every change is recorded.
      </p>
    </div>
  );
}