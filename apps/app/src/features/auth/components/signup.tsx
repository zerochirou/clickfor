"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { handleGoogleAuth } from "../lib/handle-google-auth";
import { handleGithubAuth } from "../lib/handle-github-auth";
import { handleMicrosoftAuth } from "../lib/handle-microsoft-auth";

// --- Testimonials Data ---
const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "I was able to reduce the time taken to present high-level designs by 35% using the platform.",
    author: "Sara Bright",
    role: "Freelancer Designer",
    tags: ["Community of designers", "Creative resources"],
  },
  {
    id: 2,
    quote:
      "Clickfor completely changed the way we build and publish storefronts. Speed and flexibility are unmatched.",
    author: "Alex Rivera",
    role: "Head of Product",
    tags: ["Digital commerce", "Developer tools"],
  },
  {
    id: 3,
    quote:
      "Everything from workspace management to instant checkout works flawlessly out of the box.",
    author: "Elena Rostova",
    role: "E-commerce Founder",
    tags: ["Creator ecosystem", "Scale & growth"],
  },
];

// --- Icons ---
function BrandBoltIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="signupBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#FF5722" />
          <stop offset="100%" stopColor="#E64A19" />
        </linearGradient>
      </defs>
      <path
        d="M13.5 1.5L4 13.5H11.5L9.5 22.5L20 10.5H12.5L13.5 1.5Z"
        fill="url(#signupBoltGrad)"
        stroke="#FF5722"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
      />
    </svg>
  );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2.02.6-2.66 1.35-.56.65-.96 1.72-.83 2.76.99.08 1.97-.49 2.57-1.24z" />
    </svg>
  );
}

// --- Right Showcase Component ---
export function SignUpShowcase() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const testimonial = TESTIMONIALS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] rounded-[32px] overflow-hidden p-8 sm:p-10 flex flex-col justify-between shadow-2xl select-none">
      {/* Dynamic Warm Sunset Fluid Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[#341810]" />

      {/* Base warm rich gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 85% 15%, #ffd2a0 0%, #fb923c 28%, #ea580c 52%, #c2410c 74%, #431407 100%)",
        }}
      />

      {/* Layered fluid organic blurred glow circles matching screenshot */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[80%] h-[75%] rounded-full bg-[#fed7aa] opacity-90 blur-[85px] pointer-events-none mix-blend-screen"
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] -left-[15%] w-[90%] h-[70%] rounded-full bg-[#ea580c] opacity-95 blur-[70px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[15%] right-[5%] w-[85%] h-[60%] rounded-full bg-[#9a3412] opacity-90 blur-[90px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[75%] h-[60%] rounded-full bg-[#270e06] opacity-95 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle organic light sheen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)",
        }}
      />

      {/* Top Floating Glass Badges */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {testimonial.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-white/95 text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:bg-white/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Area: Testimonial Floating Glass Card + Carousel Navigation */}
      <div className="relative z-10 flex flex-col gap-5 mt-auto">
        <div className="relative rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 p-7 sm:p-8 text-white shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <p className="text-xl sm:text-2xl lg:text-[25px] font-normal leading-snug tracking-tight text-white/95 font-sans">
                {testimonial.quote}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="font-semibold text-base sm:text-lg text-white tracking-tight">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/75 font-normal">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Squircle Carousel Buttons Docked at Bottom Right */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="size-12 rounded-2xl bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 flex items-center justify-center shadow-lg transition-all border border-white/40 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-800" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="size-12 rounded-2xl bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 flex items-center justify-center shadow-lg transition-all border border-white/40 cursor-pointer"
          >
            <ArrowRight
              className="w-5 h-5 text-neutral-800"
              strokeWidth={2.2}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Left Sign Up Form Component ---
export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSocialLoading, setIsSocialLoading] = React.useState<string | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3001");

      const res = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: `${origin}/workspace`,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to create account.");
      } else {
        toast.success("Account created successfully!");
        router.push("/workspace");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (
    provider: "google" | "github" | "microsoft",
  ) => {
    setIsSocialLoading(provider);
    try {
      if (provider === "google") await handleGoogleAuth();
      else if (provider === "github") await handleGithubAuth();
      else if (provider === "microsoft") await handleMicrosoftAuth();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Social signup failed.";
      toast.error(message);
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center py-6 sm:py-10">
      {/* Brand Icon & Heading */}
      <div className="flex flex-col gap-2 mb-7">
        <div className="mb-2 inline-flex items-center gap-2">
          <BrandBoltIcon className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
          Start exploring and utilizing all the resources that will help you
          elevate every design you make.
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-name"
            className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoComplete="name"
            className="w-full h-13 px-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-base focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-email"
            className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            autoComplete="email"
            className="w-full h-13 px-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-base focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-password"
            className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              autoComplete="new-password"
              className="w-full h-13 px-4.5 pr-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-base focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-orange-500/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-13 mt-2 rounded-2xl bg-gradient-to-r from-[#ff5722] via-[#ff6b2c] to-[#ff7a33] hover:from-[#f4511e] hover:to-[#ff6b2c] active:scale-[0.99] text-white font-medium text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <span className="relative bg-white dark:bg-neutral-950 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          OR
        </span>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={() => handleSocialSignUp("google")}
          disabled={!!isSocialLoading}
          aria-label="Sign up with Google"
          className="h-13 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-neutral-300 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isSocialLoading === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSocialSignUp("github")}
          disabled={!!isSocialLoading}
          aria-label="Sign up with GitHub"
          className="h-13 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-neutral-300 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-neutral-900 dark:text-white disabled:opacity-50"
        >
          {isSocialLoading === "github" ? (
            <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
          ) : (
            <GithubIcon className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSocialSignUp("microsoft")}
          disabled={!!isSocialLoading}
          aria-label="Sign up with Apple"
          className="h-13 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-neutral-300 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-neutral-900 dark:text-white disabled:opacity-50"
        >
          {isSocialLoading === "microsoft" ? (
            <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
          ) : (
            <AppleIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Footer Link */}
      <div className="mt-7 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#ff5722] font-semibold hover:underline transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

// --- Complete 2-Column Sign Up Page Layout ---
export function SignUpPageContent() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-neutral-950 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {/* Left Column: Form */}
        <div className="flex items-center justify-center w-full px-2 sm:px-6">
          <SignUpForm />
        </div>

        {/* Right Column: Showcase Card */}
        <div className="w-full h-full flex items-center justify-center">
          <SignUpShowcase />
        </div>
      </div>
    </main>
  );
}

// Backward-compatible component wrappers
export function SignUpBackground({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-neutral-950 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {children}
    </main>
  );
}

export function SignUpHeader() {
  return null;
}

export function SignUpContent() {
  return <SignUpPageContent />;
}

export function SignUpFooter() {
  return null;
}
