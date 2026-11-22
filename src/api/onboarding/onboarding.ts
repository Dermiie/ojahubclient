import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api, type ApiSuccess, type User } from '../api';
import { authKeys } from '../auth/authApi';

export const BUSINESS_CATEGORIES = [
  'Fabrics',
  'Electronics',
  'Phones',
  'Provision',
  'Cosmetics',
  'Building Materials',
  'Others',
] as const;

export const LOCATION_TYPES = ['shop', 'warehouse'] as const;

export const PRODUCT_UNITS = [
  'piece',
  'bundle',
  'carton',
  'pack',
  'yard',
  'bag',
] as const;

export const PLAN_IDS = ['monthly', 'six_months', 'yearly'] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];
export type LocationType = (typeof LOCATION_TYPES)[number];
export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type PlanId = (typeof PLAN_IDS)[number];

// ---------- Request bodies ----------

export interface BusinessInput {
  name: string;
  category: BusinessCategory;
  businessLocation: string;
}

export interface LocationInput {
  name: string;
  type: LocationType;
  address: string;
}

export interface ProductInput {
  name: string;
  unit: ProductUnit;
  priceKobo: number; // naira × 100, whole number. ₦55,000 → 5500000
  quantity: number; // whole number, 0 or more
}

export interface PlanInput {
  plan: PlanId;
}

// ---------- Response data ----------

export interface Business {
  _id: string;
  name: string;
  category?: BusinessCategory;
  businessLocation?: string;
}

export interface Location {
  _id: string;
  name: string;
  type: LocationType;
  address: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  unit: ProductUnit;
  priceKobo: number;
}

export interface Stock {
  locationId: string;
  quantity: number;
}

export type SubscriptionStatus = 'trialing' | 'active' | 'expired';

export interface Subscription {
  plan: PlanId;
  planLabel: string;
  priceKobo: number;
  status: SubscriptionStatus;
  endsAt: string; // ISO date, e.g. "2026-12-03T14:05:22.014Z"
  daysLeft: number;
}

export interface OnboardingState {
  onboardingStep: number; // 0 = not started, 1–4 = last completed step
  business: Business | null;
  location: Omit<Location, 'isDefault'> | null; // same as Location, without isDefault
  product: {
    _id: string;
    name: string;
    unit: ProductUnit;
    priceKobo: number | null;
    quantity: number | null;
  } | null;
}

export interface SaveBusinessResult {
  business: Business;
  onboardingStep: number;
}

export interface SaveLocationResult {
  location: Location;
  onboardingStep: number;
}

export interface SaveProductResult {
  product: Product;
  stock: Stock;
  onboardingStep: number;
}

export interface SkipProductResult {
  onboardingStep: number;
}

export interface ChoosePlanResult {
  subscription: Subscription;
  onboardingStep: number;
}

// ---------- Request functions ----------
// All of these need a session, so they use `api` (not `publicApi`).

/** GET /api/onboarding: saved progress, used to prefill the steps. */
export async function getOnboardingState(): Promise<OnboardingState> {
  const { data } =
    await api.get<ApiSuccess<OnboardingState>>('/api/onboarding');
  return data.body;
}

/** Step 1. PUT /api/onboarding/business */
export async function saveBusiness(
  input: BusinessInput,
): Promise<SaveBusinessResult> {
  const { data } = await api.put<ApiSuccess<SaveBusinessResult>>(
    '/api/onboarding/business',
    input,
  );
  return data.body;
}

/**
 * Step 2. PUT /api/onboarding/location
 */
export async function saveLocation(
  input: LocationInput,
): Promise<SaveLocationResult> {
  const { data } = await api.put<ApiSuccess<SaveLocationResult>>(
    '/api/onboarding/location',
    input,
  );
  return data.body;
}

/**
 * Step 3. PUT /api/onboarding/product
 */
export async function saveProduct(
  input: ProductInput,
): Promise<SaveProductResult> {
  const { data } = await api.put<ApiSuccess<SaveProductResult>>(
    '/api/onboarding/product',
    input,
  );
  return data.body;
}

/** Step 3 "Skip". POST /api/onboarding/product/skip (no body) */
export async function skipProduct(): Promise<SkipProductResult> {
  const { data } = await api.post<ApiSuccess<SkipProductResult>>(
    '/api/onboarding/product/skip',
  );
  return data.body;
}

/** Step 4. PUT /api/onboarding/plan. Starts the 14-day free trial (no payment). */
export async function choosePlan(input: PlanInput): Promise<ChoosePlanResult> {
  const { data } = await api.put<ApiSuccess<ChoosePlanResult>>(
    '/api/onboarding/plan',
    input,
  );
  return data.body;
}

// ---------- Query keys ----------

export const onboardingKeys = {
  state: ['onboarding', 'state'] as const,
};

// ---------- Query hook ----------

export const onboardingStateQueryOptions = queryOptions({
  queryKey: onboardingKeys.state,
  queryFn: getOnboardingState,
});

export const useOnboardingState = () => useQuery(onboardingStateQueryOptions);

/** After any step is saved, the saved progress is out of date: refetch it. */
function useRefreshOnboardingState() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: onboardingKeys.state });
}

export function useSaveBusiness() {
  const queryClient = useQueryClient();
  const refreshOnboardingState = useRefreshOnboardingState();

  return useMutation({
    mutationFn: saveBusiness,
    onSuccess: (result) => {
      // Give the cached user its new businessId,
      // so the route guards let the user into steps 2–4.
      queryClient.setQueryData<User | null>(authKeys.me, (user) => {
        if (!user) return user;
        return { ...user, businessId: result.business._id };
      });

      refreshOnboardingState();
    },
  });
}

export function useSaveLocation() {
  const refreshOnboardingState = useRefreshOnboardingState();
  return useMutation({
    mutationFn: saveLocation,
    onSuccess: refreshOnboardingState,
  });
}

export function useSaveProduct() {
  const refreshOnboardingState = useRefreshOnboardingState();
  return useMutation({
    mutationFn: saveProduct,
    onSuccess: refreshOnboardingState,
  });
}

export function useSkipProduct() {
  const refreshOnboardingState = useRefreshOnboardingState();
  return useMutation({
    mutationFn: skipProduct,
    onSuccess: refreshOnboardingState,
  });
}

export function useChoosePlan() {
  const refreshOnboardingState = useRefreshOnboardingState();
  return useMutation({
    mutationFn: choosePlan,
    onSuccess: refreshOnboardingState,
  });
}
