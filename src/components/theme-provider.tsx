import * as React from "react";

type ThemeType = "light" | "dark" | "light dark";

export type ThemeContext = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
} | null;

const ThemeContext = React.createContext<ThemeContext>(null);

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (ctx === null) {
    throw Error("You must use this within <ThemeProvider />");
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeType>(
    (localStorage.getItem("theme") as ThemeType) ?? "light dark",
  );

  const handleSetTheme = React.useCallback(
    (theme: ThemeType) => {
      setTheme(theme);
      localStorage.setItem("theme", theme);
    },
    [setTheme],
  );

  React.useLayoutEffect(() => {
    document.documentElement.style.colorScheme = theme;
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (!localStorage.getItem("theme")) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const isDark = mediaQuery.matches;
      handleSetTheme(isDark ? "dark" : "light");
    }
  }, [theme, handleSetTheme]);

  /** Don't trigger animations on theme change */
  React.useEffect(() => {
    // Prevent animation during theme changes
    document.documentElement.style.setProperty(
      "*",
      "transition: none !important",
    );

    const timeoutId = setTimeout(() => {
      document.documentElement.style.removeProperty("*");
    }, 0);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      document.documentElement.style.removeProperty("*");
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
