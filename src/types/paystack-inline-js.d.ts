declare module '@paystack/inline-js' {
  /** What onSuccess receives after the customer pays */
  export interface PaystackSuccessResponse {
    id: number;
    reference: string; // the same reference our backend created, e.g. "OJA-20261127-A1B2C3D4"
    message: string;
  }

  /** What onError receives when the payment window could not load */
  export interface PaystackErrorResponse {
    message: string;
  }

  export interface PaystackCallbacks {
    onSuccess?: (response: PaystackSuccessResponse) => void;
    onCancel?: () => void;
    onError?: (error: PaystackErrorResponse) => void;
    onLoad?: (response: { id: number; accessCode: string }) => void;
  }

  export default class PaystackPop {
    /** Opens the payment window for a transaction our backend already started */
    resumeTransaction(accessCode: string, callbacks?: PaystackCallbacks): void;
  }
}
