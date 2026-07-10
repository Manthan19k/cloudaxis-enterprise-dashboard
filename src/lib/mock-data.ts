// Deterministic mock enterprise infrastructure data for CloudAxis.

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export type Status = "healthy" | "warning" | "critical" | "offline";
export interface Server {
  id: string;
  name: string;
  ip: string;
  location: string;
  rack: string;
  os: string;
  cpu: number;
  memory: number;
  storage: number;
  temperature: number;
  status: Status;
  owner: string;
  department: string;
  vmCount: number;
  uptimeDays: number;
}
export interface VM {
  id: string;
  name: string;
  host: string;
  os: string;
  vCPU: number;
  memoryGB: number;
  diskGB: number;
  cpu: number;
  memory: number;
  status: Status;
  ip: string;
  owner: string;
  department: string;
  snapshots: number;
}
export interface Datastore {
  id: string;
  name: string;
  type: "SSD" | "NVMe" | "HDD" | "Hybrid";
  capacityTB: number;
  usedTB: number;
  status: Status;
  location: string;
}
export interface NetDevice {
  id: string;
  name: string;
  type: "Switch" | "Router" | "Firewall" | "Load Balancer";
  vendor: string;
  ip: string;
  throughputGbps: number;
  latencyMs: number;
  packetLoss: number;
  status: Status;
}
export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  source: string;
  time: string;
  acknowledged: boolean;
  resolved: boolean;
  assignee?: string;
}
export interface InventoryItem {
  id: string;
  category: "Server" | "Switch" | "Router" | "Firewall" | "Storage" | "License" | "Software";
  name: string;
  vendor: string;
  serial: string;
  purchased: string;
  warranty: string;
  status: "Active" | "Retired" | "In Stock";
}
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Engineer" | "Manager" | "Viewer";
  department: string;
  lastLogin: string;
  active: boolean;
}

const departments = ["Engineering", "Finance", "Operations", "R&D", "Sales", "IT", "Security"];
const locations = ["US-East-1", "US-West-2", "EU-Central-1", "AP-South-1", "AP-Northeast-1"];
const oses = ["Ubuntu 22.04", "RHEL 9", "Windows Server 2022", "Debian 12", "ESXi 8.0"];
const owners = ["Alex Chen", "Priya Rao", "Marcus Wolf", "Yuki Tanaka", "Sofia Alvarez", "Daniel Kim"];

function pickStatus(r: () => number): Status {
  const v = r();
  if (v > 0.94) return "critical";
  if (v > 0.82) return "warning";
  if (v > 0.78) return "offline";
  return "healthy";
}

const r1 = rand(42);
export const servers: Server[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `SRV-${1000 + i}`,
  name: `axis-${["core", "edge", "compute", "db", "cache", "gpu"][i % 6]}-${String(i + 1).padStart(3, "0")}`,
  ip: `10.${10 + (i % 20)}.${i % 255}.${(i * 7) % 255}`,
  location: locations[i % locations.length],
  rack: `R${(i % 8) + 1}-U${(i % 40) + 1}`,
  os: oses[i % oses.length],
  cpu: Math.round(20 + r1() * 75),
  memory: Math.round(30 + r1() * 65),
  storage: Math.round(20 + r1() * 70),
  temperature: Math.round(38 + r1() * 32),
  status: pickStatus(r1),
  owner: owners[i % owners.length],
  department: departments[i % departments.length],
  vmCount: Math.floor(r1() * 24) + 1,
  uptimeDays: Math.floor(r1() * 720) + 5,
}));

const r2 = rand(88);
export const vms: VM[] = Array.from({ length: 96 }).map((_, i) => ({
  id: `VM-${2000 + i}`,
  name: `vm-${["web", "api", "worker", "db", "cache", "ml"][i % 6]}-${String(i + 1).padStart(3, "0")}`,
  host: servers[i % servers.length].name,
  os: oses[i % oses.length],
  vCPU: [2, 4, 8, 16, 32][i % 5],
  memoryGB: [4, 8, 16, 32, 64][i % 5],
  diskGB: [40, 80, 160, 320, 500][i % 5],
  cpu: Math.round(10 + r2() * 85),
  memory: Math.round(20 + r2() * 75),
  status: pickStatus(r2),
  ip: `10.${20 + (i % 20)}.${i % 255}.${(i * 3) % 255}`,
  owner: owners[i % owners.length],
  department: departments[i % departments.length],
  snapshots: Math.floor(r2() * 6),
}));

const r3 = rand(17);
export const datastores: Datastore[] = Array.from({ length: 14 }).map((_, i) => {
  const cap = [24, 48, 96, 120, 240][i % 5];
  return {
    id: `DS-${300 + i}`,
    name: `datastore-${["prod", "staging", "backup", "archive"][i % 4]}-${i + 1}`,
    type: (["SSD", "NVMe", "HDD", "Hybrid"] as const)[i % 4],
    capacityTB: cap,
    usedTB: Math.round(cap * (0.3 + r3() * 0.6) * 10) / 10,
    status: pickStatus(r3),
    location: locations[i % locations.length],
  };
});

const r4 = rand(555);
export const network: NetDevice[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `NET-${400 + i}`,
  name: `${["Switch", "Router", "Firewall", "Load Balancer"][i % 4].toLowerCase().replace(" ", "-")}-${i + 1}`,
  type: (["Switch", "Router", "Firewall", "Load Balancer"] as const)[i % 4],
  vendor: ["Cisco", "Arista", "Juniper", "Palo Alto", "F5"][i % 5],
  ip: `10.0.${i}.1`,
  throughputGbps: Math.round((5 + r4() * 95) * 10) / 10,
  latencyMs: Math.round((0.4 + r4() * 6) * 10) / 10,
  packetLoss: Math.round(r4() * 100) / 100,
  status: pickStatus(r4),
}));

const alertTitles = [
  "CPU utilization above threshold",
  "Memory pressure detected",
  "Disk I/O latency spike",
  "Network packet loss",
  "Temperature exceeds safe range",
  "VM migration failed",
  "Backup job overdue",
  "Certificate expiring in 7 days",
  "Login anomaly detected",
  "Datastore usage above 90%",
];
const r5 = rand(9);
export const alerts: Alert[] = Array.from({ length: 32 }).map((_, i) => ({
  id: `ALT-${5000 + i}`,
  severity: (["critical", "warning", "info"] as const)[i % 3],
  title: alertTitles[i % alertTitles.length],
  source: servers[i % servers.length].name,
  time: new Date(Date.now() - i * 1000 * 60 * 17).toISOString(),
  acknowledged: r5() > 0.6,
  resolved: r5() > 0.75,
  assignee: r5() > 0.4 ? owners[i % owners.length] : undefined,
}));

const r6 = rand(2024);
export const inventory: InventoryItem[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `INV-${7000 + i}`,
  category: (["Server", "Switch", "Router", "Firewall", "Storage", "License", "Software"] as const)[i % 7],
  name: `Asset-${1000 + i}`,
  vendor: ["Dell", "HPE", "Cisco", "NetApp", "Pure", "VMware", "Microsoft"][i % 7],
  serial: `SN-${Math.floor(r6() * 1e9)}`,
  purchased: new Date(2022, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
  warranty: new Date(2026, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
  status: (["Active", "Retired", "In Stock"] as const)[i % 3],
}));

export const appUsers: AppUser[] = [
  { id: "U1", name: "Alex Chen", email: "alex@cloudaxis.io", role: "Admin", department: "IT", lastLogin: "2m ago", active: true },
  { id: "U2", name: "Priya Rao", email: "priya@cloudaxis.io", role: "Engineer", department: "Engineering", lastLogin: "14m ago", active: true },
  { id: "U3", name: "Marcus Wolf", email: "marcus@cloudaxis.io", role: "Manager", department: "Operations", lastLogin: "1h ago", active: true },
  { id: "U4", name: "Yuki Tanaka", email: "yuki@cloudaxis.io", role: "Engineer", department: "R&D", lastLogin: "3h ago", active: true },
  { id: "U5", name: "Sofia Alvarez", email: "sofia@cloudaxis.io", role: "Viewer", department: "Finance", lastLogin: "1d ago", active: false },
  { id: "U6", name: "Daniel Kim", email: "daniel@cloudaxis.io", role: "Engineer", department: "Security", lastLogin: "6h ago", active: true },
];

export function healthScore() {
  const total = servers.length + vms.length;
  const bad = [...servers, ...vms].filter((x) => x.status !== "healthy").length;
  return Math.max(0, Math.round(100 - (bad / total) * 100));
}

export function seriesTimeline(points = 24, base = 50, variance = 30, seed = 1) {
  const r = rand(seed);
  return Array.from({ length: points }).map((_, i) => ({
    t: `${String(i).padStart(2, "0")}:00`,
    cpu: Math.max(5, Math.min(99, Math.round(base + (r() - 0.5) * variance + Math.sin(i / 3) * 8))),
    memory: Math.max(5, Math.min(99, Math.round(base + (r() - 0.5) * variance + Math.cos(i / 4) * 6))),
    network: Math.max(5, Math.min(99, Math.round(base - 10 + (r() - 0.5) * variance))),
    storage: Math.max(5, Math.min(99, Math.round(base + 5 + (r() - 0.5) * (variance / 2)))),
  }));
}

export const activities = Array.from({ length: 10 }).map((_, i) => ({
  id: `ACT-${i}`,
  user: owners[i % owners.length],
  action: [
    "provisioned VM",
    "acknowledged alert",
    "rebooted server",
    "created snapshot",
    "updated firewall rule",
    "generated report",
    "migrated workload",
    "added inventory item",
  ][i % 8],
  target: servers[i % servers.length].name,
  time: `${(i + 1) * 3}m ago`,
}));
