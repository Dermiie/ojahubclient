import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { publicApi, type ApiSuccess, type User } from "../api";
import axios from "axios";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string; // 6 digits
}

export interface LoginInput {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface EmailOnlyInput {
  email: string;
}

type UserResponse = ApiSuccess<{ user: User }>;

interface MessageResponse {
  success: true;
  message: string;
}

const EMAIL_SENDING_TIMEOUT_MS = 60_000;

export async function verifyMe(): Promise<User | null> {
  try {
    const { data } =
      await publicApi.get<ApiSuccess<{ user: User }>>("/api/auth/me");
    return data.body.user;
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;

    if (status === 401) return null;
    throw err;
  }
}

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const meQueryOptions = queryOptions({
  queryKey: authKeys.me,
  queryFn: verifyMe,
  staleTime: 5 * 60 * 1000,
  retry: false,
});

export const useMe = () => useQuery(meQueryOptions);

// ---------- Request functions ----------

export async function register(input: RegisterInput): Promise<User> {
  const { data } = await publicApi.post<UserResponse>(
    "/api/auth/register",
    input,
  );
  return data.body.user;
}

export async function resendOtp(input: EmailOnlyInput): Promise<string> {
  const { data } = await publicApi.post<MessageResponse>(
    "/api/auth/resend-otp",
    input,
    { timeout: EMAIL_SENDING_TIMEOUT_MS },
  );
  return data.message;
}

export async function forgotPassword(input: EmailOnlyInput): Promise<string> {
  const { data } = await publicApi.post<MessageResponse>(
    "/api/auth/forgot-password",
    input,
    { timeout: EMAIL_SENDING_TIMEOUT_MS },
  );
  return data.message;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<string> {
  const { data } = await publicApi.post<MessageResponse>(
    "/api/auth/reset-password",
    input,
  );
  return data.message;
}

export async function verifyEmail(input: VerifyEmailInput): Promise<User> {
  const { data } = await publicApi.post<UserResponse>(
    "/api/auth/verify-email",
    input,
  );
  return data.body.user;
}

export async function login(input: LoginInput): Promise<User> {
  const { data } = await publicApi.post<ApiSuccess<{ user: User }>>(
    "/api/auth/login",
    input,
  );
  return data.body.user;
}

export async function logout(): Promise<void> {
  await publicApi.post("/api/auth/logout");
}

// ---------- Mutation hooks ----------

function useStartSession() {
  const queryClient = useQueryClient();
  return (user: User) => queryClient.setQueryData(authKeys.me, user);
}

/** Shared by every route that ends a session. */
function useEndSession() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.clear(); // drop the previous user's cached data
    queryClient.setQueryData(authKeys.me, null); // known logged-out, no /me refetch
  };
}

export function useRegister() {
  // No session yet, so nothing to cache
  return useMutation({ mutationFn: register });
}

export function useResendOtp() {
  return useMutation({ mutationFn: resendOtp });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useVerifyEmail() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: verifyEmail, onSuccess: startSession });
}

export function useLogin() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: login, onSuccess: startSession });
}

export function useLogout() {
  const endSession = useEndSession();
  // onSettled: clear locally even if the request fails, so the UI never stays "logged in"
  return useMutation({ mutationFn: logout, onSettled: endSession });
}
