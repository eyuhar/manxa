import { TriangleAlert } from "lucide-react";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="flex flex-col gap-2 w-full items-center p-5 mt-auto text-sm">
      <hr className="w-full mt-2 mb-2 border-border" />
      <div className="max-w-6xl flex gap-1 items-center text-foreground">
        <TriangleAlert size={20} className="text-foreground" />
        <p>Disclaimer</p>
      </div>
      <p className="max-w-6xl text-muted-foreground text-xs">
        This project includes scraping features to extract publicly available
        manxa data. It is intended solely for personal or educational use.
      </p>
    </footer>
  );
}
