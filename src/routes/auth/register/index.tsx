import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      alert("Please complete all fields.");
      return;
    }

    // Check password length
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Your password must contain at least 8 characters.");
      return;
    }

    navigate("/auth/verify?flow=register", {
      state: {
        phoneNumber: `+234${phoneNumber}`,
      },
    });
  };

  return (
    <div className="flex w-full items-start justify-center px-0 py-0 md:min-h-screen md:items-center md:px-8 md:py-10">
      <div className="w-full max-w-[500px]">
        <h1 className="text-2xl font-bold text-[#26332D]">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Set up your shop in 3 minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full name */}
          <div>
            <label className="mb-2 block text-sm font-medium">Full name</label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone number
            </label>

            <div className="flex overflow-hidden rounded-xl border border-gray-300">
              <span className="border-r border-gray-300 px-3 py-3 text-sm">
                NG +234
              </span>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="803 000 0000"
                className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-16 text-sm outline-none focus:border-green-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#278B53] py-3 text-sm font-semibold text-white transition hover:bg-[#207544]"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="font-medium text-[#278B53] hover:underline"
          >
            Log in
          </button>
        </p>

        <p className="mt-3 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <span className="text-[#278B53] cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#278B53] cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
