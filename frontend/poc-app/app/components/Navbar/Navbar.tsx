"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../ThemeProvider';

const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar bg-base-100">
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    Your Logo
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><button onClick={() => scrollToSection('home')}>Home</button></li>
                    <li><button onClick={() => scrollToSection('about')}>About</button></li>
                    <li><button onClick={() => scrollToSection('services')}>Services</button></li>
                    <li><button onClick={() => scrollToSection('home')}>Docs</button></li>
                    <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button className="btn btn-square btn-ghost" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button className="btn">Get Started</button>
            </div>
        </nav>
    );
};

export default Navbar;