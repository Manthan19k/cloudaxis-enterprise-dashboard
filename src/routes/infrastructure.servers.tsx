import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { servers as initialServers, Server } from "@/lib/mock-data";
import { Plus, Server as ServerIcon, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/infrastructure/servers")({
  head: () => ({ meta: [{ title: "Physical Servers — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Servers />
    </AppShell>
  ),
});

function Servers() {
  const [rows, setRows] = useState<Server[]>(initialServers);
  const [detail, setDetail] = useState<Server | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Physical Servers"
        subtitle={`${rows.length} servers across 5 regions`}
        actions={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Add server
          </button>
        }
      />
      <DataTable
        rows={rows}
        onRowClick={setDetail}
        columns={[
          {
            key: "name",
            label: "Server",
            render: (s) => (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-info/15 text-info">
                  <ServerIcon className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.ip}</div>
                </div>
              </div>
            ),
          },
          { key: "location", label: "Region" },
          { key: "rack", label: "Rack" },
          { key: "cpu", label: "CPU %", render: (s) => <Bar val={s.cpu} /> },
          { key: "memory", label: "Memory %", render: (s) => <Bar val={s.memory} /> },
          { key: "temperature", label: "Temp", render: (s) => `${s.temperature}°C` },
          { key: "vmCount", label: "VMs" },
          { key: "status", label: "Status", render: (s) => <StatusPill status={s.status} /> },
        ]}
      />

      {detail ? <ServerDrawer server={detail} onClose={() => setDetail(null)} onDelete={(id) => { setRows((r) => r.filter((x) => x.id !== id)); toast.success("Server removed"); setDetail(null); }} /> : null}
      {creating ? (
        <ServerForm
          onClose={() => setCreating(false)}
          onSave={(s) => {
            setRows((r) => [s, ...r]);
            setCreating(false);
            toast.success("Server provisioned");
          }}
        />
      ) : null}
    </>
  );
}

function Bar({ val }: { val: number }) {
  const color = val > 85 ? "bg-destructive" : val > 70 ? "bg-accent" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-secondary">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-xs tabular-nums">{val}%</span>
    </div>
  );
}

function ServerDrawer({ server, onClose, onDelete }: { server: Server; onClose: () => void; onDelete: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-background/60 backdrop-blur" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-popover p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{server.id}</div>
            <div className="text-lg font-semibold">{server.name}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Status">
            <StatusPill status={server.status} />
          </Info>
          <Info label="IP">{server.ip}</Info>
          <Info label="Region">{server.location}</Info>
          <Info label="Rack">{server.rack}</Info>
          <Info label="OS">{server.os}</Info>
          <Info label="Owner">{server.owner}</Info>
          <Info label="Department">{server.department}</Info>
          <Info label="Uptime">{server.uptimeDays} days</Info>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["CPU", server.cpu],
            ["Memory", server.memory],
            ["Storage", server.storage],
            ["Temperature", server.temperature],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-xl border border-border p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-lg font-semibold">
                {val}
                {label === "Temperature" ? "°C" : "%"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => toast.success("Reboot signal sent")}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            Reboot
          </button>
          <button
            onClick={() => toast.success("Migration scheduled")}
            className="rounded-md border border-border px-3 py-2 text-xs"
          >
            Migrate workloads
          </button>
          <button
            onClick={() => onDelete(server.id)}
            className="ml-auto rounded-md border border-destructive/40 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
          >
            Decommission
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function ServerForm({ onClose, onSave }: { onClose: () => void; onSave: (s: Server) => void }) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("US-East-1");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 p-4 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Add physical server</div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !ip.trim()) return toast.error("Name and IP required");
            onSave({
              id: `SRV-${Math.floor(Math.random() * 9999)}`,
              name: name.trim(),
              ip: ip.trim(),
              location,
              rack: "R1-U1",
              os: "Ubuntu 22.04",
              cpu: 5,
              memory: 10,
              storage: 5,
              temperature: 38,
              status: "healthy",
              owner: "Alex Chen",
              department: "IT",
              vmCount: 0,
              uptimeDays: 0,
            });
          }}
          className="space-y-3"
        >
          <Input label="Name" value={name} onChange={setName} placeholder="axis-edge-050" />
          <Input label="IP address" value={ip} onChange={setIp} placeholder="10.0.10.20" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Region</label>
            <select
              className="w-full rounded-lg border border-border bg-input p-2 text-sm outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {["US-East-1", "US-West-2", "EU-Central-1", "AP-South-1", "AP-Northeast-1"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Provision
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-input p-2 text-sm outline-none focus:border-ring"
      />
    </div>
  );
}
