import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { Sliders, Percent, AlertTriangle, ShieldCheck, Save, RefreshCw } from 'lucide-react';
import api from '../../api.js';

const AdminSettings = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
   
    const [settings, setSettings] = useState({
        marketplace_fee_percent: '1.5',
        lowball_alert_percent: '20',
        require_registration_approval: 'false'
    });

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin-panel/settings',);
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message);
            setSettings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? String(checked) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await api.put('/admin-panel/settings', {
                body: JSON.stringify(settings)
            });
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message);
            setSuccessMsg(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sliders size={22} className="text-gray-700" /> Global Ecosystem Parameters
                </h2>
                <p className="mt-1 text-sm text-gray-500">Fine-tune transaction rules, market guardrails, and security overrides across platform nodes.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>}
            {successMsg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold">{successMsg}</div>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-sm text-gray-400">Loading master configuration variables...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 divide-y divide-gray-100">
                        {/* SECTION 1: FINANCIAL CONTROLS */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2 text-slate-500">
                                <Percent size={14} /> Revenue & Commission Architectures
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700">Marketplace Service Commission Fee (%)</label>
                                <p className="text-[11px] text-gray-400 mt-0.5">The platform cut deducted automatically from closed contracts.</p>
                                <input
                                    type="number" step="0.1" name="marketplace_fee_percent"
                                    value={settings.marketplace_fee_percent} onChange={handleChange}
                                    className="mt-2 w-32 rounded-lg border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* SECTION 2: BUSINESS LOGIC GUARDRAILS */}
                        <div className="space-y-4 pt-6">
                            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2 text-slate-500">
                                <AlertTriangle size={14} /> Market Threshold Adjustments
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700">Lowball Offer Flag Trigger Deviation (%)</label>
                                <p className="text-[11px] text-gray-400 mt-0.5">How far a buyer's bid must drop below standard market baseline to flash a warning on the farmer dashboard.</p>
                                <input
                                    type="number" name="lowball_alert_percent"
                                    value={settings.lowball_alert_percent} onChange={handleChange}
                                    className="mt-2 w-32 rounded-lg border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* SECTION 3: SECURITY CONTROLS */}
                        <div className="space-y-4 pt-6">
                            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2 text-slate-500">
                                <ShieldCheck size={14} /> Security Overrides & Gates
                            </h3>
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox" id="require_registration_approval" name="require_registration_approval"
                                    checked={settings.require_registration_approval === 'true'} onChange={handleChange}
                                    className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                />
                                <div className="text-xs">
                                    <label htmlFor="require_registration_approval" className="font-semibold text-gray-700">Enforce Manual Admin Approval Gateway</label>
                                    <p className="text-gray-400 mt-0.5">When checked, new growers and buyers are locked in an unverified state until approved by an admin dashboard command.</p>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON ROW */}
                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit" disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-55"
                            >
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                Commit Variables
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;