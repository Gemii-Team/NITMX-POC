"use client"

import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useDash } from '@store/useDashStore';
import {
    AlertTriangle, DollarSign, Activity, Users
} from 'lucide-react';
import { randomUUID, UUID } from 'crypto';
type MetricCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    change?: string;
    isNegative?: boolean;
};

type ChartData = {
    name: string;
    value: number;
};

const DashboardComponent: React.FC = () => {
    const {
        stat,
        merchant,
        latest,
        fetchStat,
        fetchBarValue,
        fetchLatestTransaction
    } = useDash();

    useEffect(() => {
        fetchStat();
        fetchBarValue();
        fetchLatestTransaction();
    }, [
        fetchStat,
        fetchBarValue,
        fetchLatestTransaction
    ]);

    console.log(stat, merchant, latest);

    const paymentTypeData: ChartData[] = merchant?.data.map((item) => ({
        name: item.merchant_channel,
        value: item.count,
    }));

    return (
        <div className="w-full space-y-4">
            <header>
                <p className="text-left text-2xl font-semibold px-4 py-4">Dashboard</p>
            </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard icon={<Activity />} title="Total Transactions" value={(Number(stat.total_transactions) ?? 0).toLocaleString()} />
                    <MetricCard icon={<AlertTriangle />} title="Fraud Detection Rate" value={`${(Number(stat.fraud_percentage)).toLocaleString()}%`} change="-0.5%" isNegative />
                    <MetricCard icon={<DollarSign />} title="Alert Transactions" value={`${(Number(stat.caution)).toLocaleString()}`} change="+2.1%" />
                    <MetricCard icon={<Users />} title="Warning Transactions" value={`${(Number(stat.warning)).toLocaleString()}`} change="+1.2%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Merchant Type</h2>
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
                            {latest.map((transaction, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-semibold">{`Transaction #${idx}`}</p>
                                        <p className="text-sm text-gray-500">{`Bank ${transaction.sendingBank} to Bank ${transaction.receivingBank}`}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{transaction.amount.toLocaleString()}</p>
                                        <p className={`text-sm ${transaction.fraud === 1 ? 'text-red-500' : 'text-green-500'}`}>
                                            {transaction.fraud === 1 ? 'Suspicious' : 'Normal'}
                                        </p>
                                    </div>
                                </div>
                            )).filter((_, idx) => idx < 5)}
                        </div>
                    </div>
                </div>
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