import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import Actionbtn from "@/components/ui/action-btn";
import googleLogo from "@/assets/logo/google-logo.svg";
import { normalizePrefixedPhone, registerSchema } from "@/lib/validations";
import { useRegister, type RegisterInput } from "@/api/auth/authApi";
import { parseApiError } from "@/api/api";

type RegisterValues = z.infer<typeof registerSchema>;

const FIELDS: (keyof RegisterValues)[] = ["name", "phone", "email", "password"];

// ---------- Shared styles ----------

// One input style for every field, mobile and desktop
const inputClass =
  "h-[44px] w-full rounded-[16px] border border-[#D1D1D1] px-[12px] text-[13px] leading-[17px] font-medium text-[#1F2A24] outline-none placeholder:text-[#95A19C] focus:border-[#2E8B57] md:h-[48px] md:px-[15px] md:text-[14px] md:leading-[18px] md:placeholder:text-[14px]";

const inputErrorClass = "border-red-500 focus:border-red-500";

const labelClass =
  "mb-2 block w-full text-[13px] leading-[17px] font-semibold md:text-[16px] md:leading-[18px]";

const compactMobile = "[@media(max-height:860px)_and_(max-width:767px)]";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-1 text-[12px] leading-[16px] font-medium text-red-600 md:text-[13px]"
    >
      {message}
    </p>
  );
}

// ---------- Component ----------

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,

    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched", // validate after leaving a field, then on every change
    defaultValues: { name: "", phone: "", email: "", password: "" },
  });

  const onSubmit = (values: RegisterValues) => {
    clearErrors("root");
    // Shape the body the backend expects
    const payload: RegisterInput = {
      name: values.name,
      email: values.email,
      phone: normalizePrefixedPhone(values.phone)!, // "803 000 0000" → "+2348030000000"
      password: values.password,
    };

    registerUser(payload, {
      onSuccess: (user) => {
        // User created but NOT logged in: the session starts after the OTP is verified
        navigate("/auth/verify?flow=register", {
          state: { email: user.email }, // server-normalised (lowercased) email
        });
      },
      onError: (err) => {
        const { message, fieldErrors } = parseApiError(err);
        let mapped = false;

        // 400 validation / password rules → under each field
        for (const [name, msg] of Object.entries(fieldErrors)) {
          if (FIELDS.includes(name as keyof RegisterValues)) {
            setError(name as keyof RegisterValues, {
              type: "server",
              message: msg,
            });
            mapped = true;
          }
        }

        // 409 email/phone already used, 503 email not sent, 429, network → banner
        if (!mapped) setError("root.server", { type: "server", message });
      },
    });

    // TODO: call the register mutation with `payload`
    // on success → navigate('/auth/verify?flow=register', { state: { email } })
    console.log(payload);
  };

  return (
    <div className="flex w-full items-start justify-center">
      <div className="w-full max-w-[500px]">
        <h1 className="w-fit whitespace-nowrap text-[30px] leading-[1] font-bold text-[#26332D] md:w-[387px] md:text-[36px]">
          Create your account
        </h1>

        <p className="mt-2 w-full text-[13px] leading-[1.7] text-gray-500 md:w-[387px] md:text-[15px]">
          Set up your shop in 3 minutes.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={`mt-[38px] space-y-[20px] md:mt-6 md:space-y-7 ${compactMobile}:mt-[28px] ${compactMobile}:space-y-[14px]`}
        >
          {/* Full name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={!!errors.name}
              className={`${inputClass} ${errors.name ? inputErrorClass : ""}`}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          {/* Phone number */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>

            <div
              className={`flex h-[44px] w-full items-center gap-[8px] overflow-hidden rounded-[16px] border border-[#D1D1D1] px-[9px] focus-within:border-[#2E8B57] md:h-[48px] md:gap-0 md:px-0 ${
                errors.phone ? inputErrorClass : ""
              }`}
            >
              <span className="flex h-[26px] w-[62px] shrink-0 items-center border-r border-[#D1D1D1] text-[12px] leading-[1] font-medium text-[#1F2A24] md:h-[34px] md:w-[95px] md:px-[10px] md:text-[17px]">
                NG +234
              </span>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="803 000 0000"
                aria-invalid={!!errors.phone}
                className="min-w-0 flex-1 text-[13px] leading-[1] font-medium text-[#1F2A24] outline-none placeholder:text-[#95A19C] md:px-[15px] md:text-[14px] md:placeholder:text-[14px]"
                {...register("phone")}
              />
            </div>
            <FieldError message={errors.phone?.message} />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              className={`${inputClass} ${errors.email ? inputErrorClass : ""}`}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
                className={`${inputClass} pr-10 md:pr-16 ${errors.password ? inputErrorClass : ""}`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-[8px] top-1/2 z-10 -translate-y-1/2 text-gray-400 md:right-4"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px] md:h-5 md:w-5" />
                ) : (
                  <Eye className="h-[18px] w-[18px] md:h-5 md:w-5" />
                )}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
          </div>

          {/* Buttons */}
          <div
            className={`space-y-4 pt-[10px] md:space-y-7 md:pt-0 ${compactMobile}:space-y-3 ${compactMobile}:pt-[4px]`}
          >
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="flex h-[44px] w-full items-center justify-center gap-[6px] rounded-[60px] bg-[#278B53] px-[10px] py-[12px] text-[16px] leading-[1] font-bold text-white transition hover:bg-[#207544] disabled:cursor-not-allowed disabled:opacity-70 md:h-[45px] md:text-[18px]"
            >
              Create account
            </button>

            <Actionbtn
              type="button"
              variant="outline"
              text={
                <span className="flex items-center justify-center gap-[12px] text-[16px] leading-[1] font-bold text-[#1F2A24] md:text-[18px]">
                  <img src={googleLogo} alt="Google" className="h-6 w-6" />
                  Sign up with Google
                </span>
              }
              classname="h-[44px] w-full rounded-[60px] border border-[#D1D1D1] bg-white px-[10px] hover:bg-gray-50 md:h-[45px]"
            />
          </div>
        </form>

        <p
          className={`mt-[29px] text-center text-[13px] leading-[17px] font-medium text-[#727E79] md:mt-6 md:text-[14px] ${compactMobile}:mt-[20px]`}
        >
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[#2E8B57] underline"
          >
            Log in
          </Link>
        </p>

        <p
          className={`mx-auto mt-[13px] w-full whitespace-nowrap text-center text-[clamp(11px,3.3vw,13px)] leading-[1.3] font-medium text-[#727E79] md:mt-2 md:w-[477px] md:text-[14px] md:leading-[23px] ${compactMobile}:mt-2`}
        >
          By continuing you agree to the{" "}
          <span className="cursor-pointer text-[#2E8B57] underline">Terms</span>{" "}
          and{" "}
          <span className="cursor-pointer text-[#2E8B57] underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
