import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import BuyerLayout from './BuyerLayout.jsx';
import OfferModal from './OfferModal.jsx'; // 👈 Import our new modal component
import { Search, MapPin, Tag, User, ShoppingCart, RefreshCw, CheckCircle } from 'lucide-react';
import FarmerProfileModal from './FarmerProfileModal.jsx';
import api from '../../api.js';

const BuyerDashboard = () => {
    const { token } = useAuth();
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successBanner, setSuccessBanner] = useState('');

    // Modal Control States
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFarmerId, setActiveFarmerId] = useState(null);

    const fetchMarketplace = async () => {
        setLoading(true);
        try {
            const response = await api.get('/crop/marketplace', );
            const data = await response.data;
            if (!response.status === 200) throw new Error(data.message || 'Market data download error.');
            setListings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    console.log(listings);
    

    useEffect(() => { fetchMarketplace(); }, []);

    const filteredListings = listings.filter(item =>
        item.crop_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ─── TRIGGERS OVERLAY VISIBILITY ─────────────────────────────────
    const handleOrderIntent = (crop) => {
        setSelectedCrop(crop);
        setIsModalOpen(true);
    };

    // ─── FIRES UPON SUCCESSFUL SUBMISSION FROM MODAL CHILD ───────────
    const handleOfferSuccess = () => {
        setSuccessBanner('Contract deal proposal broadcasted to the farmer node successfully.');
        setTimeout(() => setSuccessBanner(''), 5000); // Clears banner after 5s
    };

    return (
        <BuyerLayout>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Available Crop Stocks</h2>
                    <p className="text-sm text-slate-500 mt-1">Direct source wholesale listings updated live from synchronized grower fields.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by variety or region..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border text-sm rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>
                    <button onClick={fetchMarketplace} className="p-2 bg-white rounded-lg border hover:bg-slate-50 text-slate-600">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {successBanner && (
                <div className="p-4 mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
                    <CheckCircle size={18} className="text-emerald-600" />
                    {successBanner}
                </div>
            )}

            {error && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl">{error}</div>}

            {loading ? (
                <div className="text-center text-slate-400 py-12">Querying active wholesale aggregates...</div>
            ) : filteredListings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed rounded-xl bg-white">
                    No active agricultural yields match your text criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((crop) => (
                        <div key={crop.id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                        crop.status === 'harvested' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                        {crop.status}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">ID: #{crop.id}</span>
                                </div>
                               
                                <h3 className="text-lg font-bold text-slate-900 mt-3 flex items-center gap-2">
                                    <Tag className="text-sky-600" size={18} />
                                    {crop.crop_type}
                                </h3>

                                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t pt-3">
                                    <p className="flex items-center gap-2"><User size={14} className="text-slate-400" /> Producer: <span onClick={() => setActiveFarmerId(crop.farmer_id)} className="text-emerald-600 font-semibold hover:underline text-sm">{crop.farmer_name}</span></p>
                                    <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> Hub origin: <span>{crop.location} ({crop.field_name})</span></p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border-t p-4 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">Planted: {new Date(crop.planted_at).toLocaleDateString()}</span>
                                <button
                                    onClick={() => handleOrderIntent(crop)} // Pass the whole crop object context
                                    className="inline-flex items-center gap-1.5 bg-sky-600 text-white font-semibold text-xs px-3 py-2 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
                                >
                                    <ShoppingCart size={14} />
                                    Propose Deal
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── MODAL INJECTION ────────────────────────────────────────── */}
            <OfferModal
                crop={selectedCrop}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleOfferSuccess}
            />
            {activeFarmerId && <FarmerProfileModal
                userId={activeFarmerId}
                token={token}
                onClose={()=> setActiveFarmerId(null)}
            />}
        </BuyerLayout>
    );
};

export default BuyerDashboard;