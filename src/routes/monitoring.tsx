import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { seriesTimeline } from "@/lib/mock-data";
import { Cpu, HardDrive, MemoryStick, Network, Thermometer } from "lucide-react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Monitoring />
    </AppShell>
  ),
});

function Monitoring() {
  const [data, setData] = useState(() => seriesTimeline(20, 55, 30, 7));
  useEffect(() => {
    const t = setInterval(() => {
      setData((d) => {
        const next = d.slice(1);
        const last = d[d.length - 1];
        const jitter = (v: number) => Math.max(5, Math.min(99, v + Math.round((Math.random() - 0.5) * 12)));
        next.push({
          t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          cpu: jitter(last.cpu),
          memory: jitter(last.memory),
          network: jitter(last.network),
          storage: jitter(last.storage),
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Real-time Monitoring"
        subtitle="Live telemetry stream — updated every 1.5s"
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> Live
          </span>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: "cpu", label: "CPU utilization", icon: Cpu, color: "var(--color-info)" },
          { key: "memory", label: "Memory pressure", icon: MemoryStick, color: "var(--color-success)" },
          { key: "network", label: "Network throughput", icon: Network, color: "var(--color-accent)" },
          { key: "storage", label: "Storage I/O", icon: HardDrive, color: "var(--color-destructive)" },
        ].map((m) => {
          const cur = data[data.length - 1][m.key as "cpu"];
          return (
            <Card key={m.key}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground">
                    <m.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{m.label}</div>
                    <div className="text-lg font-semibold tabular-nums">{cur}%</div>
                  </div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id={`g-${m.key}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={m.color} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey={m.key} stroke={m.color} fill={`url(#g-${m.key})`} strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
