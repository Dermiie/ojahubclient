import {
  BUSINESS_CATEGORIES,
  LOCATION_TYPES,
  PRODUCT_UNITS,
} from '@/api/onboarding/onboarding';
import { z } from 'zod';
import { parseNaira } from './money';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password rules for registration and password reset
export const strongPasswordSchema = z
  .string()
  .min(8, {
    message: 'At least 8 characters required.',
  })
  .max(16, {
    message: 'Password should not exceed 16 characters',
  })
  .regex(/[A-Z]/, {
    message: 'Password should contain at least one uppercase character',
  })
  .regex(/[a-z]/, {
    message: 'Password should contain at least one lowercase character',
  })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  })
  .regex(/\d/, {
    message: 'Password must contain at least one number',
  });

export function toInternationalPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('234')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `+234${digits}`;
}

export const normalizeNigerianPhone = (value: string): string | null => {
  const digits = value.replace(/[\s()-]/g, '');
  if (/^\+234\d{10}$/.test(digits)) return digits;
  if (/^234\d{10}$/.test(digits)) return `+${digits}`;
  if (/^0\d{10}$/.test(digits)) return `+234${digits.slice(1)}`;
  return null;
};

export const normalizePrefixedPhone = (value: string): string | null => {
  const trimmed = value.replace(/[\s()-]/g, '');
  const withPrefix = /^(\+?234|0)/.test(trimmed) ? trimmed : `0${trimmed}`;
  return normalizeNigerianPhone(withPrefix);
};
// Login validation
// export const loginSchema = z.object({
//   email: z.email({ message: "Please enter a valid email address" }),
//   password: z.string().min(1, {
//     message: "Password is required",
//   }),
// });

// Login accepts an email OR a phone, in any of the usual formats
const emailOrPhone = z
  .string()
  .trim()
  .min(1, 'Enter your email or phone number')
  .transform((value) =>
    value.includes('@')
      ? value.toLowerCase()
      : (normalizeNigerianPhone(value) ?? value),
  );

export const loginSchema = z.object({
  emailOrPhone,
  password: z.string().min(1, 'Enter your password').max(128),
  rememberMe: z.boolean(),
});

// Registration validation
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your full name.'),

  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .refine(
      (v) => normalizePrefixedPhone(v) !== null,
      'Enter a valid Nigerian phone number.',
    ),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email.')
    .regex(EMAIL_PATTERN, 'Please enter a valid email address.'),

  password: strongPasswordSchema,
});

// ---------- Onboarding ----------

// Step 1: same rules as the backend's businessStep1Schema
export const businessStepSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your business name')
    .max(100, 'Business name is too long'),
  category: z.enum(BUSINESS_CATEGORIES, {
    message: 'Choose what you sell',
  }),
  businessLocation: z
    .string()
    .trim()
    .min(2, 'Enter your business location')
    .max(200, 'Business location is too long'),
});

// Step 2: same rules as the backend's locationStep2Schema
export const locationStepSchema = z.object({
  type: z.enum(LOCATION_TYPES, {
    message: 'Choose the type of place',
  }),
  name: z
    .string()
    .trim()
    .min(2, 'Enter a name for this place')
    .max(100, 'Location name is too long'),
  address: z
    .string()
    .trim()
    .min(2, 'Enter an address or landmark')
    .max(200, 'Address is too long'),
});

// Step 3: price and quantity stay as text while the user types.
// The screen turns them into numbers (price in kobo) before sending.
const MAX_PRICE_NAIRA = 10_000_000_000; // backend max is 1,000,000,000,000 kobo
const MAX_QUANTITY = 10_000_000;

export const productStepSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter the product name')
    .max(100, 'Product name is too long'),
  unit: z.enum(PRODUCT_UNITS, {
    message: 'Choose how you sell it',
  }),
  price: z
    .string()
    .trim()
    .min(1, 'Enter the price')
    .refine(
      (value) => parseNaira(value) !== null,
      'Enter a valid amount, e.g. 55,000',
    )
    .refine(
      (value) => (parseNaira(value) ?? 0) >= 1,
      'Price must be at least ₦1',
    )
    .refine(
      (value) => (parseNaira(value) ?? 0) <= MAX_PRICE_NAIRA,
      'Price is too high',
    ),
  quantity: z
    .string()
    .trim()
    .min(1, 'Enter how many you have')
    .regex(/^\d+$/, 'Enter a whole number')
    .refine((value) => Number(value) <= MAX_QUANTITY, 'Quantity is too high'),
});
