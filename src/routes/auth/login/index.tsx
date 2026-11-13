import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import Actionbtn from '@/components/ui/action-btn';
import { useForm } from 'react-hook-form';
import Formbox from '@/components/ui/formbox';
import { loginSchema } from '@/lib/validations';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginValues = z.infer<typeof loginSchema>;

/*
 * Mobile-first: base classes = mobile design, `lg:` = desktop design.
 * `lg` matches AuthLayout, where the two-column layout starts.
 */

// Shared input look so the email and password fields always match.
const inputClass =
  'h-11 w-full rounded-xl border border-border-default bg-background-main px-3 text-b3-medium text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-primary-active lg:h-14 lg:px-4 lg:text-b1-medium';

// Shared label look (green, semibold).
const labelClass =
  'text-b3-medium font-semibold text-primary-base lg:text-b1-medium lg:font-semibold';

// Pill buttons share size + type; colours differ per button.
const pillButtonClass =
  'flex h-11 w-full items-center justify-center gap-2.5 rounded-full px-2.5 text-b1-medium font-semibold transition-colors lg:h-14';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onFormSubmit = (data: LoginValues) => {
    console.log(data);
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-m-h1-bold text-text-primary lg:text-d2-bold">
          Welcome back
        </h1>
        <p className="mt-2 text-b2-medium text-text-secondary">
          Log in to see today's sales and payments.
        </p>
      </header>

      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Formbox
          className="[&>fieldset>legend>div>label]:text-b3-medium [&>fieldset>legend>div>label]:font-semibold lg:[&>fieldset>legend>div>label]:text-b1-medium lg:[&>fieldset>legend>div>label]:font-semibold"
          label="Email address"
          type="email"
          inputType="input"
          id="email"
          register={register}
          name="email"
          placeholder="Johnny@example.com"
          errors={errors?.email}
          styles={inputClass}
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>

            <a
              href="/auth/forgot-password"
              className="text-b3-medium font-semibold text-primary-base hover:text-primary-hover hover:underline lg:text-b2-medium"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              // autoComplete="current-password"
              {...register('password')}
              className={`${inputClass} pr-11 lg:pr-14`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-icon-grey lg:right-4"
            >
              {showPassword ? (
                <EyeOff className="size-[18px] lg:size-5" />
              ) : (
                <Eye className="size-[18px] lg:size-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="size-4 shrink-0 cursor-pointer accent-primary-base"
          />
          <label
            htmlFor="keepLoggedIn"
            className="cursor-pointer text-b3-medium text-text-secondary"
          >
            Keep me logged in on this computer
          </label>
        </div>

        {/* Actions: extra breathing room on mobile instead of the old !mt-30 hack */}
        <div className="mt-12 flex flex-col gap-5 lg:mt-3">
          <Actionbtn
            type="submit"
            text="Log in"
            disabled={isSubmitting}
            classname={`${pillButtonClass} bg-primary-base text-text-inverse hover:bg-primary-hover active:bg-primary-active lg:text-h5-bold`}
          />

          <button
            type="button"
            disabled={isSubmitting}
            className={`${pillButtonClass} border border-border-default bg-background-main text-text-primary hover:bg-background-card lg:text-h5-semibold`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.46-4.12 7.12-10.18 7.12-17.58Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.85 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-b2-regular text-text-secondary">
            New to OjaHub?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              disabled={isSubmitting}
              className="font-medium text-primary-base hover:text-primary-hover hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
