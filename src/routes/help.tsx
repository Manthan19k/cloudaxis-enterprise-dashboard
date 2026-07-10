import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { BookOpen, HelpCircle, LifeBuoy, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Support" title="Help Center" subtitle="Guides, troubleshooting, and a direct line to our team." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: BookOpen, title: "Getting started", desc: "Deploy your first collector in under 10 minutes.", to: "/docs" },
          { icon: HelpCircle, title: "FAQs", desc: "Common questions about deployment and RBAC." },
          { icon: LifeBuoy, title: "Contact support", desc: "24/7 enterprise support at support@cloudaxis.io." },
          { icon: MessageSquare, title: "Community", desc: "Join 3,200+ operators in the CloudAxis Discord." },
        ].map((h) => (
          <Card key={h.title}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-info/15 text-info">
              <h.icon className="h-5 w-5" />
            </span>
            <div className="mt-3 font-semibold">{h.title}</div>
            <div className="text-sm text-muted-foreground">{h.desc}</div>
            {h.to ? (
              <Link to={h.to} className="mt-3 inline-block text-xs text-accent hover:underline">
                Open →
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </AppShell>
  ),
});
