import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Clock3 } from 'lucide-react';
import notificationBell from '@/assets/logo/notification-bell.svg';
import phoneLogo from '@/assets/logo/Phone logo verify desktop.svg';
import desktopLogo from '@/assets/logo/Logo-forgot password.svg';
import { parseApiError } from '@/api/api';
import {
  useForgotPassword,
  useResendOtp,
  useVerifyEmail,
} from '@/api/auth/authApi';

// The backend only allows a new code every 60 seconds
const RESEND_WAIT_SECONDS = 60;
const CODE_LENGTH = 6;
const EMPTY_CODE = ['', '', '', '', '', ''];

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

interface VerifyPageState {
  email?: string;
  codeSent?: boolean;
}

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const pageState = location.state as VerifyPageState | null;
  const email = pageState?.email;
  const codeSent = pageState?.codeSent === true;

  const flow =
    searchParams.get('flow') === 'forgot-password'
      ? 'forgot-password'
      : 'register';

  const [otp, setOtp] = useState(EMPTY_CODE);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(
    codeSent ? RESEND_WAIT_SECONDS : 0,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [hasCodeBeenSent, setHasCodeBeenSent] = useState(codeSent);
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResendingOtp } = useResendOtp();
  const { mutate: forgotPassword, isPending: isResendingReset } =
    useForgotPassword();
  const isResending = isResendingOtp || isResendingReset;

  // Count down one second at a time until "Resend code" is allowed
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);

    setOtp(updatedOtp);
    setErrorMessage('');
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!email) return;

    const code = otp.join('');
    setErrorMessage('');
    setInfoMessage('');

    if (flow === 'forgot-password') {
      navigate('/auth/set-new-password', { state: { email, otp: code } });
      return;
    }

    verifyEmail(
      { email, otp: code },
      {
        // A new account has no business yet, so it goes to onboarding.
        onSuccess: (user) => {
          const nextPage = user.businessId ? '/' : '/onboarding/step-one';
          navigate(nextPage, { replace: true });
        },
        onError: (error) => {
          setErrorMessage(parseApiError(error).message);
        },
      },
    );
  };

  const handleResend = () => {
    if (!email) return;

    setOtp(EMPTY_CODE);
    setErrorMessage('');
    setInfoMessage('');

    const callbacks = {
      onSuccess: (message: string) => {
        setInfoMessage(message);
        setHasCodeBeenSent(true);
        setResendCountdown(RESEND_WAIT_SECONDS);
        inputRefs.current[0]?.focus();
      },
      onError: (error: unknown) => {
        setErrorMessage(parseApiError(error).message);
      },
    };

    if (flow === 'forgot-password') {
      forgotPassword({ email }, callbacks);
    } else {
      resendOtp({ email }, callbacks);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background-main px-6 text-center">
        <h1 className="text-m-h1-bold text-text-primary">
          We don't know which email to verify
        </h1>
        <p className="max-w-[420px] text-b2-medium text-text-secondary">
          Log in with your email address and we will help you verify it.
        </p>
        <Link
          to="/auth/login"
          className="text-b1-medium font-semibold text-primary-base hover:underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const isCodeComplete = otp.every((digit) => digit !== '');

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white px-4 pt-[51px] pb-6 md:px-0 md:pt-0 md:pb-0">
      {/* Header */}
      <header className="flex items-center justify-between md:absolute md:left-0 md:right-0 md:top-0 md:px-[4vw] md:pt-[4px]">
        {/* Desktop logo */}
        <Link to="/" aria-label="Go to home page" className="hidden md:block">
          <img
            src={desktopLogo}
            alt="OjaHub"
            className="h-[29px] w-[78px] object-contain"
          />
        </Link>

        {/* Desktop back button */}
        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="hidden items-center gap-[4px] rounded-full bg-[#E3E7E5] px-[8px] py-[4px] text-[11px] leading-none text-[#1F2A24] md:flex"
        >
          <ChevronLeft size={10} />
          Back to login
        </button>

        {/* Mobile back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-[6px] text-[18px] leading-[1] font-medium text-[#1F2A24] md:hidden"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </header>

      {/* OTP Content */}
      <div className="mx-auto mt-10 flex min-h-[calc(100vh-120px)] w-full max-w-[611px] flex-col items-center text-center md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:h-[551px] md:min-h-0 md:-translate-x-1/2 md:-translate-y-1/2 md:[zoom:0.6]">
        {/* Top OTP section */}
        <div className="w-full">
          {/* Phone icon */}
          <div className="mx-auto mb-6 flex h-[90px] w-[90px] items-center justify-center rounded-2xl bg-[#E8F5EC]">
            <img
              src={phoneLogo}
              alt="Phone"
              className="h-[90px] w-[90px] object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-text-primary md:text-[32px]">
            Enter your OTP
          </h1>

          {hasCodeBeenSent ? (
            <p className="mx-auto mt-2 text-[16px] leading-[1.4] font-semibold text-text-primary">
              We sent a 6-digit code to{' '}
              <span className="text-primary-base">{email}</span>. Check your
              inbox.
            </p>
          ) : (
            <p className="mx-auto mt-2 text-[16px] leading-[1.4] font-semibold text-text-primary">
              <span className="text-primary-base">{email}</span> isn't verified
              yet. Tap <span className="text-primary-base">Resend code</span> to
              get a 6-digit code.
            </p>
          )}

          {/* Verification code inputs */}
          <div className="mx-auto mt-6 w-fit md:mt-12">
            <p className="mb-3 text-left text-[20px] leading-[1] font-bold text-text-primary md:mb-5 md:text-[24px]">
              Verification code
            </p>
            <div className="flex justify-center gap-3 md:gap-[30px]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  // onPaste={handleOtpPaste}
                  className={`h-12 w-12 rounded-lg border text-center text-text-primary outline-none focus:border-primary-base focus:ring-1 focus:ring-primary-base ${
                    digit
                      ? 'border-transparent bg-primary-subtle'
                      : 'border-border-strong bg-background-main'
                  } md:h-[70px] md:w-[60px] md:rounded-[10px] md:px-3 md:py-[10px] md:text-[30px] md:leading-[1] md:font-bold`}
                />
              ))}
            </div>

            {/* Error or success message from the server */}
            {errorMessage && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-left text-b3-medium text-red-700 md:text-b1-medium"
              >
                {errorMessage}
              </p>
            )}
            {infoMessage && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-primary-subtle px-3 py-2.5 text-left text-b3-medium text-primary-active md:text-b1-medium"
              >
                {infoMessage}
              </p>
            )}

            {/* Resend countdown */}
            <div className="mt-4 flex justify-start md:mt-6 md:justify-center">
              {resendCountdown > 0 ? (
                <div className="flex items-center gap-1 rounded-full bg-[#E3E7E5] px-3 py-1 text-[#1F2A24] md:gap-[6px] md:px-4 md:py-[5px]">
                  <Clock3 size={12} className="text-gray-500" />
                  <span className="text-[10px] text-gray-500">
                    Resend code in
                  </span>
                  <span className="text-[14px] font-medium">
                    {formatCountdown(resendCountdown)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-xs font-medium text-primary-base hover:underline disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  {isResending ? 'Sending code...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Bottom section */}
        <div className="mt-auto flex w-full flex-col items-center gap-3 md:mt-12 md:gap-5">
          {/* Notification */}
          <div className="order-1 flex w-full max-w-[358px] items-center justify-start gap-[10px] rounded-[10px] border border-[#D1D1D1] px-[10px] py-[6px] text-left md:order-2 md:max-w-[500px] md:justify-center md:border-0 md:px-0 md:py-0">
            <img
              src={notificationBell}
              alt=""
              className="h-[24px] w-[27px] shrink-0 object-contain md:hidden"
            />

            <p className="w-[315px] text-[14px] leading-[1] font-medium tracking-[-0.02em] text-[#95A19C] md:w-[500px] md:text-[14px] md:leading-[1] md:tracking-[-0.02em] md:text-center md:text-[#727E79]">
              This email also gets your payment and low stock alerts
            </p>
          </div>

          {/* Verify button */}
          <button
            type="button"
            disabled={!isCodeComplete || isVerifying}
            onClick={handleVerify}
            className="order-2 flex h-[44px] w-full max-w-[358px] items-center justify-center gap-[6px] rounded-[60px] bg-[#2E8B57] px-[10px] py-[12px] text-[16px] leading-[1] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 md:order-1 md:h-[48px] md:max-w-[500px] md:rounded-[60px] md:bg-[#2E8B57] md:px-[10px] md:py-[12px] md:text-[18px] md:font-bold"
          >
            {isVerifying ? 'Verifying...' : 'Verify and continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
