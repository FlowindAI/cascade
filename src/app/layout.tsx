"use client";

import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { Layout } from "~/components/patterns/layout";
import Providers from "~/components/providers";
import { Suspense, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import SplashScreen from "~/components/patterns/splash-screen";
import { Toaster } from "~/components/ui/sonner";
import { TailwindIndicator } from "~/components/patterns/tailwind-indicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});



const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const allowedUnauthenticatedPaths = ["/login", "/"];

    if (
      status !== "loading" &&
      status !== "authenticated" &&
      !allowedUnauthenticatedPaths.includes(pathname)
    ) {
      redirect("/login");
    }
  }, [status, pathname]);

  if (status === "loading" && pathname !== "/") return <SplashScreen />;
  return <>{children}</>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="beforeInteractive"
        />
        <Suspense>
          <Providers>
            <ProtectedRoutes>
              <Layout>{children}</Layout>
            </ProtectedRoutes>
          </Providers>
        </Suspense>
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  );
}
