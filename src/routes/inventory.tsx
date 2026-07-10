import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { inventory } from "@/lib/mock-data";
import { Package } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Operations" title="Asset Inventory" subtitle={`${inventory.length} tracked assets`} />
      <DataTable
        rows={inventory}
        columns={[
          {
            key: "name",
            label: "Asset",
            render: (i) => (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Package className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.serial}</div>
                </div>
              </div>
            ),
          },
          { key: "category", label: "Category" },
          { key: "vendor", label: "Vendor" },
          { key: "purchased", label: "Purchased" },
          { key: "warranty", label: "Warranty until" },
          { key: "status", label: "Status", render: (i) => <StatusPill status={i.status} /> },
        ]}
      />
    </AppShell>
  ),
});
