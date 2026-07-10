import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import {
  Activity, AlertTriangle, BarChart3, Bell, Boxes, ChartLine, ChevronRight,
  CircuitBoard, Cloud, Database, FileText, HardDrive, HelpCircle, LayoutDashboard,
  LogOut, Menu, Moon, Network, Package, Search, Server, Settings, Shield,
  Sparkles, Sun, User as UserIcon, Users, X,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { alerts } from "@/lib/mock-data";
import { toast } from "sonner";

const sections = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Infrastructure",
    items: [
      { to: "/infrastructure/servers", icon: Server, label: "Physical Servers" },
      { to: "/infrastructure/vms", icon: Boxes, label: "Virtual Machines" },
      { to: "/infrastructure/storage", icon: HardDrive, label: "Storage" },
      { to: "/infrastructure/network", icon: Network, label: "Networking" },
      { to: "/infrastructure/map", icon: CircuitBoard, label: "Infrastructure Map" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/monitoring", icon: Activity, label: "Monitoring" },
      { to: "/alerts", icon: AlertTriangle, label: "Alerts" },
      { to: "/reports", icon: FileText, label: "Reports" },
      { to: "/analytics", icon: ChartLine, label: "Analytics" },
      { to: "/inventory", icon: Package, label: "Inventory" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/users", icon: Users, label: "Users" },
      { to: "/roles", icon: Shield, label: "Roles" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { to: "/help", icon: HelpCircle, label: "Help Center" },
      { to: "/docs", icon: FileText, label: "Documentation" },
      { to: "/profile", icon: UserIcon, label: "Profile" },
    ],
  },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, ready, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (ready && !isAuthenticated) nav({ to: "/login" });
  }, [ready, isAuthenticated, nav]);

  const unread = useMemo(() => alerts.filter((a) => !a.acknowledged).length, []);

  if (!ready || !user) return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading console…</div>;


  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent via-primary to-info shadow-glow">
              <CircuitBoard className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">CloudAxis</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">Console</div>
            </div>
          </Link>
          <button className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 pb-6">
          {sections.map((sec) => (
            <div key={sec.label} className="mb-5">
              <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {sec.label}
              </div>
              <ul className="space-y-0.5">
                {sec.items.map((it) => (
                  <SidebarLink key={it.to} to={it.to} icon={it.icon} label={it.label} onClick={() => setOpen(false)} />
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={() => {
              logout();
              toast.success("Signed out");
              nav({ to: "/login" });
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <button className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <Breadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="hidden items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              <Search className="h-3.5 w-3.5" />
              Search servers, VMs, alerts…
              <kbd className="ml-6 rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <Link to="/alerts" className="relative rounded-md p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              ) : null}
            </Link>
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} CloudAxis · Enterprise Infrastructure Intelligence Platform · v1.0.0</div>
            <div className="flex items-center gap-4">
              <Link to="/docs" className="hover:text-foreground">Documentation</Link>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <Link to="/help" className="hover:text-foreground">Support</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating AI Assistant */}
      <button
        onClick={() => setAssistant(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow"
      >
        <Sparkles className="h-4 w-4" />
        CloudAxis AI
      </button>
      {assistant ? <AssistantDrawer onClose={() => setAssistant(false)} /> : null}
      {showSearch ? <GlobalSearch onClose={() => setShowSearch(false)} /> : null}

      {open ? <div className="fixed inset-0 z-30 bg-background/60 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        activeProps={{ className: "bg-sidebar-accent text-foreground" }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
      </Link>
    </li>
  );
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <div className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
      <Link to="/dashboard" className="hover:text-foreground">Console</Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          <span className={i === parts.length - 1 ? "text-foreground" : ""}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </span>
        </span>
      ))}
    </div>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-2 py-1.5 text-sm"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-info to-accent text-xs font-semibold text-primary-foreground">
          {initials}
        </span>
        <span className="hidden md:inline">{user.name}</span>
      </button>
      {open ? (
        <div
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-card"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="border-b border-border p-3">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="mt-1 inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
              {user.role}
            </div>
          </div>
          <MenuItem to="/profile" icon={UserIcon} label="Profile" onClick={() => setOpen(false)} />
          <MenuItem to="/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              logout();
              toast.success("Signed out");
              nav({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const suggestions = [
    { label: "Physical servers", to: "/infrastructure/servers", icon: Server },
    { label: "Virtual machines", to: "/infrastructure/vms", icon: Boxes },
    { label: "Storage datastores", to: "/infrastructure/storage", icon: Database },
    { label: "Network devices", to: "/infrastructure/network", icon: Network },
    { label: "Active alerts", to: "/alerts", icon: AlertTriangle },
    { label: "Reports", to: "/reports", icon: FileText },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Inventory", to: "/inventory", icon: Package },
    { label: "Users", to: "/users", icon: Users },
    { label: "Cloud accounts", to: "/settings", icon: Cloud },
  ];
  const filtered = q ? suggestions.filter((s) => s.label.toLowerCase().includes(q.toLowerCase())) : suggestions;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-24 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search servers, VMs, IPs, users, alerts…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.map((s) => (
            <li key={s.to}>
              <button
                onClick={() => {
                  nav({ to: s.to });
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AssistantDrawer({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi — I'm CloudAxis AI. Ask me about servers, alerts, or infrastructure health." },
  ]);
  const [input, setInput] = useState("");
  const canned = (q: string) => {
    const l = q.toLowerCase();
    if (l.includes("highest cpu"))
      return "axis-compute-042 in US-East-1 is currently the busiest at 96% CPU. It's hosting 14 VMs. Consider migrating 3–4 workloads to axis-compute-011.";
    if (l.includes("offline")) return "3 VMs are offline right now: vm-web-018, vm-worker-032, and vm-cache-071. All three are in Engineering department.";
    if (l.includes("report")) return "Today's infrastructure report is ready — health 92/100, 4 critical alerts resolved, 0 SLA breaches. Head to Reports to export.";
    if (l.includes("alert")) return "The top alert is 'CPU utilization above threshold' on axis-core-004 — triggered 12 minutes ago, unassigned. Suggested playbook: scale-out compute pool.";
    if (l.includes("health"))
      return "Overall infrastructure health score is 92/100. Storage is trending down (81/100) due to datastore-prod-3 at 91% capacity. Networking and compute are green.";
    return "I've cross-checked live telemetry and inventory. Try asking: 'which server has the highest CPU?' or 'summarize infrastructure health'.";
  };
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "ai", text: canned(q) }]), 400);
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-popover shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-info text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold">CloudAxis AI</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">grounded on your fleet</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about servers, VMs, alerts…"
              className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring"
            />
            <button onClick={send} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Send
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Which server has highest CPU?", "Which VM is offline?", "Summarize infrastructure health"].map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
