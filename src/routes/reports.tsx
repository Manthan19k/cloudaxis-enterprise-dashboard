import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { FileText, Download, Printer, Share2, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Reports />
    </AppShell>
  ),
});

const templates = [
  { name: "Daily infrastructure health", desc: "Health scores, top offenders, SLA breaches.", cadence: "Daily" },
  { name: "Weekly capacity forecast", desc: "Predictive CPU / memory / storage trends.", cadence: "Weekly" },
  { name: "Monthly executive summary", desc: "High-level KPIs and incident summary for leadership.", cadence: "Monthly" },
  { name: "Security & compliance audit", desc: "RBAC changes, login anomalies, patch status.", cadence: "Monthly" },
  { name: "Datastore utilization", desc: "Per-datastore usage and growth curves.", cadence: "Weekly" },
  { name: "Alert response times", desc: "MTTA and MTTR broken down by team.", cadence: "Weekly" },
];

function Reports() {
  const gen = (format: string, name: string) => toast.success(`${name} exported as ${format.toUpperCase()}`);
  return (
    <>
      <PageHeader eyebrow="Operations" title="Reports" subtitle="Generate, schedule and share operational reports." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.name}>
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                {t.cadence}
              </span>
            </div>
            <div className="mt-3 font-semibold">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.desc}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["PDF", "Excel", "CSV"].map((f) => (
                <button
                  key={f}
                  onClick={() => gen(f, t.name)}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:text-foreground"
                >
                  <Download className="h-3 w-3" /> {f}
                </button>
              ))}
              <button
                onClick={() => toast.success("Print dialog opened")}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs"
              >
                <Printer className="h-3 w-3" /> Print
              </button>
              <button
                onClick={() => toast.success("Share link copied")}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs"
              >
                <Share2 className="h-3 w-3" /> Share
              </button>
              <button
                onClick={() => toast.success("Schedule saved")}
                className="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground"
              >
                <Calendar className="h-3 w-3" /> Schedule
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
