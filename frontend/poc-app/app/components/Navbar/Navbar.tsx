"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            const scrollPosition = window.scrollY;

            sections.forEach((sec) => {
                const offsetTop = sec.offsetTop - 1; 
                const height = sec.offsetHeight;
                const id = sec.getAttribute("id");

               
                if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
                    setActiveSection(id); 
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className="navbar bg-base-100 fixed top-0 w-full z-10">
            <div className="navbar-start">
                <Link href="/" className="flex items-center justify-between space-x-4 text-3xl normal-case">
                    <Image
                        src="/images/eye.png"
                        width={100}
                        height={100}
                        alt="logo"
                        priority
                    />
                    <span>TEAM <strong className="text-primary">EYE</strong></span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <button onClick={() => { scrollToSection('home'); setActiveSection('home'); }}>
                            <strong className={activeSection === 'home' ? 'text-accent' : 'text-base-content'}>Home</strong>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { scrollToSection('about'); setActiveSection('about'); }}>
                            <strong className={activeSection === 'about' ? 'text-accent' : 'text-base-content'}>About</strong>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { scrollToSection('services'); setActiveSection('services'); }}>
                            <strong className={activeSection === 'services' ? 'text-accent' : 'text-base-content'}>Services</strong>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { scrollToSection('docs'); setActiveSection('docs'); }}>
                            <strong className={activeSection === 'docs' ? 'text-accent' : 'text-base-content'}>Docs</strong>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { scrollToSection('contact'); setActiveSection('contact'); }}>
                            <strong className={activeSection === 'contact' ? 'text-accent' : 'text-base-content'}>Contact</strong>
                        </button>
                    </li>
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
