import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { alerts as initial } from "@/lib/mock-data";
import { AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Alerts />
    </AppShell>
  ),
});

function Alerts() {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const filtered = filter === "all" ? rows : rows.filter((r) => r.severity === filter);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Alert Center"
        subtitle={`${rows.filter((r) => !r.acknowledged).length} unacknowledged`}
        actions={
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(["all", "critical", "warning", "info"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <DataTable
        rows={filtered}
        columns={[
          {
            key: "title",
            label: "Alert",
            render: (a) => (
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg ${
                    a.severity === "critical" ? "bg-destructive/15 text-destructive" : a.severity === "warning" ? "bg-accent/15 text-accent" : "bg-info/15 text-info"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.source}</div>
                </div>
              </div>
            ),
          },
          { key: "severity", label: "Severity", render: (a) => <StatusPill status={a.severity} /> },
          { key: "assignee", label: "Assignee", render: (a) => a.assignee ?? <span className="text-muted-foreground">Unassigned</span> },
          {
            key: "time",
            label: "Triggered",
            render: (a) => new Date(a.time).toLocaleTimeString(),
          },
          {
            key: "acknowledged",
            label: "State",
            render: (a) => (
              <StatusPill status={a.resolved ? "healthy" : a.acknowledged ? "warning" : "critical"} />
            ),
          },
          {
            key: "id",
            label: "Actions",
            sortable: false,
            render: (a) => (
              <div className="flex gap-1">
                {!a.acknowledged ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRows((r) => r.map((x) => (x.id === a.id ? { ...x, acknowledged: true } : x)));
                      toast.success("Acknowledged");
                    }}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:text-foreground"
                  >
                    Ack
                  </button>
                ) : null}
                {!a.resolved ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRows((r) => r.map((x) => (x.id === a.id ? { ...x, resolved: true, acknowledged: true } : x)));
                      toast.success("Resolved");
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-1 text-xs text-success"
                  >
                    <Check className="h-3 w-3" /> Resolve
                  </button>
                ) : null}
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
