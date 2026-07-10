import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, Metric, PageHeader, StatusPill } from "@/components/app/primitives";
import {
  Activity, AlertTriangle, ArrowRight, Boxes, Clock, Cpu, Database, HardDrive,
  Network, Server, Sparkles, Thermometer, TrendingUp,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { activities, alerts, datastores, healthScore, network, servers, seriesTimeline, vms } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const chartColors = ["var(--color-info)", "var(--color-success)", "var(--color-accent)", "var(--color-destructive)", "var(--color-chart-5)"];

function Dashboard() {
  const data = seriesTimeline(24, 55, 30, 7);
  const health = healthScore();
  const critical = alerts.filter((a) => a.severity === "critical" && !a.resolved).length;
  const totalCap = datastores.reduce((s, d) => s + d.capacityTB, 0);
  const usedCap = datastores.reduce((s, d) => s + d.usedTB, 0);

  const distribution = [
    { name: "Healthy", value: servers.filter((s) => s.status === "healthy").length + vms.filter((v) => v.status === "healthy").length },
    { name: "Warning", value: servers.filter((s) => s.status === "warning").length + vms.filter((v) => v.status === "warning").length },
    { name: "Critical", value: servers.filter((s) => s.status === "critical").length + vms.filter((v) => v.status === "critical").length },
    { name: "Offline", value: servers.filter((s) => s.status === "offline").length + vms.filter((v) => v.status === "offline").length },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Infrastructure Command Center"
        subtitle="Live health, capacity, and telemetry across every workload."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> All regions online
            </span>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
            >
              Generate report <ArrowRight className="h-3 w-3" />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Health score" value={`${health}/100`} delta={`▲ 2 vs. last hour`} icon={Activity} color="success" />
        <Metric label="Physical servers" value={String(servers.length)} delta={`${servers.filter((s) => s.status === "healthy").length} healthy`} icon={Server} color="info" />
        <Metric label="Virtual machines" value={String(vms.length)} delta={`${vms.filter((v) => v.status !== "healthy").length} need attention`} icon={Boxes} color="primary" />
        <Metric label="Active alerts" value={String(alerts.filter((a) => !a.resolved).length)} delta={`${critical} critical`} icon={AlertTriangle} color={critical > 0 ? "destructive" : "warning"} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Resource utilization</div>
              <div className="text-lg font-semibold">Fleet performance (24h)</div>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              {["CPU", "Memory", "Network", "Storage"].map((k, i) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: chartColors[i] }} />
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <defs>
                  {["cpu", "memory", "network", "storage"].map((k, i) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={chartColors[i]} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={chartColors[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                {["cpu", "memory", "network", "storage"].map((k, i) => (
                  <Area key={k} type="monotone" dataKey={k} stroke={chartColors[i]} fill={`url(#g-${k})`} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Fleet distribution</div>
          <div className="text-lg font-semibold">Status breakdown</div>
          <div className="mt-2 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={distribution} innerRadius={54} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {distribution.map((_, i) => (
                    <Cell key={i} fill={chartColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
            {distribution.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Storage capacity</div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{Math.round((usedCap / totalCap) * 100)}%</div>
          <div className="text-xs text-muted-foreground">
            {usedCap.toFixed(1)} TB used of {totalCap} TB
          </div>
          <div className="mt-4 space-y-2">
            {datastores.slice(0, 4).map((d) => (
              <div key={d.id}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span>{Math.round((d.usedTB / d.capacityTB) * 100)}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-info via-primary to-accent"
                    style={{ width: `${(d.usedTB / d.capacityTB) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Top servers by CPU</div>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={[...servers].sort((a, b) => b.cpu - a.cpu).slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} width={100} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="cpu" fill="var(--color-accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Network throughput</div>
            <Network className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="network" stroke="var(--color-info)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-muted-foreground">Devices</div>
              <div className="mt-0.5 text-sm font-semibold">{network.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg latency</div>
              <div className="mt-0.5 text-sm font-semibold">1.8 ms</div>
            </div>
            <div>
              <div className="text-muted-foreground">Loss</div>
              <div className="mt-0.5 text-sm font-semibold">0.04%</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Recent alerts</div>
            <Link to="/alerts" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {alerts.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-3">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg ${
                    a.severity === "critical"
                      ? "bg-destructive/15 text-destructive"
                      : a.severity === "warning"
                        ? "bg-accent/15 text-accent"
                        : "bg-info/15 text-info"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.source} · {new Date(a.time).toLocaleTimeString()}
                  </div>
                </div>
                <StatusPill status={a.severity} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Recent activity</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="space-y-3 text-sm">
            {activities.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-info to-primary text-[10px] font-semibold text-primary-foreground">
                  {a.user.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{a.user}</span> {a.action}{" "}
                  <span className="font-medium text-foreground">{a.target}</span>
                  <div className="mt-0.5">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <QuickAction icon={Server} label="Add server" to="/infrastructure/servers" />
        <QuickAction icon={Boxes} label="Create VM" to="/infrastructure/vms" />
        <QuickAction icon={AlertTriangle} label="View alerts" to="/alerts" />
        <QuickAction icon={Sparkles} label="Ask CloudAxis AI" />
      </div>
    </>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
}) {
  const inner = (
    <div className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-accent/60">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div className="text-sm font-medium">{label}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <button className="text-left">{inner}</button>;
}
