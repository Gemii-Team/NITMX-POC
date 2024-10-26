"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useTheme } from '@components/ThemeProvider';

const AppBar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <div className="form-control">
                    <div className="input-group">
                        <input type="text" placeholder="Search..." className="input input-bordered" />
                        <button className="btn btn-square">
                            <Search className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-none gap-2">
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <Bell className="h-5 w-5" />
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
                <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <User className="h-6 w-6 m-2" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li><a>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default AppBar;