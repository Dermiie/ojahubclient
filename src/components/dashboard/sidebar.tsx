import { NavLink } from "react-router";

import {
  House,
  FileText,
  Users,
  Package,
  MapPin,
  ArrowLeftRight,
  CreditCard,
  Settings,
  CalendarDays,
  PanelLeftClose,
  Tags,
  Bell,
  Search,
  ChevronRight,
  CircleHelp,
  LogOut,
  Plus,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Overview",
    items: [{ label: "Home", path: "/", icon: House }],
  },
  {
    title: "Sell",
    items: [
      { label: "Invoices", path: "/invoices", icon: FileText },
      { label: "Customers", path: "/customers", icon: Users },
    ],
  },
  {
    title: "Stocks",
    items: [
      { label: "Products", path: "/products", icon: Package },
      { label: "Locations", path: "/locations", icon: MapPin },
      { label: "Transfer", path: "/transfers", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Money",
    items: [
      { label: "Payments", path: "/payments", icon: CreditCard },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

const mobileNavigationGroups = [
  {
    title: "Sell",
    items: [
      {
        label: "Invoices",
        description: "2 waiting for transfer",
        icon: FileText,
        path: "/invoices",
      },
      {
        label: "Customers",
        description: "8 owe you ₦1.24m",
        icon: Users,
        path: "/customers",
      },
      {
        label: "Payments",
        description: "₦486,500 received today",
        icon: CreditCard,
        path: "/payments",
      },
    ],
  },
  {
    title: "Stock",
    items: [
      {
        label: "Stock",
        description: "Products, locations and transfers",
        icon: Package,
        path: "/products",
      },
      {
        label: "Price profiles",
        description: "Retail · Semi-wholesale · Bulk",
        icon: Tags,
        path: "/products",
      },
    ],
  },
  {
    title: "Alerts",
    items: [
      {
        label: "Notifications",
        description: "Payments, stock arrivals, low stock",
        icon: Bell,
        path: "/dashboard",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Settings",
        description: "Business, billing, payout and security",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
};

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen shrink-0 flex-col gap-7 border-r border-border-default bg-white pt-7 pb-6 transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-[80px] px-2" : "w-[260px] px-[14px]"
        }`}
      >
        {/* BRAND */}
        <div
          className={`flex h-10 shrink-0 items-center ${
            collapsed ? "justify-center" : "justify-between px-3"
          }`}
        >
          {!collapsed && (
            <img
              src="/src/assets/logo/Logo-forgot password.svg"
              alt="ojahub logo"
              className="h-[39.86px] w-[106px] object-contain"
            />
          )}

          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default text-text-secondary transition-colors hover:bg-gray-100"
          >
            <PanelLeftClose
              size={18}
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="flex w-full flex-col gap-5">
          {navigationGroups.map((group) => (
            <div key={group.title} className="flex w-full flex-col gap-2">
              {!collapsed && (
                <h2 className="px-[13px] text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  {group.title}
                </h2>
              )}

              <div className="flex w-full flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex h-[38px] w-full shrink-0 items-center rounded-[9px] text-[14px] font-medium transition-all duration-200 ${
                          collapsed
                            ? "justify-center px-0"
                            : "justify-start gap-[11px] px-[14px]"
                        } ${
                          isActive
                            ? "bg-primary-base text-white"
                            : "bg-white text-text-primary hover:bg-primary-subtle hover:text-text-secondary"
                        }`
                      }
                    >
                      <Icon size={18} strokeWidth={1.8} className="shrink-0" />

                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* YEARLY PLAN */}
        {!collapsed && (
          <div className="mt-auto flex h-[88px] w-full shrink-0 flex-col gap-3 rounded-xl bg-[#F8F1E8] px-[10px] py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#8A5A33]" />

                <span className="text-sm font-semibold text-text-primary">
                  Yearly Plan
                </span>
              </div>

              <span className="text-xs font-semibold text-[#8A5A33]">
                -- days left
              </span>
            </div>

            <div className="h-[5px] w-full rounded-full border border-[#8A5A33] bg-[#8A5A33]" />

            <button className="text-left text-xs font-semibold text-[#8A5A33] hover:underline">
              Manage plan
            </button>
          </div>
        )}
      </aside>

      {/* MOBILE AND TABLET NAVIGATION */}
      <div className="lg:hidden">
        {/* BACKGROUND OVERLAY */}
        <button
          aria-label="Close navigation"
          onClick={onMobileClose}
          className={`fixed inset-x-0 top-0 bottom-[82px] z-40 bg-black/40 transition-opacity duration-300 ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }`}
        />

        {/* EXPANDABLE MENU */}
        <aside
          aria-hidden={!mobileOpen}
          className={`fixed bottom-[82px] left-0 z-40 flex h-[75dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border-default bg-white px-3 pt-4 pb-4 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-[110%] opacity-0"
          }`}
        >
          {/* PROFILE HEADER */}
          <div className="mb-4 flex shrink-0 items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-base text-sm font-semibold text-white">
                AO
              </div>

              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Anthony Omeh
                </h2>

                <p className="text-xs text-text-secondary">
                  Owner · Organization name
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-4 flex h-10 shrink-0 items-center gap-3 rounded-xl bg-gray-100 px-3">
            <Search size={17} className="text-icon-grey" />

            <input
              type="text"
              placeholder="Search products, customers, invoices"
              className="w-full bg-transparent text-xs outline-none placeholder:text-text-secondary"
            />
          </div>

          {/* NAVIGATION GROUPS */}
          <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain">
            {mobileNavigationGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-[11px] font-medium text-text-secondary">
                  {group.title}
                </h3>

                <div className="rounded-2xl bg-gray-100 px-3">
                  {group.items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onMobileClose}
                        className={`flex items-center gap-3 py-3 ${
                          index !== group.items.length - 1
                            ? "border-b border-border-default"
                            : ""
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-base">
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {item.label}
                          </p>

                          <p className="truncate text-[10px] text-text-secondary">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          className="shrink-0 text-icon-grey"
                        />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* SUPPORT */}
            <div>
              <h3 className="mb-2 text-[11px] font-medium text-text-secondary">
                Support
              </h3>

              <div className="rounded-2xl bg-gray-100 px-3">
                <button className="flex w-full items-center gap-3 border-b border-border-default py-3 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                    <CircleHelp size={17} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">Help and support</p>

                    <p className="text-[10px] text-text-secondary">
                      Questions, guides and contact
                    </p>
                  </div>

                  <ChevronRight size={17} />
                </button>

                <button className="flex w-full items-center gap-3 py-3 text-left text-red-500">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                    <LogOut size={17} />
                  </div>

                  <span className="text-sm font-medium">Log out</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* FIXED MOBILE BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-0 z-50 h-[82px] w-full lg:hidden">
          {/* CURVED NAVIGATION BACKGROUND */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 82"
            preserveAspectRatio="none"
          >
            <defs>
              <filter
                id="navShadow"
                x="-10%"
                y="-50%"
                width="120%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            <path
              d="M0 1 H135 C145 1 153 8 160 16 C170 29 181 30 200 30 C219 30 230 29 240 16 C247 8 255 1 265 1 H400 V82 H0 Z"
              fill="#000000"
              opacity="0.08"
              filter="url(#navShadow)"
            />

            <path
              d="M0 0 H135 C145 0 153 7 160 15 C170 28 181 29 200 29 C219 29 230 28 240 15 C247 7 255 0 265 0 H400 V82 H0 Z"
              fill="white"
            />
          </svg>

          {/* NAVIGATION ITEMS */}
          <div className="relative z-10 flex h-full items-center justify-around px-2">
            {/* HOME */}
            <NavLink
              to="/"
              end
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 text-xs ${
                  isActive ? "text-primary-base" : "text-[#9AA6A2]"
                }`
              }
            >
              <House size={23} />
              <span>Home</span>
            </NavLink>

            {/* INVOICES */}
            <NavLink
              to="/invoices"
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 text-xs ${
                  isActive ? "text-primary-base" : "text-[#9AA6A2]"
                }`
              }
            >
              <FileText size={23} />
              <span>Invoices</span>
            </NavLink>

            {/* CENTRAL PLUS */}
            <div className="flex flex-1 justify-center">
              <button
                onClick={() => (mobileOpen ? onMobileClose() : onMobileOpen())}
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileOpen}
                className="absolute -top-[42px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#2D9360] text-white shadow-lg transition-transform duration-300 active:scale-95"
              >
                <Plus
                  size={32}
                  className={`transition-transform duration-500 ${
                    mobileOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </div>

            {/* PRODUCTS */}
            <NavLink
              to="/products"
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 text-xs ${
                  isActive ? "text-primary-base" : "text-[#9AA6A2]"
                }`
              }
            >
              <Package size={23} />
              <span>Products</span>
            </NavLink>

            {/* CUSTOMERS */}
            <NavLink
              to="/customers"
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 text-xs ${
                  isActive ? "text-primary-base" : "text-[#9AA6A2]"
                }`
              }
            >
              <Users size={23} />
              <span>Customers</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}
