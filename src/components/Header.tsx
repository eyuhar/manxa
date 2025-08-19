import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import type { JSX } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";
import ManxaLogo from "@/assets/ManxaLogo.png";
import ThemeButton from "./ThemeButton";

const navItems: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Discover", href: "/discover" },
  { name: "MyManxa", href: "/myManxa" },
  { name: "History", href: "/history" },
  { name: "Profile", href: "/profile" },
];

function Header(): JSX.Element {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="w-full px-4 py-2 flex items-center gap-2 justify-between">
      <div className="hidden md:flex w-full items-center gap-2 justify-between">
        <div className="flex items-center gap-1">
          <img
            src={ManxaLogo}
            alt="Manxa Logo"
            className="w-34 bg-transparent mr-2"
          />
          <nav className="flex gap-1 font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="relative">
                  <Button
                    asChild
                    variant="ghost"
                    className="px-3 py-1 text-sm font-medium"
                  >
                    <Link to={item.href} className="relative">
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="underline-container"
                          className="absolute left-2 right-2 -bottom-1 h-[2px]"
                          transition={{
                            ease: "easeInOut",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.6,
                          }}
                        >
                          <motion.div
                            key={item.href}
                            initial={{
                              scaleX: 0.1,
                              transition: { duration: 0.6 },
                            }}
                            animate={{
                              scaleX: 1,
                              transition: { duration: 0.4, delay: 0.5 },
                            }}
                            className="w-full h-full bg-foreground"
                            transition={{ ease: "easeInOut" }}
                          />
                        </motion.div>
                      )}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </nav>
        </div>
        <div>
          {isLoading ? (
            <span>
              <div className="p-4 flex items-center justify-center">
                <svg
                  className="w-8 animate-spin fill-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>loading</title>
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
              </div>
            </span>
          ) : user ? (
            <div className="flex items-center gap-2">
              <ThemeButton />
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={logout}
              >
                <p className="w-full test-sm font-medium">Logout</p>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeButton />
              <Button variant="outline" asChild>
                <Link to="login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden w-full flex items-center gap-2 justify-between">
        <img
          src="src/assets/ManxaLogo.png"
          alt="Manxa Logo"
          className="w-34 bg-transparent mr-2"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="focus-visible:ring-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>menu</title>
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
              </svg>
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            {user ? (
              <>
                <DropdownMenuLabel className="max-w-140 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-base flex items-center gap-1">
                  <div>
                    <svg
                      className="w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>account</title>
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                  </div>
                  {user.user_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem className="flex items-center justify-center focus:bg-red">
                  <Button>
                    <Link to="login" className="w-full">
                      Login
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <DropdownMenuItem key={item.href} className="relative w-full">
                  <Link
                    to={item.href}
                    className="w-full relative font-medium text-sm"
                  >
                    <div className="inline-block relative">
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 right-0 -bottom-1 h-[2px] "
                          transition={{
                            ease: "easeInOut",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.6,
                          }}
                        >
                          <motion.div
                            key={item.href}
                            initial={{
                              scaleX: 0.1,
                              transition: { duration: 0.6 },
                            }}
                            animate={{
                              scaleX: 1,
                              transition: { duration: 0.4, delay: 0.1 },
                            }}
                            className="h-full bg-foreground origin-left"
                            transition={{ ease: "easeInOut" }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            {user ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="w-full">
                  <Link to="/" className="w-full font-medium text-sm">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
