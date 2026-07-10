import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader } from "@/components/app/primitives";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Settings />
    </AppShell>
  ),
});

function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<"general" | "appearance" | "email" | "alerts" | "security" | "backup">("general");
  return (
    <>
      <PageHeader eyebrow="Administration" title="Settings" subtitle="Workspace configuration and preferences." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit">
          <ul className="space-y-1 text-sm">
            {(["general", "appearance", "email", "alerts", "security", "backup"] as const).map((t) => (
              <li key={t}>
                <button
                  onClick={() => setTab(t)}
                  className={`w-full rounded-lg px-3 py-2 text-left capitalize ${tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          {tab === "general" && (
            <Section title="General" desc="Workspace details.">
              <TextField label="Workspace name" defaultValue="CloudAxis Enterprise" />
              <TextField label="Support email" defaultValue={user?.email ?? ""} />
              <SaveButton />
            </Section>
          )}
          {tab === "appearance" && (
            <Section title="Appearance" desc="Console theme and density.">
              <div>
                <div className="mb-2 text-xs font-medium text-muted-foreground">Theme</div>
                <div className="inline-flex rounded-lg border border-border p-1">
                  {(["dark", "light", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-md px-3 py-1.5 text-xs capitalize ${theme === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          )}
          {tab === "email" && (
            <Section title="Email" desc="SMTP endpoints for alerts and reports.">
              <TextField label="SMTP host" defaultValue="smtp.cloudaxis.io" />
              <TextField label="From address" defaultValue="alerts@cloudaxis.io" />
              <SaveButton />
            </Section>
          )}
          {tab === "alerts" && (
            <Section title="Alert thresholds" desc="Trigger levels for critical metrics.">
              <TextField label="CPU threshold (%)" defaultValue="85" />
              <TextField label="Memory threshold (%)" defaultValue="90" />
              <TextField label="Datastore threshold (%)" defaultValue="90" />
              <TextField label="Temperature (°C)" defaultValue="72" />
              <SaveButton />
            </Section>
          )}
          {tab === "security" && (
            <Section title="Security" desc="Session and MFA policies.">
              <Toggle label="Enforce SSO" defaultChecked />
              <Toggle label="Require MFA" defaultChecked />
              <Toggle label="Rotate API keys quarterly" defaultChecked />
              <SaveButton />
            </Section>
          )}
          {tab === "backup" && (
            <Section title="Backup & retention" desc="Data protection policies.">
              <TextField label="Snapshot cadence (hours)" defaultValue="6" />
              <TextField label="Retention (days)" defaultValue="90" />
              <SaveButton />
            </Section>
          )}
        </Card>
      </div>
    </>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="mb-4 text-sm text-muted-foreground">{desc}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function TextField({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input defaultValue={defaultValue} className="w-full max-w-md rounded-lg border border-border bg-input p-2 text-sm outline-none focus:border-ring" />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 text-sm">
      <span>{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-secondary"}`} onClick={() => setOn(!on)}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-4" : "left-0.5"}`} />
      </span>
    </label>
  );
}

function SaveButton() {
  return (
    <button
      onClick={() => toast.success("Settings saved")}
      className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
    >
      Save changes
    </button>
  );
}
