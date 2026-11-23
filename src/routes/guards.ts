import { meQueryOptions } from '@/api/auth/authApi';
import { onboardingStateQueryOptions } from '@/api/onboarding/onboarding';
import { queryClient } from '@/lib/queryClient';
import { redirect, type LoaderFunctionArgs } from 'react-router';

const LOGIN = '/auth/login';
const ONBOARDING_START = '/onboarding/step-one';
const APP_HOME = '/';

const LAST_ONBOARDING_STEP = 4;

const getUser = () => queryClient.ensureQueryData(meQueryOptions);

/* The last step the user finished (0–4), from GET /api/onboarding. */
async function getOnboardingStep(): Promise<number> {
  const state = await queryClient.ensureQueryData(onboardingStateQueryOptions);
  return state.onboardingStep;
}

/** Where to send a user who has finished `onboardingStep` steps. */
function firstUnfinishedStepPath(onboardingStep: number): string {
  if (onboardingStep < 1) return '/onboarding/step-one';
  if (onboardingStep < 2) return '/onboarding/step-two';
  if (onboardingStep < 3) return '/onboarding/step-three';
  return '/onboarding/step-four';
}

/**
 * Lets the user in only if they have finished `stepNeeded`.
 * Otherwise sends them to the first step they have not finished.
 */
async function requireFinishedStep(stepNeeded: number) {
  const onboardingStep = await getOnboardingStep();
  if (onboardingStep < stepNeeded) {
    throw redirect(firstUnfinishedStepPath(onboardingStep));
  }
}

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
  await requireFinishedStep(LAST_ONBOARDING_STEP);
  return null;
}

/** Logged in. Business optional. For the onboarding layout. */
export async function onboardingLoader({ request }: LoaderFunctionArgs) {
  const user = await getUser();
  if (!user) throw toLogin(request);
  return null;
}

/** Steps 2 need the business from step 1. */
export async function requireBusinessLoader() {
  const user = await getUser();
  if (!user?.businessId) throw redirect(ONBOARDING_START);
  return null;
}

/** Step 3 needs steps 1 and 2 (business and location). */
export async function stepThreeLoader() {
  await requireBusinessLoader();
  await requireFinishedStep(2);
  return null;
}

/** Step 4 needs steps 1–3 (step 3 can be saved or skipped). */
export async function stepFourLoader() {
  await requireBusinessLoader();
  await requireFinishedStep(3);
  return null;
}

/** Logged-out only. Keeps signed-in users off login/register. */
export async function guestLoader() {
  const user = await getUser();
  if (user) throw redirect(user.businessId ? APP_HOME : ONBOARDING_START);
  return null;
}
