import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader, StatusPill } from "@/components/app/primitives";
import { datastores } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { seriesTimeline } from "@/lib/mock-data";

export const Route = createFileRoute("/infrastructure/storage")({
  head: () => ({ meta: [{ title: "Storage — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Storage />
    </AppShell>
  ),
});

function Storage() {
  const trend = seriesTimeline(24, 60, 20, 33);
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Storage & Datastores"
        subtitle={`${datastores.length} datastores · ${datastores.reduce((s, d) => s + d.capacityTB, 0)} TB provisioned`}
      />
      <Card className="mb-6">
        <div className="mb-2 text-sm font-semibold">Aggregate capacity trend (24h)</div>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="stor" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-info)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="storage" stroke="var(--color-info)" fill="url(#stor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {datastores.map((d) => {
          const pct = Math.round((d.usedTB / d.capacityTB) * 100);
          return (
            <Card key={d.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.type}</div>
                  <div className="text-lg font-semibold">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.location}</div>
                </div>
                <StatusPill status={d.status} />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold tabular-nums">{pct}%</div>
                  <div className="text-xs text-muted-foreground">
                    {d.usedTB} TB / {d.capacityTB} TB
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {(d.capacityTB - d.usedTB).toFixed(1)} TB free
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-secondary">
                <div
                  className={`h-2 rounded-full ${pct > 85 ? "bg-destructive" : pct > 70 ? "bg-accent" : "bg-success"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
