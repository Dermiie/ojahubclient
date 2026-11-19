import { NavLink } from 'react-router';
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
  X,
  Search,
  ChevronRight,
  CircleHelp,
  LogOut,
} from 'lucide-react';

const navigationGroups = [
  {
    title: 'Overview',
    items: [{ label: 'Home', path: '/', icon: House }],
  },
  {
    title: 'Sell',
    items: [
      { label: 'Invoices', path: '/invoices', icon: FileText },
      { label: 'Customers', path: '/customers', icon: Users },
    ],
  },
  {
    title: 'Stocks',
    items: [
      { label: 'Products', path: '/products', icon: Package },
      { label: 'Locations', path: '/locations', icon: MapPin },
      { label: 'Transfer', path: '/transfers', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'Payments', path: '/payments', icon: CreditCard },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];
const mobileNavigationGroups = [
  {
    title: 'Sell',
    items: [
      {
        label: 'Invoices',
        description: '2 waiting for transfer',
        icon: FileText,
        path: '/invoices',
      },
      {
        label: 'Customers',
        description: '8 owe you ₦1.24m',
        icon: Users,
        path: '/customers',
      },
      {
        label: 'Payments',
        description: '₦486,500 received today',
        icon: CreditCard,
        path: '/payments',
      },
    ],
  },
  {
    title: 'Stock',
    items: [
      {
        label: 'Stock',
        description: 'Products, locations and transfers',
        icon: Package,
        path: '/products',
      },
      {
        label: 'Price profiles',
        description: 'Retail · Semi-wholesale · Bulk',
        icon: Tags,
        path: '/products',
      },
    ],
  },
  {
    title: 'Alerts',
    items: [
      {
        label: 'Notifications',
        description: 'Payments, stock arrivals, low stock',
        icon: Bell,
        path: '/dashboard',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Settings',
        description: 'Business, billing, payout and security',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`hidden lg:flex md:flex fixed left-0 top-0 z-40 h-screen shrink-0 flex-col gap-7 border-r border-border-default bg-white px-[14px] pt-7 pb-6 transition-all duration-300 ${
          collapsed ? 'w-[80px]' : 'w-[18%]'
        }`}
      >
        {/* Brand */}
        <div className="px-3 flex justify-between items-center">
          {!collapsed && (
            <img
              src="/src/assets/logo/Logo-forgot password.svg"
              alt="ojahub logo"
              className="lg:w-[106px] md:w-[90px] h-[39.86px]"
            />
          )}
          <button onClick={onToggle} className="border p-[3px] rounded-[5px]">
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex w-full flex-col gap-5">
          {navigationGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              {!collapsed && (
                <h2 className="px-[13px] text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  {group.title}
                </h2>
              )}

              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex h-[30px] w-full items-center gap-[11px] rounded-[9px] px-[14px] text-[14px] font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-base text-white'
                            : 'bg-white text-text-primary hover:bg-primary-subtle hover:text-text-secondary'
                        }`
                      }
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Yearly Plan */}
        {!collapsed && (
          <div className="mt-[40px] flex h-[88px] w-full flex-col gap-3 rounded-xl bg-[#F8F1E8] px-[10px] py-3">
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
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Background overlay */}
          <button
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/40"
          />

          {/* Mobile menu */}
          <aside className="absolute bottom-0 left-0 flex h-[85vh] w-full flex-col overflow-hidden rounded-t-[24px] border border-border-default bg-white px-3 pt-3 pb-6 shadow-xl">
            {/* Profile header */}
            <div className="mb-4 flex items-center justify-between px-1">
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

              <button
                onClick={onMobileClose}
                aria-label="Close menu"
                className="rounded-full bg-gray-100 p-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4 flex h-10 shrink-0 items-center gap-3 rounded-xl bg-gray-100 px-3">
              <Search size={17} className="text-icon-grey" />

              <input
                type="text"
                placeholder="Search products, customers, invoices"
                className="w-full bg-transparent text-xs outline-none placeholder:text-text-secondary"
              />
            </div>

            {/* Navigation */}
            <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto">
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
                              ? 'border-b border-border-default'
                              : ''
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

              {/* Support */}
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
        </div>
      )}
    </>
  );
}
