import { useTheme, type Theme } from "@/contexts/ThemeProvider";
import type { JSX } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeButton(): JSX.Element {
  const { theme, setTheme } = useTheme();

  // determine the actual theme when system is active
  const activeTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const handleClick = () => {
    let nextTheme: Theme = "system";

    if (activeTheme === "dark") {
      nextTheme = "light";
    } else if (activeTheme === "light") {
      nextTheme = "dark";
    } else if (activeTheme === "system") {
      // Prüfen, ob das System dark oder light ist
      const systemIsDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      nextTheme = systemIsDark ? "light" : "dark";
    }

    setTheme(nextTheme);
  };

  return (
    <Button variant={"ghost"} onClick={handleClick}>
      {activeTheme === "dark" ? <Sun className="!w-5 !h-5" /> : <Moon />}
    </Button>
  );
}
