import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Outlet } from 'react-router';

export default function Onboarding() {
  // const location = useLocation();
  return (
    <div className=" min-h-screen gap-4 items-center container w-10/12 mx-auto text-b2-regular">
      <div className="flex justify-between py-4">
        <div className="h-16 w-40 hidden md:block">
          <img src="/ojahub.jpg" className="size-full" />
        </div>
        <div className="md:hidden">
          <ArrowLeft className="text-text-secondary"></ArrowLeft>
        </div>
        <Button>Finish later</Button>
      </div>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
