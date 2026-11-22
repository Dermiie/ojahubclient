import { parseApiError } from '@/api/api';
import { useLogout } from '@/api/auth/authApi';
import { useSkipProduct } from '@/api/onboarding/onboarding';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export default function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mutate: skipProduct,
    isPending: isSkipping,
    error: skipError,
  } = useSkipProduct();
  const { mutate: logOut } = useLogout();

  const onSkip = () => {
    skipProduct(undefined, {
      onSuccess: () => {
        navigate('/onboarding/step-four');
      },
    });
  };

  const onLogOut = () => {
    logOut(undefined, {
      onSettled: () => navigate('/auth/login', { replace: true }),
    });
  };

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
          <Button variant={'destructive'} onClick={onLogOut}>
            Log Out
          </Button>
          {location.pathname === '/onboarding/step-three' && (
            <Button variant="ghost" disabled={isSkipping} onClick={onSkip}>
              {isSkipping ? 'Skipping...' : 'Skip for later'}
            </Button>
          )}
        </div>
      )}
      {location.pathname === '/onboarding/step-three' && skipError && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-b2-medium text-destructive"
        >
          {parseApiError(skipError).message}
        </p>
      )}

      <section>
        <Outlet />
      </section>
    </div>
  );
}
