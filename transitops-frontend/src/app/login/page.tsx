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
  MapPin,
  Activity,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const ROLES = [
  { id: "Fleet Manager", icon: Radio },
  { id: "Driver", icon: Truck },
  { id: "Safety Officer", icon: ShieldCheck },
  { id: "Financial Analyst", icon: BarChart3 },
] as const;
type Role = (typeof ROLES)[number]["id"];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("test@transitops.io");
  const [password, setPassword] = useState("Test1234!");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("Fleet Manager");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data.token, { name: data.name, role: data.role as any });
      toast.success(`Welcome back, ${data.name}!`);
      router.push("/");
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Please check your credentials.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col">
        {/* Dynamic abstract background */}
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -left-1/4 -top-1/4 size-[800px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 size-[600px] rounded-full bg-accent/20 blur-[120px]" />

        <div className="relative flex flex-1 flex-col justify-between p-12 xl:p-16">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Radio className="size-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                TransitOps
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-primary/80">
                Fleet Control Console
              </p>
            </div>
          </div>

          {/* Main Content (Centered vertically) */}
          <div className="flex flex-col justify-center py-12">
            <div className="w-full max-w-xl">
              <h2 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                Every vehicle. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Every driver.
                </span>{" "}
                <br />
                Every rupee.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
                Dispatch smarter, spot idle assets, prevent expired licences,
                and close the loop on fuel and maintenance costs in real time.
              </p>

              {/* Mockup Floating Card */}
              <div className="mt-12 group relative w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-transform hover:-translate-y-1">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-primary/20 text-primary">
                      <Activity className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Live Dispatch Activity
                      </p>
                      <p className="text-xs text-zinc-400">
                        Updating in real-time...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/30">
                    <div className="size-1.5 animate-pulse rounded-full bg-success" />
                    System Online
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-black/40 p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid size-10 place-items-center rounded-full bg-zinc-800 text-zinc-300">
                        <Truck className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-bold text-white">
                            T-1042
                          </p>
                          <span className="rounded bg-info/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-info">
                            Dispatched
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                          <MapPin className="size-3.5 text-primary" /> Mumbai{" "}
                          <ArrowRight className="size-3 text-zinc-600" /> Pune
                          Hub
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        ETA
                      </p>
                      <p className="font-mono text-sm font-medium text-white">
                        14:30 IST
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/40 p-4">
                      <ShieldCheck className="size-5 text-success" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Compliance
                        </p>
                        <p className="text-sm font-medium text-white">
                          100% Cleared
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/40 p-4">
                      <Zap className="size-5 text-warning" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Efficiency
                        </p>
                        <p className="text-sm font-medium text-white">
                          Optimized Route
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <p>© 2026 TransitOps</p>
            <p>Built for logistics teams that move.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12">
        {/* Subtle background glow behind the form */}
        <div className="absolute top-1/2 left-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-primary">
              <Radio className="size-5 text-primary-foreground" />
            </div>
            <p className="font-display text-xl font-bold">TransitOps</p>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your operations console.
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
              <div className="mt-2 grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const active = r.id === role;
                  const Icon = r.icon;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      aria-pressed={active}
                      className={
                        "group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all " +
                        (active
                          ? "border-primary bg-primary/10 text-primary shadow-glow ring-1 ring-primary/30"
                          : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground")
                      }
                    >
                      <Icon
                        className={
                          "size-5 transition-transform " +
                          (active ? "scale-110" : "group-hover:scale-110")
                        }
                      />
                      <span className="text-xs font-medium">{r.id}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Role selection here is for display only — your actual access
                level comes from your account.
              </p>
            </div>

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

            <div className="pt-4 flex justify-center">
              <Link
                href="/"
                className="group flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
              >
                Skip to dashboard
                <ArrowRight className="size-3.5 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
