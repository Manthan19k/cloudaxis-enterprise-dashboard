import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { toast } from "sonner";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchable = true,
  pageSize = 8,
  onRowClick,
  actions,
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const p = Math.min(page, pages);
  const view = sorted.slice((p - 1) * pageSize, p * pageSize);

  const exportCsv = () => {
    const header = columns.map((c) => c.label).join(",");
    const body = sorted
      .map((r) =>
        columns
          .map((c) => {
            const v = (r as Record<string, unknown>)[c.key as string];
            return `"${String(v ?? "").replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cloudaxis-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        {searchable ? (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
              placeholder="Filter…"
            />
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-4 py-3 font-medium ${c.className ?? ""}`}>
                  <button
                    disabled={c.sortable === false}
                    onClick={() => {
                      if (c.sortable === false) return;
                      const k = String(c.key);
                      if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                      else {
                        setSortKey(k);
                        setSortDir("asc");
                      }
                    }}
                    className="inline-flex items-center gap-1 hover:text-foreground disabled:pointer-events-none"
                  >
                    {c.label}
                    {c.sortable !== false ? <ArrowUpDown className="h-3 w-3 opacity-60" /> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr
                key={r.id}
                onClick={() => onRowClick?.(r)}
                className={`border-b border-border/60 transition-colors last:border-0 ${onRowClick ? "cursor-pointer hover:bg-muted/40" : ""}`}
              >
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {view.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No results
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 text-xs text-muted-foreground">
        <div>
          Showing {(p - 1) * pageSize + (view.length ? 1 : 0)}–{(p - 1) * pageSize + view.length} of {sorted.length}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((x) => Math.max(1, x - 1))}
            disabled={p === 1}
            className="rounded-md border border-border p-1 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-2">
            Page {p} / {pages}
          </span>
          <button
            onClick={() => setPage((x) => Math.min(pages, x + 1))}
            disabled={p === pages}
            className="rounded-md border border-border p-1 disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
