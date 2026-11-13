import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import Actionbtn from '@/components/ui/action-btn';
import googleLogo from '@/assets/logo/google-logo.svg';

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      alert('Please complete all fields.');
      return;
    }

    // Check password length
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      alert('Your password must contain at least 8 characters.');
      return;
    }

    navigate('/auth/verify?flow=register', {
      state: {
        email,
      },
    });
  };

  return (
    <div className="flex w-full items-start justify-center px-0 py-0 md:min-h-screen md:items-center md:px-0 md:py-10">
      <div className="w-full max-w-125">
        <h1 className="w-fit whitespace-nowrap text-[30px] leading-none font-bold text-[#26332D] md:w-96.75 md:text-[42px]">
          Create your account
        </h1>

        <p className="mt-2 w-full text-[13px] leading-[1.7] font-medium text-gray-500 md:w-96.75 md:text-[18px]">
          Set up your shop in 3 minutes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-7 max-[375px]:space-y-5"
        >
          {/* Full name */}
          <div>
            <label className="mb-2 block w-full text-[13px] leading-4.25 font-semibold md:text-[18px] md:leading-none">
              Full name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="h-10.75 w-full rounded-[14.32px] border-[1.43px] border-gray-300 px-2.75 text-[13px] leading-none font-medium md:h-13.75 md:rounded-[18px] md:px-3.75 md:text-[18px] placeholder:text-[13px] placeholder:font-medium"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="mb-2 block w-full text-[13px] leading-4.25 font-semibold md:text-[18px] md:leading-none">
              Phone number
            </label>

            <div className="flex h-10.75 w-full items-center gap-[6.44px] overflow-hidden rounded-[14.32px] border-[0.72px] border-border-default px-[10.74px] md:h-14 md:gap-0 md:rounded-[20px] md:border md:px-0">
              <span className="flex h-6.5 w-17.25 shrink-0 items-center justify-start rounded-l-[14.32px] border-r-[0.72px] border-border-default px-0 text-[14px] leading-none font-medium tracking-[-0.02em] md:h-10.75 md:w-23.75 md:rounded-l-none md:border-r md:px-2.5 md:text-[18px] md:tracking-normal">
                NG +234
              </span>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="803 000 0000"
                className="min-w-0 flex-1 px-0 text-[13px] leading-none font-medium tracking-normal text-text-tertiary placeholder:text-[13px] placeholder:font-medium placeholder:text-text-tertiary outline-none md:px-3.75 md:text-[18px] md:text-text-secondary md:placeholder:text-[18px]"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="mb-[7.16px] block w-full text-[13px] leading-4.25 font-semibold md:mb-2 md:text-[18px] md:leading-4.5">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10.75 w-full rounded-[14.32px] border-[0.72px] border-border-default px-[10.74px] text-[13px] leading-4.25 font-medium placeholder:text-text-tertiary outline-none focus:border-green-600 md:h-13.75 md:rounded-[20px] md:border md:px-3.75 md:text-[18px] md:leading-4.5 md:placeholder:text-text-secondary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-[7.16px] block w-full text-[13px] leading-4.25 font-semibold md:mb-2 md:text-[18px] md:leading-4.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="At least 8 characters"
                className="h-10.75 w-full rounded-[14.32px] border-[0.72px] border-border-default px-[10.74px] pr-10 text-[13px] leading-4.25 font-medium placeholder:text-text-tertiary outline-none focus:border-green-600 md:h-14 md:rounded-[20px] md:border md:px-3.75 md:pr-16 md:text-[18px] md:leading-4.5 md:placeholder:text-text-secondary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-1.5 rounded-[60px] bg-[#278B53] px-2.5 py-3 text-[20px] leading-none font-bold text-white transition hover:bg-[#207544]"
          >
            Create account
          </button>

          <Actionbtn
            type="button"
            variant="outline"
            text={
              <span className="flex items-center justify-center gap-3 text-[20px] leading-none font-bold text-text-primary">
                <img src={googleLogo} alt="Google" className="h-6 w-6" />
                Sign up with Google
              </span>
            }
            classname="h-14 w-full rounded-[60px] border border-border-default bg-white px-2.5 hover:bg-gray-50"
          />
        </form>

        <p className="mt-6 text-center text-[11px] md:text-[18px] leading-4.25 font-medium text-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="font-semibold text-primary-base underline"
          >
            Log in
          </button>
        </p>

        <p
          className="mt-2 max-[375px]:whitespace-nowrap max-[375px]:text-[10px]
        text-center text-[11px] md:text-[18px] leading-none font-medium text-text-secondary"
        >
          By continuing, you agree to our{' '}
          <span className="text-primary-base underline cursor-pointer">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-primary-base underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
