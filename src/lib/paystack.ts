import PaystackPop from '@paystack/inline-js';
import type {
  PaystackErrorResponse,
  PaystackSuccessResponse,
} from '@paystack/inline-js';

export interface PaystackPopupHandlers {
  /** The customer finished paying. Confirm it with the backend next. */
  onSuccess: (reference: string) => void;
  /** The customer closed the payment window without paying. */
  onCancel: () => void;
  /** The payment window could not load (e.g. bad network). */
  onError: (message: string) => void;
}

export function openPaystackPopup(
  accessCode: string,
  handlers: PaystackPopupHandlers,
): void {
  const popup = new PaystackPop();

  popup.resumeTransaction(accessCode, {
    onSuccess: (response: PaystackSuccessResponse) => {
      handlers.onSuccess(response.reference);
    },
    onCancel: () => {
      handlers.onCancel();
    },
    onError: (error: PaystackErrorResponse) => {
      handlers.onError(error.message);
    },
  });
}
