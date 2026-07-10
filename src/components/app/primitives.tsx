import { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className}`}>{children}</div>
  );
}

export function Metric({
  label,
  value,
  delta,
  icon: Icon,
  color = "info",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "info" | "success" | "warning" | "destructive" | "primary";
}) {
  const map: Record<string, string> = {
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
    warning: "bg-accent/15 text-accent",
    destructive: "bg-destructive/15 text-destructive",
    primary: "bg-primary/15 text-primary",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
          {delta ? <div className="mt-1 text-xs text-muted-foreground">{delta}</div> : null}
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${map[color]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </motion.div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    healthy: "bg-success/15 text-success border-success/30",
    warning: "bg-accent/15 text-accent border-accent/30",
    critical: "bg-destructive/15 text-destructive border-destructive/30",
    offline: "bg-muted text-muted-foreground border-border",
    Active: "bg-success/15 text-success border-success/30",
    Retired: "bg-muted text-muted-foreground border-border",
    "In Stock": "bg-info/15 text-info border-info/30",
    info: "bg-info/15 text-info border-info/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
