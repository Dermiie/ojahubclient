import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router";
import { Eye, EyeOff, ChevronLeft, Check } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";
import { parseApiError } from "@/api/api";
import { useForgotPassword, useResetPassword } from "@/api/auth/authApi";
import { strongPasswordSchema } from "@/lib/validations";

export default function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive the email and the code from the previous pages
  const routeState = location.state as { email?: string; otp?: string } | null;
  const email = routeState?.email;
  const otp = routeState?.otp;

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback from the server
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate: resetPassword, isPending: isSaving } = useResetPassword();
  const { mutate: sendNewCode, isPending: isResending } = useForgotPassword();

  // Password requirements
  // (same rules as registration, see strongPasswordSchema)
  const hasValidLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const allRequirementsMet =
    hasValidLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;

  // Calculate password strength (how many of the 5 rules are met)
  const strengthScore =
    Number(hasValidLength) +
    Number(hasUppercase) +
    Number(hasLowercase) +
    Number(hasNumber) +
    Number(hasSpecial);
  const strengthLabel =
    strengthScore <= 2 ? "weak" : strengthScore <= 4 ? "fair" : "strong";
  // 0 rules = 0 bars, 1-2 rules = 1 bar, then one more bar per rule, 5 rules = 4 bars
  const activeBars =
    strengthScore <= 2 ? Math.min(strengthScore, 1) : strengthScore - 1;

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55] md:h-[54px] md:rounded-[18px] md:px-5 md:text-[18px]";

  const chipClass = (met: boolean) =>
    `flex items-center gap-[6px] rounded-full px-2 py-1 text-xs md:px-[14px] md:py-[6px] md:text-[15px] md:font-semibold ${
      met ? "bg-[#E7F3EC] text-[#258B55]" : "bg-gray-100 text-gray-500"
    }`;

  // Opened directly (no email or code from the verify page): send them back to start
  if (!email || !otp) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  const handleSave = () => {
    setErrorMessage("");

    if (!allRequirementsMet) {
      alert("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      alert("Your passwords do not match.");
      return;
    }

    // Same password rules as registration
    const strength = strongPasswordSchema.safeParse(newPassword);
    if (!strength.success) {
      setErrorMessage(strength.error.issues[0].message);
      return;
    }

    resetPassword(
      { email, otp, newPassword },
      {
        onSuccess: (message) => {
          setSuccessMessage(message);
          setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
        },
        onError: (error) => {
          const { message, fieldErrors } = parseApiError(error);

          // Wrong or expired code: send the user back to enter it again
          const isOtpProblem =
            Boolean(fieldErrors.otp) ||
            (/\b(otp|code)\b/i.test(message) && !/password/i.test(message));

          if (isOtpProblem) {
            navigate("/auth/verify?flow=forgot-password", {
              replace: true,
              state: { email, codeSent: true, errorMessage: message },
            });
            return;
          }

          // Anything else (e.g. "can't reuse your old password") stays here
          setErrorMessage(fieldErrors.newPassword ?? message);
        },
      },
    );
  };

  // Request a fresh code, then go back to the verify page to enter it
  const handleResend = () => {
    setErrorMessage("");

    sendNewCode(
      { email },
      {
        onSuccess: () => {
          navigate("/auth/verify?flow=forgot-password", {
            replace: true,
            state: { email, codeSent: true },
          });
        },
        onError: (error) => {
          setErrorMessage(parseApiError(error).message);
        },
      },
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-white px-6 py-6 md:p-0">
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
          onClick={() => navigate("/auth/login")}
          className="hidden items-center gap-[4px] rounded-full bg-[#E3E7E5] px-[8px] py-[4px] text-[11px] leading-none text-[#1F2A24] md:flex"
        >
          <ChevronLeft size={10} />
          Back to login
        </button>

        {/* Mobile back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-1 text-sm text-[#26332D] md:hidden"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </header>

      {/* Password form area */}
      <main className="flex min-h-[calc(100vh-120px)] flex-col md:min-h-screen md:items-center md:justify-center">
        <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-between md:flex-none md:justify-start md:[zoom:0.6]">
          {/* Page heading */}
          <div className="mt-8 md:mt-0">
            <h1 className="text-2xl font-bold text-[#26332D] md:text-[32px] md:leading-[44px]">
              Set a new password
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 md:mt-[6px] md:max-w-[440px] md:text-[15px]">
              Choose a new password for{" "}
              <strong className="text-[#1F2A24]">
                {email || "your email address"}
              </strong>
              .
            </p>
          </div>

          {/* New password field */}
          <div className="mt-8 md:mt-6">
            <label className="mb-2 block text-sm font-medium text-[#26332D] md:mb-3 md:text-[18px]">
              New password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                maxLength={16}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter new password"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 md:right-5"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Password strength */}
          <div className="mt-4 md:mt-[33px]">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-1 gap-2 md:gap-[14px]">
                {[0, 1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1.5 flex-1 rounded-full md:h-[5px] ${
                      bar < activeBars ? "bg-[#258B55]" : "bg-[#D6EADF]"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-[#258B55] md:pr-[18px] md:text-[15px]">
                {strengthLabel}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 md:mt-4 md:gap-[10px]">
              <span className={chipClass(hasValidLength)}>
                {hasValidLength ? <Check size={14} /> : <span>○</span>}
                8-16 characters
              </span>

              <span className={chipClass(hasUppercase)}>
                {hasUppercase ? <Check size={14} /> : <span>○</span>}
                Uppercase letter
              </span>

              <span className={chipClass(hasLowercase)}>
                {hasLowercase ? <Check size={14} /> : <span>○</span>}
                Lowercase letter
              </span>

              <span className={chipClass(hasNumber)}>
                {hasNumber ? <Check size={14} /> : <span>○</span>}A number
              </span>

              <span className={chipClass(hasSpecial)}>
                {hasSpecial ? <Check size={14} /> : <span>○</span>}
                Special character
              </span>
            </div>
          </div>

          {/* Confirm password field */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-[#26332D] md:mb-3 md:text-[18px]">
              Confirm new password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Type it again"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 md:right-5"
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-xs text-red-500 md:text-[14px]">
              Passwords do not match.
            </p>
          )}

          {/* Error or success message from the server */}
          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 md:text-[15px]"
            >
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-[#E7F3EC] px-3 py-2.5 text-sm text-[#258B55] md:text-[15px]"
            >
              {successMessage}
            </p>
          )}

          {/* Save new password button */}
          <div className="mt-auto md:mt-[34px]">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || Boolean(successMessage)}
              className="mt-6 w-full rounded-full bg-[#2E8B57] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1F7548] disabled:cursor-not-allowed disabled:opacity-50 md:mt-0 md:h-[54px] md:py-0 md:text-[18px] md:font-bold"
            >
              {isSaving ? "Saving..." : "Save new password"}
            </button>

            {/* Resend code */}
            <p className="mt-4 text-center text-xs text-gray-500 md:mt-6 md:text-[15px]">
              Didn't get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-bold text-[#258B55] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
