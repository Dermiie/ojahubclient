import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Clock3 } from "lucide-react";
import notificationBell from "@/assets/logo/notification-bell.svg";
import phoneLogo from "@/assets/logo/Phone logo verify desktop.svg";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const email = (location.state as { email?: string } | null)?.email;

  const flow = searchParams.get("flow") || "register";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(0);
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
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white px-4 pt-[51px] pb-6 md:px-12 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        {/* Desktop logo and wordmark */}
        <div className="hidden md:block">
          <img
            src={desktopLogo}
            alt="OjaHub"
            className="w-[130px] h-[48.89px] object-contain"
          />
        </div>

        {/* Desktop back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="hidden items-center gap-1 rounded-full bg-[#E3E7E5] px-[10px] py-[6px] text-sm text-[#1F2A24] md:flex"
        >
          <ChevronLeft size={14} />
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
      <div className="mx-auto mt-10 flex min-h-[calc(100vh-120px)] w-full max-w-[611px] flex-col items-center text-center md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:h-[551px] md:min-h-0 md:-translate-x-1/2 md:-translate-y-1/2">
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
          <h1 className="mx-auto h-[34px] w-[211px] whitespace-nowrap text-[30px] leading-[34px] font-bold text-[#1F2A24] md:h-[44px] md:w-[234px] md:text-[34px] md:leading-[1]">
            Enter your OTP
          </h1>

          {/* Description */}
          <p className="mx-auto mt-2 flex w-full flex-col items-start text-[16px] leading-[1] font-medium text-gray-500 md:flex-row md:items-center md:justify-center">
            <span className="whitespace-nowrap">
              We sent a 6-digit code to your email address.
            </span>

            <button
              type="button"
              className="mt-1 font-medium text-[#258B55] hover:underline md:mt-0 md:ml-1"
            >
              Change verification method
            </button>
          </p>

          {/* Verification code inputs */}
          <div className="mx-auto mt-6 w-fit">
            <p className="mb-3 text-left text-[24px] leading-[1] font-bold text-[#1F2A24]">
              Verification code
            </p>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  className={`h-12 w-12 rounded-lg border border-gray-300 text-center outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55] ${
                    digit
                      ? "bg-[#E7F3EC] text-[#1F2A24]"
                      : "bg-white text-[#1F2A24]"
                  } md:h-[70px] md:w-[60px] md:rounded-[10px] md:px-3 md:py-[10px] md:text-[30px] md:leading-[1] md:font-bold`}
                  aria-label={`Verification digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Resend countdown */}
            <div className="mt-4 flex justify-start md:justify-center">
              {resendCountdown > 0 ? (
                <div className="flex items-center gap-1 rounded-full bg-[#E8F0EC] px-3 py-1 text-xs text-gray-500">
                  <Clock3 size={12} />
                  Resend code in 0:{String(resendCountdown).padStart(2, "0")}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOtp(["", "", "", "", "", ""]);

                    setResendCountdown(54);
                  }}
                  className="text-xs font-medium text-[#258B55] hover:underline md:text-sm"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Bottom section */}
        <div className="mt-auto flex w-full flex-col items-center gap-3 md:mt-8">
          {/* Notification */}
          <div className="order-1 flex w-full max-w-[358px] items-center justify-start gap-[10px] rounded-[10px] border border-[#D1D1D1] px-[10px] py-[6px] text-left md:order-2 md:max-w-[500px] md:justify-center md:border-0 md:px-0 md:py-0">
            <img
              src={notificationBell}
              alt=""
              className="h-[24px] w-[27px] shrink-0 object-contain md:hidden"
            />

            <p className="w-[315px] text-[14px] leading-[1] font-medium tracking-[-0.02em] text-[#95A19C] md:w-[500px] md:text-[16px] md:leading-[1] md:tracking-[-0.02em] md:text-center md:text-[#727E79]">
              This number also gets your payment and low stock alerts
            </p>
          </div>

          {/* Verify button */}
          <button
            type="button"
            disabled={otp.some((digit) => digit === "")}
            onClick={() => {
              alert(
                "OTP verification is not available yet. Please try again when SMS verification is enabled.",
              );
            }}
            className="order-2 flex h-[44px] w-full max-w-[358px] items-center justify-center gap-[6px] rounded-[60px] bg-[#2E8B57] px-[10px] py-[12px] text-[16px] leading-[1] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 md:order-1 md:h-[56px] md:max-w-[500px] md:rounded-[60px] md:bg-[#2E8B57] md:px-[10px] md:py-[12px] md:text-[18px] md:font-bold"
          >
            Verify and continue
          </button>
        </div>
      </div>
    </div>
  );
}
