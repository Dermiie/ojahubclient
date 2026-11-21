// The three tabs under the title.
import { Link } from "react-router";

const TABS = [
  { label: "Products", to: "/products" },
  { label: "Locations", to: "/locations" },
  { label: "Transfers", to: "/transfers" },
];

export default function ProductsTabs({
  active = "Products",
}: {
  active?: string;
}) {
  return (
    <nav className="inline-flex items-center self-start rounded-[39px] bg-primary-subtle p-[4.13px]">
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          className={
            active === tab.label
              ? "flex h-[41.34px] items-center rounded-[25px] bg-primary-base px-[18.6px] text-[14px] font-semibold tracking-[-0.02em] text-text-inverse"
              : "flex h-[41.34px] items-center rounded-[25px] px-[18.6px] text-[14px] font-medium tracking-[-0.02em] text-text-secondary"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
