"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, Activity, Settings, Menu } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'Alarms', icon: Bell, href: '/alarms' },
        { name: 'Transaction', icon: Activity, href: '/transaction' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];
    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-base-200 rounded-md"
                onClick={toggleSidebar}
            >
                <Menu />
            </button>
            <aside className={`
            bg-base-200 w-64 min-h-screen p-4 fixed left-0 top-0 z-10
            transition-transform duration-300 ease-in-out
            ${clsx({
                'translate-x-0' : isOpen,
                '-translate-x-full': !isOpen
            })}
            lg:translate-x-0 lg:static
            `}>
                <div className="font-bold text-2xl mb-8 pl-4">DiagnoAlarm</div>
                <ul className="menu p-0 [&_li>*]:rounded-md">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={pathname === item.href ? 'active' : ''}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};
export default Sidebar;