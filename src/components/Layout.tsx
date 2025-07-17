import { Outlet } from "react-router-dom";
import Header from "./Header";
import type { JSX } from "react";
import { Toaster } from "./ui/sonner";

export default function Layout(): JSX.Element {
  return (
    <>
      <Header />
      <main className=" [@media(max-width:655px)]:p-0 p-4 flex flex-col items-center">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
