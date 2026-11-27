import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api, type ApiSuccess } from '../api';
import { onboardingKeys, type OnboardingState } from '../onboarding/onboarding';

export const PLAN_IDS = ['monthly', 'six_months', 'yearly'] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const FREE_TRIAL_PLAN_ID = 'free_trial';

export type SubscriptionPlanId = PlanId | typeof FREE_TRIAL_PLAN_ID;

export type SubscriptionStatus = 'trialing' | 'active' | 'expired';

// ---------- Response data ----------

/** One plan from GET /api/subscription/plans */
export interface Plan {
  id: PlanId;
  label: string;
  priceKobo: number;
  months: number;
}

export interface PlansList {
  trialDays: number; // 7
  plans: Plan[];
}

export interface Subscription {
  plan: SubscriptionPlanId;
  planLabel: string;
  priceKobo: number;
  status: SubscriptionStatus;
  endsAt: string; // ISO date
  daysLeft: number;
}

/** What GET /api/subscription returns */
export interface SubscriptionState {
  // "none" means no plan has been chosen yet (onboarding step 4)
  status: SubscriptionStatus | 'none';
  // false when expired: the business can view its data but not change it
  canWrite: boolean;
  subscription: Subscription | null;
}

export interface VerifyPaymentResult {
  // true when the Paystack webhook already confirmed it. Still a success.
  alreadyProcessed: boolean;
  message: string;
  reference: string;
  plan: PlanId;
  currentPeriodEnd: string; // ISO date
}

export const TRIAL_DAYS = 7;

export const PLANS: Plan[] = [
  { id: 'monthly', label: 'Monthly', priceKobo: 500000, months: 1 }, // ₦5,000
  { id: 'six_months', label: '6 months', priceKobo: 2700000, months: 6 }, // ₦27,000
  { id: 'yearly', label: 'Yearly', priceKobo: 4800000, months: 12 }, // ₦48,000
];

// ---------- Query keys ----------

export const subscriptionKeys = {
  plans: ['subscription', 'plans'] as const,
  current: ['subscription', 'current'] as const,
};

/** GET /api/subscription/plans: the plans and their prices. */
export async function getPlans(): Promise<PlansList> {
  const { data } = await api.get<ApiSuccess<PlansList>>(
    '/api/subscription/plans',
  );
  return data.body;
}

/** GET /api/subscription: the business's current plan and status. */
export async function getSubscription(): Promise<SubscriptionState> {
  const { data } =
    await api.get<ApiSuccess<SubscriptionState>>('/api/subscription');
  return data.body;
}

/**
 * Asks the backend to check the payment with Paystack
 */
export async function verifyPayment(
  reference: string,
): Promise<VerifyPaymentResult> {
  const { data } = await api.post<ApiSuccess<VerifyPaymentResult>>(
    `/api/payment/verify/${encodeURIComponent(reference)}`,
  );
  return data.body;
}

// ---------- Query hooks ----------

export const plansQueryOptions = queryOptions({
  queryKey: subscriptionKeys.plans,
  queryFn: getPlans,
  staleTime: 60 * 60 * 1000, // plans rarely change: reuse them for an hour
});

export const usePlans = () => useQuery(plansQueryOptions);

export const subscriptionQueryOptions = queryOptions({
  queryKey: subscriptionKeys.current,
  queryFn: getSubscription,
});

export const useSubscription = () => useQuery(subscriptionQueryOptions);

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      // The backend has finished onboarding (step 4). Update the cache now,
      // so the dashboard guard lets the user in without a redirect to step 4.
      queryClient.setQueryData<OnboardingState>(
        onboardingKeys.state,
        (state) => {
          if (!state) return state;
          return { ...state, onboardingStep: 4 };
        },
      );
      queryClient.invalidateQueries({ queryKey: onboardingKeys.state });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current });
    },
  });
}
