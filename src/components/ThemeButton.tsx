import { useTheme, type Theme } from "@/contexts/ThemeProvider";
import type { JSX } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeButton(): JSX.Element {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {theme === "dark" ? (
        <Sun className="!w-4.5 !h-4.5" />
      ) : (
        <Moon className="!w-4.5 !h-4.5" />
      )}
    </Button>
  );
}
