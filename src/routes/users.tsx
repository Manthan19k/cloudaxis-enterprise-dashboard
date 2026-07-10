import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { PageHeader, StatusPill } from "@/components/app/primitives";
import { DataTable } from "@/components/app/data-table";
import { appUsers, AppUser } from "@/lib/mock-data";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Users />
    </AppShell>
  ),
});

function Users() {
  const [rows, setRows] = useState<AppUser[]>(appUsers);
  const [inviting, setInviting] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="User Management"
        actions={
          <button
            onClick={() => setInviting(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Invite user
          </button>
        }
      />
      <DataTable
        rows={rows}
        columns={[
          {
            key: "name",
            label: "User",
            render: (u) => (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-info to-accent text-xs font-semibold text-primary-foreground">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
              </div>
            ),
          },
          { key: "role", label: "Role", render: (u) => <StatusPill status={u.active ? "healthy" : "offline"} /> },
          { key: "department", label: "Department" },
          { key: "lastLogin", label: "Last login" },
          {
            key: "active",
            label: "Access",
            render: (u) => (
              <button
                onClick={() => {
                  setRows((r) => r.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)));
                  toast.success(u.active ? "Access revoked" : "Access restored");
                }}
                className="rounded-md border border-border px-2 py-1 text-xs"
              >
                {u.active ? "Disable" : "Enable"}
              </button>
            ),
          },
        ]}
      />
      {inviting ? (
        <InviteForm
          onClose={() => setInviting(false)}
          onSave={(u) => {
            setRows((r) => [u, ...r]);
            setInviting(false);
            toast.success("Invitation sent");
          }}
        />
      ) : null}
    </>
  );
}

function InviteForm({ onClose, onSave }: { onClose: () => void; onSave: (u: AppUser) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("Engineer");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 p-4 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Invite user</div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.includes("@")) return toast.error("Enter valid details");
            onSave({
              id: crypto.randomUUID(),
              name: name.trim(),
              email: email.trim(),
              role,
              department: "General",
              lastLogin: "just now",
              active: true,
            });
          }}
          className="space-y-3"
        >
          {[
            ["Name", name, setName],
            ["Email", email, setEmail],
          ].map(([l, v, set]) => (
            <div key={l as string}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{l as string}</label>
              <input
                value={v as string}
                onChange={(e) => (set as (v: string) => void)(e.target.value)}
                className="w-full rounded-lg border border-border bg-input p-2 text-sm outline-none"
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as AppUser["role"])} className="w-full rounded-lg border border-border bg-input p-2 text-sm">
              {["Admin", "Engineer", "Manager", "Viewer"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Send invitation
          </button>
        </form>
      </div>
    </div>
  );
}
