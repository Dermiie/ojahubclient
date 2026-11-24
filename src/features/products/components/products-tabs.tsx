// The three tabs under the title. Full width on mobile, small on desktop.
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
    <nav className="flex w-full items-center rounded-[39px] bg-primary-subtle p-[4.13px] lg:inline-flex lg:w-auto lg:self-start">
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          className={
            active === tab.label
              ? "flex h-[41.34px] flex-1 items-center justify-center rounded-[25px] bg-primary-base px-[18.6px] text-[14px] font-semibold tracking-[-0.02em] text-text-inverse lg:flex-none"
              : "flex h-[41.34px] flex-1 items-center justify-center rounded-[25px] px-[18.6px] text-[14px] font-medium tracking-[-0.02em] text-text-secondary lg:flex-none"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
