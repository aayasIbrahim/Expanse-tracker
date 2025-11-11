"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ get session status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  
  // Links based on role
  const links = [
    { name: "Dashboard", href: "/", roles: ["admin", "manager"] },
    { name: "Add Expense", href: "/add", roles: ["admin", "manager"] },
    { name: "Report", href: "/report", roles: ["admin", "manager"] },
    { name: "Employee", href: "/clients", roles: ["admin"] },
    { name: "Transactions", href: "/transactions", roles: ["admin"] },
    { name: "Settings", href: "/settings", roles: ["admin"] },
  ];

  const userRole = session?.user?.role ?? "user";

  // Filter links based on user role
  const filteredLinks = links.filter((link) => link.roles.includes(userRole));

  // ✅ Protect route on client-side
  useEffect(() => {
    // Loading session, do nothing
    if (status === "loading") return;

    // If user not logged in or role not authorized for this route, redirect
    const routeRoles = links.find((link) => link.href === pathname)?.roles;
    if (routeRoles && !routeRoles.includes(userRole)) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pathname, userRole, router]);

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 cursor-pointer flex items-center gap-2 select-none">
            <span role="img" aria-label="money">
              💰
            </span>
            Expense Tracker
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center gap-8 text-gray-300 font-medium">
          {filteredLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-green-400 transition ${
                pathname === link.href ? "text-green-400 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Login / Logout + Hamburger */}
        <div className="flex items-center gap-3">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hidden md:block bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-white font-medium transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="hidden md:block bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-white font-medium transition"
            >
              Login
            </button>
          )}

          {/* Mobile Hamburger + buttons */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 px-4 py-4 flex flex-col gap-2 border-t border-green-600">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-gray-300 hover:text-green-400 transition ${
                    pathname === link.href ? "text-green-400 font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {session ? (
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 mt-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
                >
                  Login
                </button>
              )}
            </div>
          )}

          {/* Hamburger toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <RxCross1 /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
