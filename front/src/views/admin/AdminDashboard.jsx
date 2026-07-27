import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { Users, Sprout, Layers, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import api from '../../api.js';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics/overview', );
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Analytics fetch failure.');
                setStats(data);
            } catch (err) {
                setError(err.message);
            } {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center text-sm text-gray-500 animate-pulse">
                    Compiling ecosystem parameters...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Header section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Ecosystem Health Metrics</h2>
                <p className="text-sm text-gray-500 mt-1">Real-time status summaries across agricultural operational nodes.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

            {/* 1. KPI Top Metric Blocks */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Platform Active Accounts</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Total Registered Land</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">{stats?.totalFields || 0} Plots</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                        <Layers size={24} />
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Managed Crop Batches</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">{stats?.totalCrops || 0}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                        <Sprout size={24} />
                    </div>
                </div>
            </div>

            {/* 2. Secondary Analytics Charts & Health Section */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Crop Stage Distribution Tracker */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <TrendingUp size={18} className="text-emerald-600" />
                        Crop Lifecycle Metrics
                    </h3>
                    <div className="space-y-4 mt-6">
                        {stats?.cropBreakdown && stats.cropBreakdown.length > 0 ? (
                            stats.cropBreakdown.map((item) => {
                                // Simple proportional bar logic calculator
                                const percentage = Math.min(100, Math.max(10, (item.count / (stats.totalCrops || 1)) * 100));
                                return (
                                    <div key={item.status}>
                                        <div className="flex justify-between text-xs font-semibold uppercase text-gray-500 mb-1">
                                            <span>{item.status}</span>
                                            <span className="font-mono text-gray-900">{item.count} batches</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    item.status === 'planted' ? 'bg-blue-500' : item.status === 'growing' ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">No crop lifecycle metrics available yet.</p>
                        )}
                    </div>
                </div>

                {/* Gateway Real-Time Node Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Activity size={18} className="text-purple-600" />
                        Infrastructure Gateways
                    </h3>
                    <ul className="divide-y divide-gray-100 text-sm mt-2">
                        <li className="py-3 flex items-center justify-between">
                            <span className="font-medium text-gray-700">Database Engine Core Connection</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck size={14} /> Operational
                            </span>
                        </li>
                        <li className="py-3 flex items-center justify-between">
                            <span className="font-medium text-gray-700">Ecosystem Router Guards</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck size={14} /> Active Secure
                            </span>
                        </li>
                        <li className="py-3 flex items-center justify-between">
                            <span className="font-medium text-gray-700">IoT Remote Sensors Relay Telemetry</span>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                                Idle (Awaiting Configuration)
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;