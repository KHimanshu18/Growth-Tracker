import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";
import { getCurrentUser } from "@/lib/auth";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Visitor Dashboard",
  description: "Admin and visitor dashboard with RBAC",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProvider initialUser={currentUser}>{children}</AppProvider>
      </body>
    </html>
  );
}
