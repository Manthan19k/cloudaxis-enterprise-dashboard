import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "Admin" | "Engineer" | "Manager" | "Viewer";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cloudaxis-user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
    setReady(true);
  }, []);

  const persist = (u: User | null, remember = true) => {
    setUser(u);
    if (u && remember) localStorage.setItem("cloudaxis-user", JSON.stringify(u));
    else localStorage.removeItem("cloudaxis-user");
  };

  const login: AuthCtx["login"] = async (email, _password, remember = true) => {
    await new Promise((r) => setTimeout(r, 500));
    const role: Role = email.startsWith("admin")
      ? "Admin"
      : email.startsWith("eng")
        ? "Engineer"
        : email.startsWith("mgr")
          ? "Manager"
          : "Admin";
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) || "Alex Chen",
      email,
      role,
    };
    persist(u, remember);
    return u;
  };

  const register: AuthCtx["register"] = async (name, email) => {
    await new Promise((r) => setTimeout(r, 600));
    const u: User = { id: crypto.randomUUID(), name, email, role: "Engineer" };
    persist(u);
    return u;
  };

  const logout = () => persist(null);

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, ready, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
