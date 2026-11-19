import { Outlet, ScrollRestoration, useMatches } from 'react-router';
import { Seo, type SeoHandle } from '@/components/provider/seo';

const DEFAULT_SEO = {
  title: 'Oja Hub',
  description: 'Trade with ease, connect with customers',
};

export default function Root() {
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const seo = (lastMatch?.handle as SeoHandle | undefined)?.seo ?? DEFAULT_SEO;
  return (
    <>
      <Seo {...seo} />
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

// export default function DashboardLayout() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const matches = useMatches();
//   const lastMatch = matches.at(-1);
//   const seo = (lastMatch?.handle as SeoHandle | undefined)?.seo ?? DEFAULT_SEO;

//   return (
//     <>
//       <Seo {...seo} />
//       <ScrollRestoration />
//       <div className="min-h-screen bg-background-main">
//         <Sidebar
//           collapsed={collapsed}
//           onToggle={() => setCollapsed((current) => !current)}
//           mobileOpen={mobileMenuOpen}
//           onMobileClose={() => setMobileMenuOpen(false)}
//         />

//         <div
//           className={`flex min-w-0 flex-col transition-all duration-300 ${
//             collapsed ? 'lg:ml-[80px]' : 'lg:ml-[18%] md:ml-[18%]'
//           }`}
//         >
//           <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

//           <main className="flex-1 p-4 sm:p-6 lg:p-8">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }
