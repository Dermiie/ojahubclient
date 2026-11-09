import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "Paasword should be at least 8 characters",
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
    }),
});
