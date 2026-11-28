import axios, {
  type AxiosError,
  type AxiosInstance,
  type CreateAxiosDefaults,
} from 'axios';

// ---------- Types (from the backend guide) ----------

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  businessId?: string; // absent until onboarding step 1 is saved
  emailVerified: boolean;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  body: T;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  // array for validation errors, object (e.g. { code: "ONBOARDING_REQUIRED" }) otherwise
  details?: FieldError[] | { code?: string; [key: string]: unknown };
}

export interface ParsedApiError {
  status: number; // 0 if the server could not be reached
  message: string;
  fieldErrors: Record<string, string>;
  code?: string;
}

const BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

const baseConfig: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
};

/**
 * publicApi: routes that work without a session.
 * register, verify-email, resend-otp, login, google,
 * forgot-password, reset-password, logout.
 *
 * No redirect interceptor here: a 401 from /login means "wrong credentials",
 * which the form should show, not "send the user to the login screen".
 */
export const publicApi: AxiosInstance = axios.create(baseConfig);

/**
 * api: routes that need a session.
 * logout-all, onboarding, and everything else behind auth.
 */
export const api: AxiosInstance = axios.create(baseConfig);

// ---------- Auth redirects ----------

interface AuthHandlers {
  onUnauthorized: () => void;
  onOnboardingRequired: () => void;
}

let handlers: AuthHandlers = {
  onUnauthorized: () => {
    if (window.location.pathname !== '/auth/login')
      window.location.assign('/auth/login');
  },
  onOnboardingRequired: () => {
    if (!window.location.pathname.startsWith('/onboarding/step-one')) {
      window.location.assign('/onboarding/step-one');
    }
  },
};

export function setAuthHandlers(next: Partial<AuthHandlers>): void {
  handlers = { ...handlers, ...next };
}

function getErrorCode(data?: ApiErrorBody): string | undefined {
  const details = data?.details;
  return details && !Array.isArray(details) ? details.code : undefined;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const code = getErrorCode(error.response?.data);

    if (status === 401) {
      // No session: go to the login screen
      handlers.onUnauthorized();
    } else if (status === 403 && code === 'ONBOARDING_REQUIRED') {
      // Logged in but no business yet: go to onboarding
      handlers.onOnboardingRequired();
    }

    return Promise.reject(error);
  },
);

// ---------- Error helper ----------

/**
 * Turns any API error into something the UI can show.
 * fieldErrors maps field name to message for 400 validation errors.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return {
      status: 0,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }

  const status = error.response?.status ?? 0;
  const data = error.response?.data;

  const fieldErrors: Record<string, string> = {};
  if (Array.isArray(data?.details)) {
    for (const { field, message } of data.details) {
      if (field && !fieldErrors[field]) fieldErrors[field] = message;
    }
  }

  const isTimeout =
    error.code === axios.AxiosError.ECONNABORTED ||
    error.code === axios.AxiosError.ETIMEDOUT;

  let message = data?.message;

  if (!message) {
    if (isTimeout)
      message =
        'The server is taking too long to respond. Please wait a minute and try again.';
    else if (status === 0)
      message = "Can't reach the server. Check your connection.";
    else if (status === 429)
      message = 'Too many attempts. Please try again later.';
    else message = 'Something went wrong. Please try again.';
  }

  return { status, message, fieldErrors, code: getErrorCode(data) };
}
