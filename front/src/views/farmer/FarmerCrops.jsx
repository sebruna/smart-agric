import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import FarmerLayout from './FarmerLayout.jsx';
import { Sprout, Calendar, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const FarmerCrops = () => {
    const { token } = useAuth();
    const [fields, setFields] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        field_id: '',
        crop_type: '',
        status: 'planted',
        planted_at: ''
    });

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Fetch Farmer's Fields for the dropdown selection
            const fieldsResponse = await fetch('http://localhost:4000/api/field/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const fieldsData = await fieldsResponse.json();
            if (!fieldsResponse.ok) throw new Error(fieldsData.message || 'Failed to sync fields.');
            setFields(fieldsData);

            // 2. Fetch Farmer's Crops (assuming a generic crops endpoint exists or filtering on backend)
            // For now, we will fetch crops. Ensure your backend route router is hooked up!
            const cropsResponse = await fetch('http://localhost:4000/api/crop/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cropsData = await cropsResponse.json();
            if (cropsResponse.ok) setCrops(cropsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const response = await fetch('http://localhost:4000/api/crop/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to log crop data.');

            setSuccess('Crop batch logged and tracking initialized.');
            setFormData({ field_id: '', crop_type: '', status: 'planted', planted_at: '' });
            fetchData(); // Refresh list grid
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'planted': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'growing': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'harvested': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-stone-50 text-stone-700 border-stone-200';
        }
    };

    return (
        <FarmerLayout>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Crop Batch Tracking</h2>
                <p className="text-sm text-stone-500 mt-1">Monitor lifecycle stages, scheduling, and active yield outputs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Log Crop Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-fit">
                    <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 mb-4">
                        <Sprout className="text-emerald-600" size={20} />
                        Plant New Batch
                    </h3>

                    {error && <div className="p-3 mb-4 text-xs bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
                    {success && <div className="p-3 mb-4 text-xs bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800">{success}</div>}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Target Field Assignment</label>
                            <select
                                name="field_id"
                                value={formData.field_id}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            >
                                <option value="">Select a plot allocation...</option>
                                {fields.map(field => (
                                    <option key={field.id} value={field.id}>{field.name} ({field.size_hectares} Ha)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Crop Variety / Strain</label>
                            <input
                                type="text"
                                name="crop_type"
                                value={formData.crop_type}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Yellow Maize, Roma Tomatoes"
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Initial Cycle State</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            >
                                <option value="planted">Planted</option>
                                <option value="growing">Growing / Vegetative</option>
                                <option value="harvested">Harvested</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Planting Timestamp Date</label>
                            <input
                                type="date"
                                name="planted_at"
                                value={formData.planted_at}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || fields.length === 0}
                            className="w-full mt-2 flex justify-center items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Commit Crop Batch'}
                        </button>
                    </form>
                </div>

                {/* 2. Active Inventory Table Wrapper */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                        <div className="border-b border-stone-100 bg-stone-50/50 p-4">
                            <h3 className="font-bold text-stone-800">Your Cultivated Batches</h3>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-sm text-stone-400">Syncing active inventory parameters...</div>
                        ) : crops.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400 gap-2">
                                <AlertCircle size={32} className="text-stone-300" />
                                No crops currently growing or logged on your timeline profiles.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-stone-50 border-b border-stone-100 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        <tr>
                                            <th className="px-6 py-3">Crop Variety</th>
                                            <th className="px-6 py-3">Allocated Field ID</th>
                                            <th className="px-6 py-3">Planted Date</th>
                                            <th className="px-6 py-3">Cycle Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 text-stone-700">
                                        {crops.map((crop) => (
                                            <tr key={crop.id} className="hover:bg-stone-50/50 transition-colors">
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-stone-900 flex items-center gap-2">
                                                    <Tag size={16} className="text-emerald-600" />
                                                    {crop.crop_type}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-stone-500">
                                                    Plot Reference #{crop.field_id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-stone-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} className="text-stone-400" />
                                                        {new Date(crop.planted_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${getStatusStyle(crop.status)}`}>
                                                        {crop.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
};

export default FarmerCrops;