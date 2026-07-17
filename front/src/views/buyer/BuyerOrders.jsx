import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import BuyerLayout from './BuyerLayout.jsx';
import { FileText, DollarSign, Weight, Calendar, RefreshCw, Clock, CheckCircle2, XCircle } from 'lucide-react';

const BuyerOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to pull order registries.');
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 size={14} className="text-emerald-600" />;
            case 'rejected': return <XCircle size={14} className="text-rose-600" />;
            default: return <Clock size={14} className="text-amber-600" />;
        }
    };

    return (
        <BuyerLayout>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Orders & Offers</h2>
                    <p className="text-sm text-slate-500 mt-1">Track binding procurement proposals, values, and negotiation feedback loops.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Sync Ledger
                </button>
            </div>

            {error && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-sm text-slate-400">Downloading historical contracts...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400 gap-2">
                        <FileText size={36} className="text-slate-300" />
                        No purchase requests active yet. Navigate to the Marketplace Bazaars to pitch a crop contract.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Contract ID</th>
                                    <th className="px-6 py-4">Crop Variety</th>
                                    <th className="px-6 py-4">Grower Node</th>
                                    <th className="px-6 py-4">Bid Parameters</th>
                                    <th className="px-6 py-4">Estimated Gross</th>
                                    <th className="px-6 py-4">Status Flag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {orders.map((contract) => {
                                    const grossValue = (parseFloat(contract.offer_price) * parseFloat(contract.quantity_kg)).toFixed(2);
                                    return (
                                        <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{contract.id}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">{contract.crop_type}</td>
                                            <td className="px-6 py-4 text-slate-600">{contract.farmer_name}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs space-y-0.5">
                                                    <p className="flex items-center gap-1 text-slate-500"><DollarSign size={12} /> {contract.offer_price} / kg</p>
                                                    <p className="flex items-center gap-1 text-slate-900 font-medium"><Weight size={12} /> {contract.quantity_kg} kg</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 font-mono text-sm">${grossValue}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${getStatusStyle(contract.status)}`}>
                                                    {getStatusIcon(contract.status)}
                                                    {contract.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </BuyerLayout>
    
    );
};

export default BuyerOrders;