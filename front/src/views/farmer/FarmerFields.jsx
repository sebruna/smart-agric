import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import FarmerLayout from './FarmerLayout.jsx';
import { Shovel, MapPin, Maximize2, PlusCircle, Loader2 } from 'lucide-react';
import api from '../../api.js';

const FarmerFields = () => {
    const { token } = useAuth();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        size: ''
    });

    const fetchMyFields = async () => {
        try {
            const response = await api.get('/field/get',);
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Failed to sync plots.');
            setFields(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyFields();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        // Ensure proper numerical formatting mapping
        const payload = {
            name: formData.name,
            location: formData.location,
            size: parseFloat(formData.size)
        };

        try {
            const response = await api.post('/field/add', { payload });

            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Failed to record plot data.');

            setSuccess('Plot logged and mapped to your operation node.');
            setFormData({ name: '', location: '', size: '' });
            fetchMyFields(); // Refresh layout grid lists
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FarmerLayout>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Manage Operational Land Plots</h2>
                <p className="text-sm text-stone-500 mt-1">Register field parameters and evaluate dimensional infrastructure nodes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Left Input Form Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-fit">
                    <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 mb-4">
                        <PlusCircle className="text-emerald-600" size={20} />
                        Register New Field
                    </h3>

                    {error && <div className="p-3 mb-4 text-xs bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
                    {success && <div className="p-3 mb-4 text-xs bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800">{success}</div>}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Plot Blueprint Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. North Ridge Zone A"
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Geographic Location Description</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Sect 4, West Valley Coordinate"
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Total Size Area (Hectares)</label>
                            <input
                                type="number"
                                name="size"
                                step="0.01"
                                value={formData.size}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. 12.50"
                                className="mt-1 block w-full text-sm rounded-lg border border-stone-300 p-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-2 flex justify-center items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Commit Plot Storage'}
                        </button>
                    </form>
                </div>

                {/* 2. Right Data Index Layout List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                        <div className="border-b border-stone-100 bg-stone-50/50 p-4">
                            <h3 className="font-bold text-stone-800">Your Configured Fields</h3>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-sm text-stone-400">Syncing active fields...</div>
                        ) : fields.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400 gap-2">
                                <Shovel size={32} className="text-stone-300" />
                                No active fields recorded on this operator log node.
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {fields.map((field) => (
                                    <div key={field.id} className="p-4 sm:flex sm:items-center sm:justify-between hover:bg-stone-50/60 transition-colors">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-stone-900 text-base">{field.name}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                                                <span className="flex items-center gap-1"><MapPin size={14} /> {field.location}</span>
                                                <span className="flex items-center gap-1"><Maximize2 size={14} /> {field.size_hectares} Hectares</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-800 border">
                                                ID Key: #{field.id}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
};

export default FarmerFields;