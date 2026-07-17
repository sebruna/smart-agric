import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import FarmerLayout from './FarmerLayout.jsx';
import { Tractor, Phone, MapPin, AlignLeft, Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const FarmerProfile = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: '', isError: false });
   
    const [formData, setFormData] = useState({
        farm_name: '',
        contact_phone: '',
        shipping_hub: '',
        bio: ''
    });
   
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Fetch operational profile specifications
    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/farmer/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to pull profile metrics.');
           
            setFormData({
                farm_name: data.farm_name || '',
                contact_phone: data.contact_phone || '',
                shipping_hub: data.shipping_hub || 'Central Logistics Node',
                bio: data.bio || ''
            });
           
            if (data.profile_pic) {
                setProfilePicUrl(`http://localhost:4000${data.profile_pic}`);
            }
        } catch (err) {
            setMsg({ text: err.message, isError: true });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Local Image File Choices & Generation of Preview Object URLs
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
       
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Temporary preview image link
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ text: '', isError: false });

        // Pack values into FormData object array matrices
        const dataPayload = new FormData();
        dataPayload.append('farm_name', formData.farm_name);
        dataPayload.append('contact_phone', formData.contact_phone);
        dataPayload.append('shipping_hub', formData.shipping_hub);
        dataPayload.append('bio', formData.bio);
       
        if (selectedFile) {
            dataPayload.append('profilePicFile', selectedFile);
        }

        try {
            const response = await fetch('http://localhost:4000/api/farmer/add', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }, // Do NOT include content-type header for FormData!
                body: dataPayload
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to preserve profile.');

            setMsg({ text: 'Logistical profile properties successfully written!', isError: false });
           
            // Sync up internal view profile structures with backend's returned file pointer URL string
            if (result.profile_pic) {
                setProfilePicUrl(`http://localhost:4000${result.profile_pic}`);
                setSelectedFile(null);
                setPreviewUrl('');
            }
        } catch (err) {
            setMsg({ text: err.message, isError: true });
        } finally {
            setSaving(false);
        }
    };

    return (
        <FarmerLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Hub Node Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure your outward brand details, logistics hubs, and operational point-of-contacts.</p>
            </div>

            {msg.text && (
                <div className={`p-4 mb-6 text-sm border rounded-xl flex items-center gap-2 font-medium ${
                    msg.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                    {msg.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    {msg.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl">
                {loading ? (
                    <div className="p-12 text-center text-sm text-gray-400">Loading configurations...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                       
                        {/* PROFILE COMPONENT HEADER METRICS AND PIC SELECTOR */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                            <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Tractor size={32} className="text-gray-400" />
                                )}
                               
                                <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold uppercase tracking-wider">
                                    <Camera size={16} />
                                    <span>Upload</span>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="font-bold text-lg text-gray-900">{formData.farm_name || 'Unconfigured Node Entity'}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Physical Region: <span className="text-gray-600 font-semibold">{formData.shipping_hub}</span></p>
                                {previewUrl && <p className="text-[10px] font-bold text-amber-600 mt-1 animate-pulse">Save modifications to lock photo</p>}
                            </div>
                        </div>

                        {/* REGULAR ATTRIBUTE FORM GRIDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Tractor size={12} /> Farm / Business Entity Name</label>
                                <input
                                    type="text"
                                    name="farm_name"
                                    value={formData.farm_name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="e.g. Greenwood Orchards"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Phone size={12} /> Direct Contact Phone Line</label>
                                <input
                                    type="text"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="+1 (555) 019-2834"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin size={12} /> Logistical Hub Distribution Node Location</label>
                            <input
                                type="text"
                                name="shipping_hub"
                                value={formData.shipping_hub}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                placeholder="e.g. Northern Freight Hub Depot"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><AlignLeft size={12} /> Public Bio & Crop Quality Description</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none font-sans"
                                placeholder="Describe your farm's scale, specialized crop certifications, or preferred logistics rules..."
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-60"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={16} /> : 'Save Profile Properties'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </FarmerLayout>
    );
};

export default FarmerProfile;