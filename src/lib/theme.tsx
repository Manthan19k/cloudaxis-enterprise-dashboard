import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void; resolved: "dark" | "light" }>({
  theme: "dark",
  setTheme: () => {},
  resolved: "dark",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("cloudaxis-theme") as Theme) || "dark";
    setThemeState(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      const isDark =
        t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    };
    apply(theme);
    localStorage.setItem("cloudaxis-theme", theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const l = () => apply("system");
      mq.addEventListener("change", l);
      return () => mq.removeEventListener("change", l);
    }
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme: setThemeState, resolved }}>{children}</ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
