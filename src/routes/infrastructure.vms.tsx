import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { vms as initialVms, VM } from "@/lib/mock-data";
import { Boxes, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/infrastructure/vms")({
  head: () => ({ meta: [{ title: "Virtual Machines — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <VMs />
    </AppShell>
  ),
});

function VMs() {
  const [rows, setRows] = useState<VM[]>(initialVms);

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Virtual Machines"
        subtitle={`${rows.length} VMs across ${new Set(rows.map((v) => v.host)).size} hosts`}
        actions={
          <button
            onClick={() => {
              setRows((r) => [
                {
                  id: `VM-${Math.floor(Math.random() * 9999)}`,
                  name: `vm-new-${r.length + 1}`,
                  host: r[0].host,
                  os: "Ubuntu 22.04",
                  vCPU: 4,
                  memoryGB: 16,
                  diskGB: 80,
                  cpu: 8,
                  memory: 20,
                  status: "healthy",
                  ip: "10.20.0.1",
                  owner: "Alex Chen",
                  department: "IT",
                  snapshots: 0,
                },
                ...r,
              ]);
              toast.success("VM provisioned");
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New VM
          </button>
        }
      />
      <DataTable
        rows={rows}
        columns={[
          {
            key: "name",
            label: "VM",
            render: (v) => (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Boxes className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.ip} · {v.os}</div>
                </div>
              </div>
            ),
          },
          { key: "host", label: "Host" },
          { key: "vCPU", label: "vCPU" },
          { key: "memoryGB", label: "Memory", render: (v) => `${v.memoryGB} GB` },
          { key: "diskGB", label: "Disk", render: (v) => `${v.diskGB} GB` },
          { key: "cpu", label: "CPU %", render: (v) => <span className="tabular-nums">{v.cpu}%</span> },
          { key: "snapshots", label: "Snapshots" },
          { key: "status", label: "Status", render: (v) => <StatusPill status={v.status} /> },
        ]}
      />
    </>
  );
}
