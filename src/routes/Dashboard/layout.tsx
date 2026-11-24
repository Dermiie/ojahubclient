import { Outlet } from 'react-router';
import { useState } from 'react';

import Sidebar from '@/components/dashboard/sidebar';
import Navbar from '@/components/dashboard/navbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-main">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        mobileOpen={mobileMenuOpen}
        onMobileOpen={() => setMobileMenuOpen(true)}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={`flex min-w-0 flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
        }`}
      >
        <Navbar />

        <main className="px-3 py-4 pb-28 sm:px-5 sm:py-6 lg:pb-6 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}