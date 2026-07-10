import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { network } from "@/lib/mock-data";
import { Network as NetIcon } from "lucide-react";

export const Route = createFileRoute("/infrastructure/network")({
  head: () => ({ meta: [{ title: "Networking — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Infrastructure" title="Networking" subtitle={`${network.length} network devices`} />
      <DataTable
        rows={network}
        columns={[
          {
            key: "name",
            label: "Device",
            render: (n) => (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-info/15 text-info">
                  <NetIcon className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{n.name}</div>
                  <div className="text-xs text-muted-foreground">{n.vendor}</div>
                </div>
              </div>
            ),
          },
          { key: "type", label: "Type" },
          { key: "ip", label: "IP" },
          { key: "throughputGbps", label: "Throughput", render: (n) => `${n.throughputGbps} Gbps` },
          { key: "latencyMs", label: "Latency", render: (n) => `${n.latencyMs} ms` },
          { key: "packetLoss", label: "Loss", render: (n) => `${n.packetLoss}%` },
          { key: "status", label: "Status", render: (n) => <StatusPill status={n.status} /> },
        ]}
      />
    </AppShell>
  ),
});
