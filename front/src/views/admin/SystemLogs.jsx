import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { Terminal, RefreshCw, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import api from '../../api.js';

const SystemLogs = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/logs',);
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message);
            setLogs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    const getActionBadgeColor = (type) => {
        if (type.includes('SUSPENDED') || type.includes('DELETE')) return 'bg-red-50 text-red-700 border-red-200';
        if (type.includes('MODIFIED') || type.includes('UPDATE')) return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-blue-50 text-blue-700 border-blue-200';
    };

    return (
        <AdminLayout>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Terminal size={22} className="text-gray-700" /> System Audit Trails
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Immutable trace events mapping structural modifications across ecosystem nodes.</p>
                </div>
                <button onClick={fetchLogs} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50">
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sync Stream
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border">{error}</div>}

            <div className="bg-gray-900 text-gray-100 rounded-xl font-mono text-xs shadow-inner overflow-hidden border border-gray-800">
                <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-2"><Cpu size={14} /> telemetry_stream.log</span>
                    <span>Buffer: 250 rows max</span>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto divide-y divide-gray-800/60">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Parsing system log events...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Console queue empty. No actions recorded yet.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-500 bg-gray-950/40 text-[10px] uppercase tracking-wider border-b border-gray-800">
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4">Event Group</th>
                                    <th className="p-4">Operator Info</th>
                                    <th className="p-4">Action Payload Details</th>
                                    <th className="p-4">IPv4 Client</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/40">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-800/20">
                                        <td className="p-4 text-gray-400 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeColor(log.action_type)}`}>
                                                {log.action_type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300 whitespace-nowrap">
                                            {log.operator_name ? `${log.operator_name} (${log.operator_role || 'admin'})` : 'SYSTEM_SCHEDULER'}
                                        </td>
                                        <td className="p-4 text-emerald-400 min-w-[300px] max-w-xl whitespace-normal break-words">{log.description}</td>
                                        <td className="p-4 text-gray-500 font-mono">{log.ip_address || '127.0.0.1'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SystemLogs;