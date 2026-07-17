import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { Sprout, MapPin, Layers, RefreshCw } from 'lucide-react';

const AdminFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchFields = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/field/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Passing the JWT securely
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch field inventories.');
            }

            setFields(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, []);

    return (
        <AdminLayout>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Registered Agricultural Fields</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        A global list of land tracking arrays, localized telemetry areas, and management nodes.
                    </p>
                </div>
                <div className="mt-4 sm:ml-4 sm:mt-0">
                    <button
                        onClick={fetchFields}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Error Handlers */}
            {error && (
                <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Data Presentation Container */}
            <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Loading field parameters...
                    </div>
                ) : fields.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-gray-500">
                        <Sprout size={32} className="text-gray-300" />
                        No farm plots registered in the system database yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Field Identity Mapping</th>
                                    <th className="px-6 py-4">Geographic Coordinates/Location</th>
                                    <th className="px-6 py-4">Surface Area Space</th>
                                    <th className="px-6 py-4">Farmer Association Reference</th>
                                    <th className="px-6 py-4 text-right">System Configuration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-700">
                                {fields.map((field) => (
                                    <tr key={field.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
                                                    <Layers size={18} />
                                                </div>
                                                <span>{field.name}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={16} className="text-gray-400" />
                                                {field.location}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">
                                            {field.size_hectares} Hectares
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                            ID Reference: <span className="font-semibold text-gray-700">#{field.farmer_id}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-900 hover:underline">
                                                Inspect Nodes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminFields;