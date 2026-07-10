import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { seriesTimeline, servers, vms, datastores } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Analytics />
    </AppShell>
  ),
});

function Analytics() {
  const trend = seriesTimeline(24, 60, 25, 55);
  const forecast = Array.from({ length: 12 }).map((_, i) => ({
    m: `M${i + 1}`,
    servers: Math.round(servers.length * (1 + i * 0.04)),
    vms: Math.round(vms.length * (1 + i * 0.06)),
    storage: Math.round(datastores.reduce((s, d) => s + d.usedTB, 0) * (1 + i * 0.05)),
  }));
  return (
    <>
      <PageHeader eyebrow="Operations" title="Analytics & Forecasting" subtitle="Trends, capacity planning, and performance comparisons." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-2 text-sm font-semibold">Infrastructure trend (24h)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend />
                <Line dataKey="cpu" stroke="var(--color-info)" dot={false} strokeWidth={2} />
                <Line dataKey="memory" stroke="var(--color-success)" dot={false} strokeWidth={2} />
                <Line dataKey="storage" stroke="var(--color-accent)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-2 text-sm font-semibold">12-month capacity forecast</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="f-s" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="f-v" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend />
                <Area type="monotone" dataKey="servers" stroke="var(--color-info)" fill="url(#f-s)" strokeWidth={2} />
                <Area type="monotone" dataKey="vms" stroke="var(--color-accent)" fill="url(#f-v)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="mb-2 text-sm font-semibold">Performance comparison — top 12 servers</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={[...servers].sort((a, b) => b.cpu - a.cpu).slice(0, 12)}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={9} angle={-30} textAnchor="end" height={80} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="cpu" name="CPU %" fill="var(--color-info)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="memory" name="Memory %" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
