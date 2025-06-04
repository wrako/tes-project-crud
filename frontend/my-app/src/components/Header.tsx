// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  // Pomáha zvýrazniť aktívny odkaz
  const isActive = (href: string) => pathname === href;

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
        <nav>
          <ul className="flex space-x-6">
            <li>
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
            </li>
            <li>
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
            </li>
            <li>
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
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
