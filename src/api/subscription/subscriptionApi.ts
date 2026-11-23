import { queryOptions, useQuery } from '@tanstack/react-query';
import { api, type ApiSuccess } from '../api';

export const PLAN_IDS = ['monthly', 'six_months', 'yearly'] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export type SubscriptionStatus = 'trialing' | 'active' | 'expired';

// ---------- Response data ----------

/** One plan from GET /api/subscription/plans */
export interface Plan {
  id: PlanId;
  label: string; // "Monthly", "6 months", "Yearly"
  priceKobo: number; // full price for the whole period, e.g. 4800000 = ₦48,000
  months: number; // 1, 6 or 12
}

export interface PlansList {
  trialDays: number; // 14
  plans: Plan[];
}

export interface Subscription {
  plan: PlanId;
  planLabel: string;
  priceKobo: number;
  status: SubscriptionStatus;
  endsAt: string; // ISO date, e.g. "2026-12-03T14:05:22.014Z"
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
