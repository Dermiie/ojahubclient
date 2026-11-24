import { Outlet } from 'react-router';
import Sidebar from '@/components/dashboard/sidebar';
import Navbar from '@/components/dashboard/navbar';
import { useState } from 'react';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-main">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={`flex min-w-0 flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-[80px]' : 'lg:ml-[18%] md:ml-[18%]'
        }`}
      >
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
