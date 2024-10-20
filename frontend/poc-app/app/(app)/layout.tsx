"use client";

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@components/ThemeProvider';

import Sidebar from './components/sidebar';
import AppBar from './components/appbar';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
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
                            <main className="flex-1 overflow-y-auto p-4">
                                {children}
                            </main>
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}