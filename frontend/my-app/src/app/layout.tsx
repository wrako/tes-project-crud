// src/app/layout.tsx
import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "MyCRUDApp",
  description: "CRUD Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
