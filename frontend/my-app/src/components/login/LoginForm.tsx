// components/AuthForm.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthRequest {
  username: string;
  password: string;
  email?: string;
}

interface AuthResponse {
  token: string;
}

const AuthForm: React.FC = () => {
  // 1. Režim formulára: "login" alebo "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // 2. Polia formulára (username, password, email pri registrácii)
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // 3. Potvrdenie hesla (len pri registrácii)
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // 4. Stavy pre chybové a úspešné hlásenia
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // pri prepnutí režimu resetujeme polia a hlásenia
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
  }, [mode]);

  // 5. Spracovanie odoslania formulára
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === "register") {
      // Pri registrácii kontrolujeme zhodu hesiel
      if (password !== confirmPassword) {
        setError("Heslá sa nezhodujú");
        return;
      }
      if (email.trim() === "") {
        setError("Email nesmie byť prázdny");
        return;
      }

      try {
        const payload: AuthRequest = { username, password, email };
        const response = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // Backend vracia plain text – správa o úspechu alebo chybe
        const text = await response.text();

        if (!response.ok) {
          // Ak server vráti chybný stav, zobrazíme jeho text
          throw new Error(text || "Chyba pri registrácii");
        }

        // Ak je úspech, zobrazíme správu a prepíname na režim "login"
        setSuccessMessage(text); // napr. "Verification email sent."
        setMode("login");
        // Polia password a confirmPassword vyčistíme, username a email ponecháme
        setPassword("");
        setConfirmPassword("");
      } catch (err: any) {
        console.error("Register error:", err);
        setError(err.message || "Zlyhanie pri registrácii");
      }
    } else {
      // Režim "login"
      try {
        const payload: AuthRequest = { username, password };
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // čítame text chyby od servera (ak existuje)
          const errorText = await response.text();
          throw new Error(errorText || "Nepodarilo sa prihlásiť");
        }

        const data: AuthResponse = await response.json();
        const { token } = data;

        // Uložíme token do localStorage
        localStorage.setItem("jwtToken", token);

        // Presmerujeme na chránenú stránku (napr. /offers)
        router.push("/offers");
      } catch (err: any) {
        console.error("Login error:", err);
        setError(err.message || "Zlyhanie pri prihlásení");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        {/* Nadpis */}
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {mode === "login" ? "Prihlásenie" : "Registrácia"}
        </h1>

        {/* Chybové hlásenie */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Hlásenie o úspechu */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 border border-green-300 rounded-md p-2 mb-4 text-sm">
            {successMessage}
          </div>
        )}

        {/* Formulár */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Používateľské meno */}
          <div>
            <label htmlFor="username" className="sr-only">
              Používateľské meno
            </label>
            <input
              id="username"
              type="text"
              placeholder="Používateľské meno"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email (len pri registrácii) */}
          {mode === "register" && (
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Heslo */}
          <div>
            <label htmlFor="password" className="sr-only">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Potvrdenie hesla (len pri registrácii) */}
          {mode === "register" && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Potvrďte heslo
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Potvrďte heslo"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Tlačidlo Odoslať */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
            >
              {mode === "login" ? "Prihlásiť sa" : "Registrovať sa"}
            </button>
          </div>
        </form>

        {/* Prepínač režimu */}
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <p>
              Nemáte účet?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-blue-600 hover:underline"
              >
                Zaregistrovať sa
              </button>
            </p>
          ) : (
            <p>
              Už máte účet?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Prihlásiť sa
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
