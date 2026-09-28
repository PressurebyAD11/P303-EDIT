import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.08 2.22.74 2.97.8.95-.19 1.85-.9 2.97-.97 1.37-.1 2.37.54 3.01 1.43-2.73 1.63-2.31 5.33.47 6.37-.56 1.48-1.3 2.96-2.42 4.25zM12 6.12c-.14-2.36 1.84-4.3 4.04-4.12.26 2.47-2.23 4.42-4.04 4.12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  function handleLogin(provider: "google" | "apple") {
    login(provider);
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-svh bg-foreground text-background flex flex-col select-none">
      {/* Hero wordmark */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
        <p className="text-[10px] tracking-[0.5em] uppercase text-background/40 font-medium">
          Personal styling
        </p>
        <h1 className="text-[clamp(5rem,22vw,8rem)] font-black tracking-tighter leading-none text-background">
          EDIT
        </h1>
        <p className="text-sm text-background/50 max-w-[260px] leading-relaxed mt-1">
          Curated outfits from the closet you already own.
        </p>
      </div>

      {/* Auth buttons */}
      <div className="px-6 pb-14 flex flex-col gap-3">
        <button
          onClick={() => handleLogin("apple")}
          className="flex items-center justify-center gap-3 h-14 w-full rounded-2xl bg-background text-foreground text-sm font-semibold tracking-wide hover:bg-background/90 active:scale-[0.98] transition-all"
        >
          <AppleIcon />
          Continue with Apple
        </button>
        <button
          onClick={() => handleLogin("google")}
          className="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-background/20 text-background text-sm font-semibold tracking-wide hover:bg-background/8 active:scale-[0.98] transition-all"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <p className="text-center text-[10px] text-background/25 mt-3 leading-relaxed px-4">
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
