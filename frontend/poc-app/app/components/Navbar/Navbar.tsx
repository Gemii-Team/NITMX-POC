"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../ThemeProvider';
import { useRouter } from 'next/navigation';



const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false); 
        }
    };

    const handleMenu = () => {
        router.push("/signIn");
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            const scrollPosition = window.scrollY;

            sections.forEach((sec) => {
                const offsetTop = sec.offsetTop - 150;
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
        <nav className="navbar bg-base-100 shadow-xl fixed top-0 w-full z-10">
            <div className="navbar-start">
                <Link href="/" className="flex items-center justify-between space-x-4 text-3xl normal-case">
                    <span><strong className="text-[#0062FF]">EYE.</strong></span>
                </Link>
            </div>


            <div className="navbar-end lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-square btn-ghost">
                    {isMenuOpen ? '✖' : '☰'}
                </button>
            </div>


            <div className={`navbar-center ${isMenuOpen ? "block" : "hidden"} lg:flex lg:flex-row`}>
                {isMenuOpen && (
                    <div className="w-full bg-base-200 shadow-md absolute top-full left-0 z-10">
                        <ul className="flex flex-col items-center space-y-4 py-4">
                            <li>
                                <button onClick={() => scrollToSection('home')} className="text-lg">
                                    <span className={activeSection === 'home' ? 'text-[#0062FF]' : ''}>Home</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('about')} className="text-lg">
                                    <span className={activeSection === 'about' ? 'text-[#0062FF]' : ''}>About</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('services')} className="text-lg">
                                    <span className={activeSection === 'services' ? 'text-[#0062FF]' : ''}>Services</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('faq')} className="text-lg">
                                    <span className={activeSection === 'faq' ? 'text-[#0062FF]' : ''}>FAQ</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('contact')} className="text-lg">
                                    <span className={activeSection === 'contact' ? 'text-[#0062FF]' : ''}>Contact</span>
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-square btn-ghost mr-4" onClick={toggleTheme}>
                                    {theme === 'light' ? '🌙' : '☀️'}
                                </button>
                         
                              <button className="btn btn-primary bg-transparent border border-primary text-primary hover:bg-primary hover:text-white" onClick={handleMenu}>Get Started</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="navbar-end hidden lg:flex">
                <button className="btn btn-square btn-ghost mr-4" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button className="btn btn-primary bg-transparent border border-primary text-primary hover:bg-primary hover:text-white" onClick={handleMenu} >Get Started</button>
            </div>
        </nav>
    );
};

export default Navbar;
