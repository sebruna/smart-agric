import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { X, DollarSign, Weight, Loader2 } from 'lucide-react';
import api from '../../api.js';

const OfferModal = ({ crop, isOpen, onClose, onSuccess }) => {
    const { token } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        offer_price: '',
        quantity_kg: ''
    });

    if (!isOpen || !crop) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const payload = {
            crop_id: crop.id,
            offer_price: parseFloat(formData.offer_price),
            quantity_kg: parseFloat(formData.quantity_kg)
        };

        try {
            const response = await api.post('/orders', {
                body: JSON.stringify(payload)
            });

            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Failed to dispatch offer proposal.');

            onSuccess(); // Triggers parent dashboard alerts/refreshes
            onClose();   // Closes modal window overlay
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 animate-scale-up">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Propose B2B Contract</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Bidding on: <span className="font-semibold text-slate-700">{crop.crop_type}</span></p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {error && <div className="mt-4 p-3 text-xs bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

                {/* Offer Input Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Your Offer Price (per kg)</label>
                        <div className="mt-1 relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <DollarSign size={16} />
                            </div>
                            <input
                                type="number"
                                name="offer_price"
                                step="0.01"
                                min="0.01"
                                value={formData.offer_price}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 pl-9 p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Target Weight Capacity (kg)</label>
                        <div className="mt-1 relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Weight size={16} />
                            </div>
                            <input
                                type="number"
                                name="quantity_kg"
                                step="0.1"
                                min="1"
                                value={formData.quantity_kg}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 pl-9 p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
                                placeholder="e.g. 500"
                                required
                            />
                        </div>
                    </div>

                    {/* Operational Details Summary block */}
                    <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
                        <span className="block font-semibold text-slate-700 mb-0.5">Contract Safeguard:</span>
                        This offer will be broadcast instantly directly to grower node <span className="text-slate-800 font-medium">#{crop.farmer_name}</span> for review.
                    </div>

                    {/* Submission controls */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cancel</button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition-colors disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Dispatch Contract'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferModal;