import { useEffect, useState } from 'react';
import { X, Tractor, MapPin, AlignLeft, ShieldCheck } from 'lucide-react';
import api from '../../api';

const FarmerProfileModal = ({ userId, token, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmerProfile = async () => {
            try {
                const response = await api.get(`/farmer/public-profile/${userId}`, );
                if (response.status === 200) {
                    const data = await response.data;
                    setProfile(data);
                }
            } catch (err) {
                console.error("Error pulling public farm credentials:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchFarmerProfile();
    }, [userId, token]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
               
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                            {profile?.profile_pic ? (
                                <img src={`http://localhost:4000${profile.profile_pic}`} alt="Farm" className="w-full h-full object-cover" />
                            ) : (
                                <Tractor size={24} className="text-white/80" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{loading ? 'Loading...' : profile?.farm_name}</h3>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <ShieldCheck size={10} /> Verified Producer
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Details Content */}
                <div className="p-6 space-y-5">
                    {loading ? (
                        <div className="py-8 text-center text-sm text-slate-400">Synchronizing farm records...</div>
                    ) : (
                        <>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                    <MapPin size={12} className="text-slate-500" /> Logistical Distribution Hub
                                </h4>
                                <p className="mt-1 text-sm font-semibold text-slate-700 capitalize">{profile?.shipping_hub || 'Central Logistics Depot'}</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                    <AlignLeft size={12} className="text-slate-500" /> Operational Bio & Standards
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                                    {profile?.bio || "This agricultural enterprise hasn't added a custom operational profile bio statement yet."}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 italic">
                                <span>Direct contact lines hidden until contract execution.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerProfileModal;
