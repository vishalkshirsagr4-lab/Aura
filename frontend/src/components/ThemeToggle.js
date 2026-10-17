import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "aura-theme";
const read = () => {
  try { return localStorage.getItem(KEY) || "dark"; } catch (e) { return "dark"; }
};

// Dark (obsidian) by default; the choice is remembered on this device
function ThemeToggle() {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* storage unavailable */ }
  }, [theme]);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-fab"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}

export default ThemeToggle;
