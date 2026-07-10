import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { Book } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [{ title: "Documentation — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Support" title="Documentation" subtitle="API references, integration guides and platform architecture." />
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Contents</div>
          <ul className="space-y-1 text-sm">
            {["Introduction", "Quick start", "Collectors", "Integrations", "RBAC & SSO", "API reference", "Runbooks"].map((s) => (
              <li key={s}>
                <a href={`#${s.toLowerCase().replace(/\s+/g, "-")}`} className="block rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="prose prose-invert max-w-none text-sm">
            <div className="mb-6 flex items-center gap-2">
              <Book className="h-5 w-5 text-accent" />
              <h2 className="m-0 text-lg font-semibold">CloudAxis Platform Documentation</h2>
            </div>
            <p className="text-muted-foreground">
              CloudAxis unifies telemetry from vCenter, AWS, Azure, GCP, SNMP, Prometheus, and OpenTelemetry into
              one enterprise console. This guide walks through architecture, deployment, and integration.
            </p>
            <h3 id="quick-start" className="mt-6 text-base font-semibold">Quick start</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-background p-4 text-xs">
{`# 1. Install the collector
curl -sSL https://get.cloudaxis.io | bash

# 2. Register your workspace
cloudaxis register --workspace <ID> --token <TOKEN>

# 3. Attach a data source
cloudaxis source add --type vcenter --host vc01.corp.local`}
            </pre>
            <h3 id="collectors" className="mt-6 text-base font-semibold">Collectors</h3>
            <p className="text-muted-foreground">Deploy a lightweight collector on any Linux host inside your perimeter. Metrics are batched and shipped over mTLS to your workspace region.</p>
            <h3 id="api-reference" className="mt-6 text-base font-semibold">API reference</h3>
            <p className="text-muted-foreground">Every action in the console is available via the REST API and OpenAPI 3.1 spec, with client SDKs for TypeScript, Python and Go.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  ),
});
