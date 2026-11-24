import { useLogout } from '@/api/auth/authApi';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Navbar() {
  const { mutate: logOut } = useLogout();
  const navigate = useNavigate();

  return (
    <header className="hidden lg:flex h-[80px] w-full shrink-0 items-center justify-between border-b border-border-default bg-white px-4 sm:px-6 lg:px-8">
      {/* Desktop Search */}
      <div className="flex h-[42px] w-[min(48vw,350px)] min-w-0 items-center gap-2 rounded-lg bg-gray-100 px-3 text-icon-grey sm:gap-3">
        <Search size={18} className="shrink-0 text-icon-grey" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-text-tertiary"
        />
      </div>

      {/* Right Section */}
      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Logout */}
        <button
          onClick={() => {
            logOut(undefined, {
              onSettled: () => navigate('/auth/login', { replace: true }),
            });
          }}
        >
          logout
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="rounded-[5px] border bg-white p-[3px]"
        >
          <Bell size={21} className="text-icon-grey" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white sm:h-10 sm:w-10">
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