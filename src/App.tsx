import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import router from './routes';
import { setAuthHandlers } from './api/api';
import { authKeys } from './api/auth/authApi';
import { queryClient } from './lib/queryClient';

const LOGIN = '/auth/login';
const ONBOARDING_START = '/onboarding/step-one';

setAuthHandlers({
  onUnauthorized: () => {
    // Forget the user first,
    queryClient.setQueryData(authKeys.me, null);

    const { pathname, search } = window.location;
    if (pathname.startsWith('/auth')) return; // already there; also stops loops

    const here = pathname + search;
    router.navigate(`${LOGIN}?redirectTo=${encodeURIComponent(here)}`, {
      replace: true,
    });
  },
  onOnboardingRequired: () => {
    if (window.location.pathname.startsWith('/onboarding')) return;
    router.navigate(ONBOARDING_START, { replace: true });
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
