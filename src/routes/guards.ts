import { meQueryOptions } from '@/api/auth/authApi';
import { queryClient } from '@/lib/queryClient';
import { redirect, type LoaderFunctionArgs } from 'react-router';

const LOGIN = '/auth/login';
const ONBOARDING_START = '/onboarding/step-one';
const APP_HOME = '/'; // change to your real app home

const getUser = () => queryClient.ensureQueryData(meQueryOptions);

function toLogin(request: Request) {
  const { pathname, search } = new URL(request.url);
  return redirect(
    `${LOGIN}?redirectTo=${encodeURIComponent(pathname + search)}`,
  );
}

/** Logged in + has a business. For the main app. */
export async function protectedLoader({ request }: LoaderFunctionArgs) {
  const user = await getUser();
  if (!user) throw toLogin(request);
  if (!user.businessId) throw redirect(ONBOARDING_START);
  return null;
}

/** Logged in. Business optional. For the onboarding layout. */
export async function onboardingLoader({ request }: LoaderFunctionArgs) {
  const user = await getUser();
  if (!user) throw toLogin(request);
  return null;
}

/** Steps 2–4 need the business from step 1. */
export async function requireBusinessLoader() {
  const user = await getUser();
  if (!user?.businessId) throw redirect(ONBOARDING_START);
  return null;
}

/** Logged-out only. Keeps signed-in users off login/register. */
export async function guestLoader() {
  const user = await getUser();
  if (user) throw redirect(user.businessId ? APP_HOME : ONBOARDING_START);
  return null;
}
