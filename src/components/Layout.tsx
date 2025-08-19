import { Outlet } from "react-router-dom";
import Header from "./Header";
import type { JSX } from "react";
import { Toaster } from "./ui/sonner";
import Footer from "./Footer";

export default function Layout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="[@media(max-width:655px)]:p-0 p-4 flex flex-col items-center grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        expand={true}
        position="top-center"
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
}
