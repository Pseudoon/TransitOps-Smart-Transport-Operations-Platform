"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Radio,
  ArrowRight,
  ShieldCheck,
  Truck,
  BarChart3,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

const ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
] as const;
type Role = (typeof ROLES)[number];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("ops@transitops.io");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("Fleet Manager");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data.token, { name: data.name, role: data.role as any });
      router.push("/");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Radio className="size-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">TransitOps</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Fleet Control Console
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Smart Transport Operations
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">
              Every vehicle, every driver, every rupee — one console.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Dispatch smarter, spot idle assets, prevent expired licences, and
              close the loop on fuel and maintenance costs in real time.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Truck,
                  title: "Live fleet visibility",
                  desc: "Know every vehicle's status the moment it changes.",
                },
                {
                  icon: ShieldCheck,
                  title: "Compliance by default",
                  desc: "Expired licences and overloads blocked at dispatch.",
                },
                {
                  icon: BarChart3,
                  title: "Cost-to-serve analytics",
                  desc: "Fuel, maintenance, and ROI on every asset.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 TransitOps · Built for logistics teams that move.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-primary">
              <Radio className="size-5 text-primary-foreground" />
            </div>
            <p className="font-display text-xl font-bold">TransitOps</p>
          </div>

          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your operations console. Demo credentials pre-filled.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 pr-10 text-sm text-foreground outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sign in as
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const active = r === role;
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      aria-pressed={active}
                      className={
                        "rounded-lg border px-3 py-2 text-xs font-medium transition " +
                        (active
                          ? "border-primary bg-primary/15 text-primary shadow-glow"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground")
                      }
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Enter console as {role}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              Prototype build —{" "}
              <Link href="/" className="text-primary hover:underline">
                skip to dashboard
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
