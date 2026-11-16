import { parseApiError, type ApiErrorBody } from '@/api/api';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<ApiErrorBody>;
  }
}

function notifyGlobalError(err: unknown) {
  const { status, message } = parseApiError(err);
  if (status === 0 || status === 429 || status >= 500) {
    // replace with your toast library, e.g. toast.error(message)
    console.error(message);
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyGlobalError }),
  mutationCache: new MutationCache({ onError: notifyGlobalError }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, err) => {
        const status = axios.isAxiosError(err)
          ? (err.response?.status ?? 0)
          : 0;
        const retryable = status === 0 || status >= 500;
        return retryable && failureCount < 2;
      },
    },
    mutations: {
      retry: false, // never repeat a POST like register or reset-password
    },
  },
});
