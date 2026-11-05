import { Outlet } from 'react-router';

export default function AuthLayout() {
  // const location = useLocation();
  return (
    <div className="grid grid-cols-2 min-h-screen gap-4 items-center">
      <div></div>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
