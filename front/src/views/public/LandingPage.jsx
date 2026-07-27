import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Users, TrendingUp, ArrowRight, ShieldCheck, ShoppingCart, Loader2, MapPin, Layers } from 'lucide-react';
import api from '../../api';

const LandingPage = () => {
    const [data, setData] = useState({ showcase: [], metrics: { active_growers: 0, tons_traded: 0, harvests_completed: 0 } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const response = await api.get('/public/landing-preview');
                if (response.status === 200) {
                    const result = await response.data;
                    setData(result);
                }
            } catch (err) {
                console.error("Failed to fetch public preview indexes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLandingData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
            {/* Minimalist Top Navigation Menu */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl text-emerald-600 tracking-tight">
                        <Sprout size={24} className="text-amber-500 animate-bounce" />
                        AgriTrade<span className="text-slate-800">Hub</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-emerald-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/10">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Pitch Wrapper Section */}
            <section className="relative overflow-hidden bg-white pt-20 pb-24 border-b border-slate-100">
                <div className="max-w-5xl mx-auto text-center px-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wide border border-emerald-200">
                        <ShieldCheck size={12} /> B2B Smart Sourcing Protocol
                    </span>
                    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Direct Farm Sourcing,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Zero Middlemen Fees.</span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Connecting enterprise agricultural growers directly with digital commodities buyers. Secure binding contract deals backed by live ledger transparency.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link to="/register" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/10">
                            Register Your Account <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-bold px-6 py-3.5 rounded-xl hover:bg-slate-200 transition-all">
                            Access Portal
                        </Link>
                    </div>
                </div>
            </section>

            {/* Live Synchronized Metrics Segment */}
            <section className="py-12 bg-slate-900 text-white shadow-inner">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div className="pt-6 md:pt-0">
                        <div className="flex justify-center text-emerald-400 mb-2"><Users size={28} /></div>
                        <p className="text-3xl font-black font-mono tracking-tight">{data.metrics.active_growers}</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Verified Stakeholders</p>
                    </div>
                    <div className="pt-6 md:pt-0">
                        <div className="flex justify-center text-emerald-400 mb-2"><TrendingUp size={28} /></div>
                        <p className="text-3xl font-black font-mono tracking-tight">{data.metrics.tons_traded} MT</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Gross Metric Tonnage Traded</p>
                    </div>
                    <div className="pt-6 md:pt-0">
                        <div className="flex justify-center text-emerald-400 mb-2"><Sprout size={28} /></div>
                        <p className="text-3xl font-black font-mono tracking-tight">{data.metrics.harvests_completed}</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Crops Successfully Listed</p>
                    </div>
                </div>
            </section>

            {/* Read-Only Marketplace Preview Grid */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-12">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketplace Pulse</h2>
                        <p className="text-sm text-slate-500 mt-1">A real-time snapshot of transparent agricultural yield stocks currently listed across network hubs.</p>
                    </div>
                    <Link to="/login" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group">
                        Unlock full catalog mapping <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12 text-slate-400"><Loader2 className="animate-spin" size={28} /></div>
                ) : data.showcase.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 bg-white border border-dashed rounded-2xl">
                        No active stock aggregates available for public display right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.showcase.map((crop) => (
                            <div key={crop.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border tracking-wide ${
                                            crop.status === 'harvested' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {crop.status}
                                        </span>
                                        <span className="text-[11px] font-mono font-medium text-slate-400">BATCH #{crop.id}</span>
                                    </div>
                                    <h3 className="mt-4 font-bold text-lg text-slate-900 flex items-center gap-2">
                                        <Layers size={18} className="text-emerald-600" />
                                        {crop.crop_type}
                                    </h3>
                                    <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-slate-400" /> Hub Region: <span className="font-semibold text-slate-700 capitalize">{crop.broad_region}</span>
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400 italic">Identity encrypted</span>
                                    <Link to="/login" className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100 transition-all">
                                        <ShoppingCart size={12} /> Bid Offer
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Public Footer */}
            {/* Upgraded Professional Ecosystem Footer */}
<footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-6">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
       
        {/* Column 1: Owner Attribution & Mission */}
        <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-lg text-white tracking-tight">
                <Sprout size={20} className="text-emerald-400" />
                AgriTrade<span className="text-slate-300">Hub</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Engineered and maintained by <span className="text-emerald-400 font-semibold">Sebuuma Edrine</span>. Empowering agricultural supply chains through automated, direct-to-market trade architectures.
            </p>
        </div>

        {/* Column 2: Platform Gateways */}
        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Ecosystem Gateways</h4>
            <div className="flex flex-col gap-1.5 text-xs">
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Portal Authentication</Link>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">Join as Network Producer</Link>
                <a href='tel:+256759472304' className='text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-2'>+256-759-472304</a>
            </div>
        </div>

        {/* Column 3: Live Environment Node Data */}
        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Parameters</h4>
            <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-slate-300">Environment: Production Node Alpha</span>
                </div>
                <p className="text-slate-500">Core Engine: v2.4.1 (Stable)</p>
            </div>
        </div>
    </div>

    {/* Bottom Legal bar */}
    <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-slate-500">
            &copy; {new Date().getFullYear()} <span className="text-slate-400 font-semibold">Sebuuma Edrine</span>. All Rights Reserved.
        </p>
        <div className="flex gap-4 text-slate-500">
            <span className="cursor-default hover:text-slate-400 transition-colors">Privacy Charter</span>
            <span className="cursor-default hover:text-slate-400 transition-colors">Contract Terms</span>
        </div>
    </div>
</footer>
        </div>
    );
};

export default LandingPage;
