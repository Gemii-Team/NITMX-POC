"use client"

import React, { useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Bell, Settings, ChevronDown, AlertTriangle, DollarSign, Activity, Users
} from 'lucide-react';

type MetricCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    isNegative?: boolean;
};

type ChartData = {
    name: string;
    value: number;
};

const DashboardComponent: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

    const fraudTrendData: { time: string; rate: number }[] = [
        { time: '00:00', rate: 2 }, { time: '04:00', rate: 3 },
        { time: '08:00', rate: 5 }, { time: '12:00', rate: 4 },
        { time: '16:00', rate: 6 }, { time: '20:00', rate: 3 },
    ];

    const bankDistributionData: ChartData[] = [
        { name: 'Bank A', value: 400 }, { name: 'Bank B', value: 300 },
        { name: 'Bank C', value: 200 }, { name: 'Others', value: 100 },
    ];

    const paymentTypeData: ChartData[] = [
        { name: 'Transfer', value: 400 }, { name: 'PromptPay', value: 300 },
        { name: 'Other', value: 300 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="min-h-screen bg-gray-100">
            <header>
                <p className="text-left text-2xl font-semibold px-4 py-4">Dashboard</p>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard icon={<Activity />} title="Total Transactions" value="1,234" change="+5.3%" />
                    <MetricCard icon={<AlertTriangle />} title="Fraud Detection Rate" value="2.4%" change="-0.5%" isNegative />
                    <MetricCard icon={<DollarSign />} title="Avg Transaction Amount" value="$1,025" change="+2.1%" />
                    <MetricCard icon={<Users />} title="Active Users" value="5,678" change="+1.2%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Fraud Trend</h2>
                        <div className="flex justify-between items-center mb-4">
                            <div className="space-x-2">
                                {(['24h', '7d', '30d'] as const).map((range) => (
                                    <button
                                        key={range}
                                        className={`px-3 py-1 rounded ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setTimeRange(range)}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={fraudTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Transaction Distribution by Bank</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={bankDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {bankDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Payment Type Analysis</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paymentTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-semibold">Transaction #{item}</p>
                                        <p className="text-sm text-gray-500">Bank A to Bank B</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">$1,000</p>
                                        <p className={`text-sm ${item % 3 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {item % 3 === 0 ? 'Suspicious' : 'Normal'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, change, isNegative = false }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                {icon}
            </div>
            <div className={`text-sm font-semibold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                {change}
            </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700">{title}</h3>
        <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
);

export default DashboardComponent;