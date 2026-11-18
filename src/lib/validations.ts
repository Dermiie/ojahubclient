import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password rules for registration and password reset
export const strongPasswordSchema = z
  .string()
  .min(8, {
    message: 'Password should be at least 8 characters',
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
