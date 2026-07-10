import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Card, PageHeader, StatusPill } from "@/components/app/primitives";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — CloudAxis" }] }),
  component: () => (
    <AppShell>
      <Profile />
    </AppShell>
  ),
});

function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  const initials = user.name.split(" ").map((n) => n[0]).join("");
  return (
    <>
      <PageHeader eyebrow="Support" title="Your profile" subtitle="Account details and preferences." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center py-4 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-info via-primary to-accent text-2xl font-bold text-primary-foreground shadow-glow">
              {initials}
            </span>
            <div className="mt-4 text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="mt-2">
              <StatusPill status="healthy" />
            </div>
            <div className="mt-3 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">{user.role}</div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="text-lg font-semibold">Account details</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Profile updated");
            }}
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            {[
              ["Full name", user.name],
              ["Email", user.email],
              ["Role", user.role],
              ["Department", "IT"],
              ["Timezone", "UTC-05:00 America/New_York"],
              ["Language", "English (US)"],
            ].map(([l, v]) => (
              <div key={l}>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{l}</label>
                <input
                  defaultValue={v}
                  className="w-full rounded-lg border border-border bg-input p-2 text-sm outline-none focus:border-ring"
                />
              </div>
            ))}
            <button className="md:col-span-2 mt-2 w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Save changes
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
