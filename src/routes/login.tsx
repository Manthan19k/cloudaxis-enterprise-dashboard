import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CircuitBoard, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — CloudAxis" },
      { name: "description", content: "Access the CloudAxis enterprise infrastructure console." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid work email"),
  password: z.string().min(6, "At least 6 characters"),
});

function LoginPage() {
  const [email, setEmail] = useState("admin@cloudaxis.io");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as "email" | "password"] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await login(email.trim(), password, remember);
      toast.success("Welcome back to CloudAxis");
      nav({ to: "/dashboard" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Log in to CloudAxis"
      subtitle="Sign in with your enterprise account to access the console."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Work email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-70"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Sign in
        </button>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </div>
        <p className="rounded-md border border-border bg-card/60 p-3 text-center text-xs text-muted-foreground">
          Demo credentials are prefilled. Any email works — prefix with <code>admin</code>, <code>eng</code>, or <code>mgr</code> to preview roles.
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent via-primary to-info shadow-glow">
              <CircuitBoard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">CloudAxis</span>
          </Link>
          <div>
            <blockquote className="max-w-md text-2xl font-medium leading-snug tracking-tight">
              “We consolidated four monitoring tools into CloudAxis in a single quarter — visibility hasn't been the same since.”
            </blockquote>
            <div className="mt-6 text-sm text-muted-foreground">Priya Rao · VP Infrastructure, Northwind</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent via-primary to-info">
                <CircuitBoard className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">CloudAxis</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <style>{`
        .input {
          width: 100%;
          background: var(--color-input);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent); }
      `}</style>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
