import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  ChartLine,
  CircuitBoard,
  Cloud,
  Cpu,
  Database,
  Eye,
  Github,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Server,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CloudAxis — Enterprise Infrastructure Intelligence Platform" },
      {
        name: "description",
        content:
          "Monitor, visualize, and manage physical servers, virtual machines, networks, storage, and cloud infrastructure from one enterprise dashboard.",
      },
    ],
  }),
  component: Landing,
});

const nav = [
  { label: "Product", href: "#features" },
  { label: "Platform", href: "#platform" },
  { label: "Use Cases", href: "#usecases" },
  { label: "Docs", href: "#docs" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Hero />
      <TrustBar />
      <Features />
      <PlatformScreenshot />
      <Architecture />
      <TechStack />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? "border-b border-border/60 backdrop-blur-xl bg-background/70" : ""}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent via-primary to-info shadow-glow">
            <CircuitBoard className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CloudAxis</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
            New — Predictive capacity forecasting is live
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient">Every layer of your infrastructure,</span>
            <br />
            on a single axis.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CloudAxis unifies servers, virtual machines, storage and networks into one enterprise operations
            console — with live telemetry, AI insight, and vendor-neutral visibility.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
            >
              Live demo <Eye className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="glass rounded-2xl p-3 shadow-card">
            <div className="rounded-xl border border-border bg-card p-6">
              <InfraOrbit />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfraOrbit() {
  const nodes = [
    { icon: Server, label: "Physical", color: "bg-info/20 text-info" },
    { icon: Boxes, label: "VMs", color: "bg-accent/20 text-accent" },
    { icon: Database, label: "Storage", color: "bg-success/20 text-success" },
    { icon: Network, label: "Network", color: "bg-destructive/20 text-destructive" },
    { icon: Cloud, label: "Cloud", color: "bg-primary/20 text-primary" },
    { icon: Shield, label: "Security", color: "bg-info/20 text-info" },
  ];
  return (
    <div className="relative flex h-[420px] items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-border">
        <div className="absolute h-40 w-40 rounded-full border border-border/70" />
        <div className="absolute rounded-full border border-border/50" style={{ width: 360, height: 360 }} />
        <div className="absolute rounded-full border border-border/30" style={{ width: 460, height: 460 }} />
        <motion.div
          className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-accent via-primary to-info shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          <CircuitBoard className="h-8 w-8 text-primary-foreground" />
        </motion.div>
        {nodes.map((n, i) => {
          const angle = (i / nodes.length) * Math.PI * 2;
          const r = 170;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <motion.div
              key={n.label}
              className="absolute"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i + 0.3 }}
            >
              <div className={`flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-card`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full ${n.color}`}>
                  <n.icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium">{n.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TrustBar() {
  const stats = [
    { label: "Managed nodes", value: "48K+" },
    { label: "Alerts triaged / day", value: "1.2M" },
    { label: "Uptime SLA", value: "99.99%" },
    { label: "Enterprises", value: "300+" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Activity, title: "Live telemetry", body: "Sub-second metrics for CPU, memory, disk, and network across every node." },
    { icon: Boxes, title: "Unified inventory", body: "Servers, VMs, switches, firewalls and licenses in one authoritative record." },
    { icon: ChartLine, title: "Capacity forecasting", body: "ML-assisted models predict saturation weeks before it happens." },
    { icon: Shield, title: "Zero-trust RBAC", body: "Granular permissions, audit trails, and SSO with SAML/OIDC." },
    { icon: Zap, title: "Automated remediation", body: "Playbooks and runbooks that fire the moment SLOs slip." },
    { icon: Sparkles, title: "CloudAxis AI", body: "Ask 'which VM is offline?' and get a grounded, cited answer." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Platform" title="Enterprise operations, without the fragmentation." />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PlatformScreenshot() {
  return (
    <section id="platform" className="border-y border-border/60 bg-card/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Console" title="One console. Every workload." />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {[
            { icon: Cpu, title: "Compute health", value: "94/100", detail: "48 physical · 96 virtual" },
            { icon: HardDrive, title: "Storage", value: "68% used", detail: "of 1.4 PB usable" },
            { icon: Network, title: "Network", value: "1.8 ms", detail: "avg edge latency" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 text-muted-foreground">
                <c.icon className="h-5 w-5" />
                <span className="text-xs uppercase tracking-widest">{c.title}</span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight">{c.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.detail}</div>
              <div className="mt-6 h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-gradient-to-r from-info via-primary to-accent" style={{ width: "68%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    { icon: Layers, title: "Presentation", body: "React 19 · TanStack Router · Tailwind" },
    { icon: Zap, title: "Edge & API", body: "TanStack Start server fns · Node compat" },
    { icon: Database, title: "Data plane", body: "Postgres · Redis · time-series store" },
    { icon: Cloud, title: "Infra plane", body: "vCenter · AWS · Azure · GCP · bare metal" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Architecture" title="Layered, observable, vendor-neutral." />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {layers.map((l, i) => (
          <div key={l.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Layer 0{i + 1}</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                <l.icon className="h-4.5 w-4.5" />
              </span>
              <div className="font-semibold">{l.title}</div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{l.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechStack() {
  const stack = [
    "React 19", "TypeScript", "Tailwind v4", "shadcn/ui", "TanStack", "Recharts",
    "Framer Motion", "Zod", "React Hook Form", "PostgreSQL", "Redis", "Docker",
  ];
  return (
    <section className="border-y border-border/60 bg-card/20 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">Built on</div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {stack.map((s) => (
            <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Connect", body: "Deploy a lightweight collector or plug in your vCenter, cloud, and network vendors." },
    { n: "02", title: "Correlate", body: "CloudAxis normalizes telemetry across every source into a single graph." },
    { n: "03", title: "Act", body: "Get insight, run remediation playbooks, and ship reports to stakeholders." },
  ];
  return (
    <section id="docs" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="How it works" title="From telemetry to action in three steps." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-4xl font-bold text-accent">{s.n}</div>
            <div className="mt-3 text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { icon: Globe, title: "Global enterprises", body: "Consolidate DCs and clouds across regions with regional data planes." },
    { icon: Shield, title: "Regulated industries", body: "SOC 2, ISO 27001, and HIPAA-ready audit trails and RBAC." },
    { icon: Lock, title: "Sovereign clouds", body: "Deploy on-prem or in your own VPC — no data leaves your perimeter." },
    { icon: Sparkles, title: "AI-native ops", body: "Ground the CloudAxis assistant on your topology and runbooks." },
  ];
  return (
    <section id="usecases" className="border-y border-border/60 bg-card/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Use cases" title="Trusted by teams who can't tolerate blind spots." />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-info/15 text-info">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">{c.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { name: "Priya Rao", role: "VP Infrastructure, Northwind", body: "CloudAxis replaced four tools. Our mean-time-to-detect dropped 71% in the first quarter." },
    { name: "Marcus Wolf", role: "Head of SRE, Helix Bank", body: "The forecasting alone paid for itself — we avoided six figure emergency procurement twice." },
    { name: "Yuki Tanaka", role: "Cloud Architect, Aurora Labs", body: "Finally one graph across vCenter, AWS, and our on-prem edge. Rollout took eight days." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Testimonials" title="Loved by operations teams." />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <div key={q.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm leading-relaxed text-foreground">“{q.body}”</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-info to-primary text-sm font-semibold text-primary-foreground">
                {q.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-medium">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How does CloudAxis connect to my environment?", a: "Deploy a lightweight collector or use native vendor APIs — vCenter, AWS, Azure, GCP, SNMP, Prometheus, and OpenTelemetry are all supported out of the box." },
    { q: "Where is my telemetry stored?", a: "You choose. Cloud, self-hosted, or hybrid. All data can stay inside your VPC or on-prem cluster." },
    { q: "Do you support role-based access?", a: "Yes. Admin, Engineer, Manager, and Viewer roles ship by default and integrate with SSO providers." },
    { q: "Is there a free trial?", a: "Yes — a 30-day trial with unlimited nodes and full feature access, no credit card required." },
  ];
  return (
    <section className="border-y border-border/60 bg-card/20 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow="FAQ" title="Answers, up front." />
        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 shadow-card">
        <div className="absolute inset-0 gradient-hero opacity-70" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">See CloudAxis on your infrastructure.</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Book a 20-minute technical demo, or spin up the sandbox with sample data.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/70 px-5 py-3 text-sm font-medium backdrop-blur"
            >
              Explore console
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-accent via-primary to-info">
              <CircuitBoard className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold">CloudAxis</span>
          </div>
          <p className="mt-3 max-w-xs text-xs text-muted-foreground">
            Enterprise Infrastructure Intelligence Platform.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "Platform", "Pricing", "Changelog"] },
          { title: "Resources", items: ["Documentation", "API", "Community", "Support"] },
          { title: "Company", items: ["About", "Careers", "Privacy", "Terms"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row">
        <div>© {new Date().getFullYear()} CloudAxis, Inc. · v1.0.0</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Support</a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
    </div>
  );
}
