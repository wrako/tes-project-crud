// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Pomáha zvýrazniť aktívny odkaz
  const isActive = (href: string) => pathname === href;

  // Zistiť, či je používateľ prihlásený (na základe JWT v localStorage)
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
  }, [pathname]);

  // Odhlásiť používateľa: vymaže token a presmeruje na /login
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/login");
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo alebo názov aplikácie */}
        {/* <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-200">
            MyCRUDApp
          </Link>
        </div> */}

        {/* Navigácia */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/offers"
            className={`px-2 py-1 rounded ${
              isActive("/offers")
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-500 hover:text-white transition-colors"
            }`}
          >
            Ponuky
          </Link>
          <Link
            href="/products"
            className={`px-2 py-1 rounded ${
              isActive("/products")
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-500 hover:text-white transition-colors"
            }`}
          >
            Produkty
          </Link>
          {!isAuthenticated && (
            <Link
              href="/login"
              className={`px-2 py-1 rounded ${
                isActive("/login")
                  ? "bg-white text-blue-600 font-semibold"
                  : "hover:bg-blue-500 hover:text-white transition-colors"
              }`}
            >
              Prihlásenie
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              Odhlásiť sa
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
