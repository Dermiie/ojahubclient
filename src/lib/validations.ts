import { z } from "zod";

// Password rules for registration and password reset
const strongPasswordSchema = z
  .string()
  .min(8, {
    message: "Password should be at least 8 characters",
  })
  .max(16, {
    message: "Password should not exceed 16 characters",
  })
  .regex(/[A-Z]/, {
    message: "Password should contain at least one uppercase character",
  })
  .regex(/[a-z]/, {
    message: "Password should contain at least one lowercase character",
  })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain at least one special character",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number",
  });

// Login validation
export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

// Registration validation
export const registerSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: strongPasswordSchema,
});
