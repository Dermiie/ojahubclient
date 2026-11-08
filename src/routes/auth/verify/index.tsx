import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Smartphone, Clock3, Bell } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const phoneNumber = (location.state as { phoneNumber?: string } | null)
    ?.phoneNumber;

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
    <div className="min-h-screen w-full bg-white px-6 py-6 md:px-12 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        {/* Desktop logo and wordmark */}
        <div className="hidden md:block">
          <img
            src={desktopLogo}
            alt="OjaHub"
            className="w-[110px] h-auto object-contain"
          />
        </div>

        {/* Desktop back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="hidden rounded-full bg-[#E8F0EC] px-4 py-2 text-sm text-[#26332D] md:block"
        >
          ‹ Back to login
        </button>

        {/* Mobile back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#26332D] md:hidden"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </header>

      {/* OTP Content */}
      <div className="mx-auto mt-6 flex min-h-[calc(100vh-120px)] w-full max-w-[500px] flex-col items-center text-center md:mt-0 md:min-h-[calc(100vh-120px)] md:justify-center">
        {/* Top OTP section */}
        <div className="w-full">
          {/* Phone icon */}
          <div className="mx-auto mb-4 flex h-[90px] w-[90px] items-center justify-center rounded-2xl bg-[#E8F5EC]">
            <Smartphone size={32} className="text-[#258B55]" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#26332D]">Enter your OTP</h1>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit code to{" "}
            <strong>{phoneNumber || "your phone number"}</strong>.
            <button
              type="button"
              className="ml-1 font-medium text-[#258B55] hover:underline"
            >
              Change verification method
            </button>
          </p>

          {/* Verification code inputs */}
          <div className="mt-6 w-full">
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
                  className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold text-[#26332D] outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55]"
                  aria-label={`Verification digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Resend countdown */}
            <div className="mt-4 flex justify-center">
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
                  className="text-xs font-medium text-[#258B55] hover:underline"
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
          <div className="order-1 flex w-full max-w-[335px] items-center justify-start gap-2 rounded-lg border border-gray-200 px-3 py-3 text-left md:order-2 md:justify-center md:border-0 md:px-0 md:py-0">
            <Bell size={16} className="shrink-0 text-gray-400 md:hidden" />

            <p className="text-xs text-gray-500">
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
            className="order-2 w-full max-w-[335px] rounded-full bg-[#258B55] py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 md:order-1"
          >
            Verify and continue
          </button>
        </div>
      </div>
    </div>
  );
}
