"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  User,
  Menu,
  X,
  Home,
  Activity,
  Settings,
} from "lucide-react";
import { useTheme } from "@components/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const AppBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Alarms", icon: Bell, href: "/alarms" },
    { name: "Transaction", icon: Activity, href: "/transaction" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];
  return (
    <header className="sticky top-0 justify-content-end z-50">
      {/* Main Navigation Bar */}
      <div className="navbar bg-base-100 justify-content-end shadow-md">
        {/* Mobile Menu Button */}
        <div className="flex-none lg:hidden">
          <button
            className="btn btn-ghost btn-sm px-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Logo/Brand - Show on all screens */}
        {isMobileMenuOpen && (
          <div className="flex-1 px-2">
            <span className="font-bold text-lg">Brand</span>
          </div>
        )}


        {/* Right Section Icons */}
        <div className="flex-none justify-content-end gap-2">
          {/* Mobile Search Toggle */}
          <button
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notification Bell */}
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="h-5 w-5" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* User Menu Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-base-200">
                <User className="h-6 w-6 m-2" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="py-2">Profile</a>
              </li>
              <li>
                <a className="py-2">Settings</a>
              </li>
              <li>
                <a className="py-2">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isSearchOpen && (
        <div className="lg:hidden bg-base-100 p-2 shadow-md">
          <div className="form-control w-full">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full"
                autoFocus
              />
              <button className="btn btn-square">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-base-100 shadow-md">
          <ul className="menu menu-sm p-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx({
                    active: pathname === item.href,
                    "menu-item": true,
                  })}
                //   onClick={() => {
                //       if (window.innerWidth < 1024) toggleSidebar();
                //   }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default AppBar;
