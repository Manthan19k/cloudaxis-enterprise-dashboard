import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { Shield, Check, X } from "lucide-react";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Roles />
    </AppShell>
  ),
});

const roles = [
  { name: "Admin", desc: "Full access — user management, billing, infrastructure operations.", perms: [true, true, true, true, true, true] },
  { name: "Engineer", desc: "Provision, migrate and remediate infrastructure.", perms: [true, true, true, true, false, false] },
  { name: "Manager", desc: "Read + reports + acknowledge alerts.", perms: [true, false, true, true, true, false] },
  { name: "Viewer", desc: "Read-only console access.", perms: [true, false, false, false, false, false] },
];
const capabilities = ["View console", "Provision resources", "Acknowledge alerts", "Generate reports", "Manage billing", "Manage users"];

function Roles() {
  return (
    <>
      <PageHeader eyebrow="Administration" title="Roles & Permissions" subtitle="Fine-grained access control for every user." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="py-3">Capability</th>
                {roles.map((r) => (
                  <th key={r.name} className="py-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5" />
                      {r.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((c, i) => (
                <tr key={c} className="border-t border-border">
                  <td className="py-3 font-medium">{c}</td>
                  {roles.map((r) => (
                    <td key={r.name} className="py-3 text-center">
                      {r.perms[i] ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((r) => (
          <Card key={r.name}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <Shield className="h-4 w-4" />
              </span>
              <div className="font-semibold">{r.name}</div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{r.desc}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
