"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@components/ThemeProvider";

import Sidebar from "./_components/sidebar";
import AppBar from "./_components/appbar";

import useAuthStore from "../store/useAuthStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/signIn");
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading) {
    return null;
  }

  if (!user) {
    return null; // or return a loading spinner
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="flex h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col">
              <AppBar />
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
