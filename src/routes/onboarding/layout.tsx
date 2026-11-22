import { useLogout } from '@/api/auth/authApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export default function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: logOut } = useLogout();
  return (
    <div className=" min-h-screen gap-4 items-center container w-10/12 mx-auto text-b2-regular">
      {location.pathname !== '/onboarding/expired' && (
        <div className="flex justify-between items-center py-4">
          <div className="h-16 w-40 hidden md:block">
            <img src="/ojahub.jpg" className="size-full" />
          </div>
          <div className="md:hidden">
            <ArrowLeft className="text-text-secondary"></ArrowLeft>
          </div>
          <Button
            variant={'destructive'}
            onClick={() => {
              logOut(undefined, {
                // useLogout has already cleared the saved user at this point.
                // Leave the protected page so the route guards run again.
                // onSettled runs on success AND failure, so the user is never stuck here.
                onSettled: () => navigate('/auth/login', { replace: true }),
              });
            }}
          >
            Log Out
          </Button>
          {location.pathname !== '/onboarding/step-one' &&
            location.pathname !== '/onboarding/step-two' && (
              <Button variant={'ghost'}>Skip for later</Button>
            )}
        </div>
      )}
      <section>
        <Outlet />
      </section>
    </div>
  );
}
