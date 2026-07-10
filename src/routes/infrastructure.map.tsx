import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { motion } from "framer-motion";
import { Boxes, Building2, Cloud, Server, Users } from "lucide-react";
import { servers, vms } from "@/lib/mock-data";

export const Route = createFileRoute("/infrastructure/map")({
  head: () => ({ meta: [{ title: "Infrastructure Map — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Infrastructure" title="Live Infrastructure Map" subtitle="Physical → Virtual → Applications → Departments → Users" />
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <Row title="Physical servers" icon={Server} count={servers.length} color="info">
            {servers.slice(0, 8).map((s) => (
              <Node key={s.id} label={s.name} sub={s.location} status={s.status} />
            ))}
          </Row>
          <Connectors />
          <Row title="Virtual machines" icon={Boxes} count={vms.length} color="primary">
            {vms.slice(0, 10).map((v) => (
              <Node key={v.id} label={v.name} sub={v.host} status={v.status} />
            ))}
          </Row>
          <Connectors />
          <Row title="Applications" icon={Cloud} count={18} color="accent">
            {["billing", "ledger", "auth-svc", "kafka", "grafana", "search"].map((n) => (
              <Node key={n} label={n} sub="production" status="healthy" />
            ))}
          </Row>
          <Connectors />
          <Row title="Departments" icon={Building2} count={7} color="success">
            {["Engineering", "Finance", "Ops", "R&D", "Sales", "IT", "Security"].map((n) => (
              <Node key={n} label={n} sub="" status="healthy" />
            ))}
          </Row>
          <Connectors />
          <Row title="Users" icon={Users} count={420} color="destructive">
            {["Alex", "Priya", "Marcus", "Yuki", "Sofia", "Daniel"].map((n) => (
              <Node key={n} label={n} sub="active" status="healthy" />
            ))}
          </Row>
        </div>
      </Card>
    </AppShell>
  ),
});

const colors: Record<string, string> = {
  info: "bg-info/15 text-info border-info/30",
  primary: "bg-primary/15 text-primary border-primary/30",
  accent: "bg-accent/15 text-accent border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
};

function Row({
  title,
  icon: Icon,
  count,
  color,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg border ${colors[color]}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">· {count}</span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Node({ label, sub, status }: { label: string; sub: string; status: string }) {
  const dot = status === "healthy" ? "bg-success" : status === "warning" ? "bg-accent" : status === "critical" ? "bg-destructive" : "bg-muted-foreground";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex min-w-32 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot} pulse-dot`} />
      <div>
        <div className="text-xs font-medium leading-none">{label}</div>
        {sub ? <div className="mt-0.5 text-[10px] text-muted-foreground">{sub}</div> : null}
      </div>
    </motion.div>
  );
}

function Connectors() {
  return (
    <div className="my-2 flex justify-center">
      <div className="h-8 w-px bg-gradient-to-b from-border via-accent/50 to-border" />
    </div>
  );
}
