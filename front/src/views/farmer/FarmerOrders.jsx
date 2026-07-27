import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import FarmerLayout from './FarmerLayout.jsx'; // Assumes you have your matching Farmer tracking layout
import { FileText, DollarSign, Weight, RefreshCw, Check, X, AlertCircle } from 'lucide-react';
import api from '../../api.js';

const FarmerOrders = () => {
    const { token } = useAuth();
    const [incomingOffers, setIncomingOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchIncomingOffers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/orders', );
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Failed to sync incoming contract books.');
            setIncomingOffers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomingOffers();
    }, []);

    // ─── TRANSACTION MODERATION HANDLER ──────────────────────────────
    const handleOfferDecision = async (orderId, statusDecision) => {
        if (!window.confirm(`Are you sure you want to mark this offer proposal as ${statusDecision}?`)) return;
       
        setActionLoadingId(orderId);
        try {
            const response = await api.put(`/orders/${orderId}/status`, {
                body: JSON.stringify({ status: statusDecision })
            });
           
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Failed to record deal resolution update.');

            // Optimistically update the status locally on screen array grid state match
            setIncomingOffers(prevOffers =>
                prevOffers.map(offer =>
                    offer.id === orderId ? { ...offer, status: statusDecision } : offer
                )
            );
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
            default: return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
        }
    };

    return (
        <FarmerLayout>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">B2B Purchase Proposals</h2>
                    <p className="text-sm text-gray-500 mt-1">Review, evaluate, and finalize binding wholesale crop offers submitted by verified marketplace buyers.</p>
                </div>
                <button
                    onClick={fetchIncomingOffers}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh Offers
                </button>
            </div>

            {error && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-sm text-gray-400">Loading incoming buyer contract pipelines...</div>
                ) : incomingOffers.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 gap-2">
                        <FileText size={36} className="text-gray-300" />
                        No purchase offers received for your crop yields yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Offer ID</th>
                                    <th className="px-6 py-4">Target Crop Yield</th>
                                    <th className="px-6 py-4">Prospective Buyer</th>
                                    <th className="px-6 py-4">Bid Rate Parameters</th>
                                    <th className="px-6 py-4">Gross Contract Value</th>
                                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {incomingOffers.map((offer) => {
                                    const totalPayout = (parseFloat(offer.offer_price) * parseFloat(offer.quantity_kg)).toFixed(2);
                                    const isPending = offer.status === 'pending';

                                    return (
                                        <tr key={offer.id} className="hover:bg-gray-50/40 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-400">#{offer.id}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{offer.crop_type}</td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{offer.buyer_name}</td>
                                            
                                            <td className="px-6 py-4">
                                                <div className="text-xs space-y-1">
                                                    {/* Render our Standard Pricing Metric numbers */}
                                                    <p className="flex items-center gap-1 text-slate-500 font-medium">
                                                        <DollarSign size={12} /> {offer.offer_price} / kg
                                                    </p>
                                                    <p className="flex items-center gap-1 text-gray-900 font-medium">
                                                        <Weight size={12} /> {offer.quantity_kg} kg
                                                    </p>
                                            
                                                    {/* 🚨 THRESHOLD ALERT BADGE LOOP: If order is pending and flagged CRITICAL_LOW, render alert */}
                                                    {offer.status === 'pending' && offer.price_evaluation === 'CRITICAL_LOW' && (
                                                        <div className="inline-flex items-center gap-1 rounded bg-red-50 text-red-700 px-2 py-0.5 font-bold text-[10px] tracking-wide uppercase border border-red-200 animate-pulse mt-1">
                                                            <AlertCircle size={10} /> Below Market Val
                                                        </div>
                                                    )}
                                                   
                                                    {/* OPTIMAL STATE BADGE: If it's a strong, competitive offer above baseline */}
                                                    {offer.status === 'pending' && offer.price_evaluation === 'STANDARD' && (
                                                        <div className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-semibold text-[10px] tracking-wide uppercase border border-emerald-100 mt-1">
                                                            Fair Market Price
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 font-bold text-emerald-700 font-mono text-sm">${totalPayout}</td>
                                            <td className="px-6 py-4 text-right">
                                                {isPending ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            disabled={actionLoadingId !== null}
                                                            onClick={() => handleOfferDecision(offer.id, 'rejected')}
                                                            className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 rounded-md px-2.5 py-1 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                                        >
                                                            <X size={14} /> Decline
                                                        </button>
                                                        <button
                                                            disabled={actionLoadingId !== null}
                                                            onClick={() => handleOfferDecision(offer.id, 'accepted')}
                                                            className="inline-flex items-center gap-1 bg-emerald-600 text-white rounded-md px-2.5 py-1 text-xs font-semibold hover:bg-emerald-500 shadow-sm transition-colors disabled:opacity-50"
                                                        >
                                                            <Check size={14} /> Accept Deal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border uppercase tracking-wider ${getStatusBadge(offer.status)}`}>
                                                        {offer.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </FarmerLayout>
    );
};

export default FarmerOrders;