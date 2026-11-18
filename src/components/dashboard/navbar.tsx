import { Search, Bell, ChevronDown, SearchIcon, Menu } from "lucide-react";
type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="flex h-[80px] w-full shrink-0 items-center justify-between border-b border-border-default bg-white px-4 sm:px-6 lg:px-8">
      {/* Desktop Search */}
      <div className="hidden h-[42px] w-[min(48vw,350px)] min-w-0 items-center gap-2 rounded-lg bg-gray-100 px-3 text-icon-grey md:flex sm:gap-3">
        <Search size={18} className="shrink-0 text-icon-grey" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-text-tertiary"
        />
      </div>
{/* Mobile Menu */}
<button
  aria-label="Open navigation"
  onClick={onMenuClick}
  className="rounded-full border p-[5px] md:hidden bg-gray-100"
>
  <Menu size={24} className="text-black" />
</button>

{/* Right Section */}
<div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">

  {/* Mobile Search */}
  <button
    aria-label="Search"
    className="rounded-full border p-[5px] md:hidden"
  >
    <SearchIcon size={24} className="md:text-icon-grey text-black" />
  </button>

  {/* Notifications */}
  <button
    aria-label="Notifications"
    className="md:rounded-[5px] rounded-[100%] border md:p-[3px] p-[6px] md:bg-white bg-black"
  >
    <Bell size={21} className="md:text-icon-grey text-white" />
  </button>

  {/* User Profile */}
  <button className="flex items-center gap-2 sm:gap-3">
    <div className="md:flex hidden h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white sm:h-10 sm:w-10">
      AO
    </div>

    <div className="hidden flex-col items-start md:flex">
      <span className="text-sm font-semibold text-text-primary">
        Anthony Omeh
      </span>
      <span className="text-xs text-text-secondary">
        Organization name
      </span>
    </div>

    <ChevronDown size={18} className="hidden text-icon-grey md:block" />
  </button>
</div>
    </header>
  );
}