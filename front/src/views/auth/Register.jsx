import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, User, Mail, Lock, ShieldAlert, Tractor, ShoppingBag, Loader2 } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer' // Default role selection
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectRole = (roleType) => {
        setFormData({ ...formData, role: roleType });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');

            // Success -> Forward straight to the login route with a clear dashboard signal
            navigate('/login', { state: { successMessage: 'Profile established! You can now authenticate with your credentials.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-2 font-black text-2xl text-emerald-600 tracking-tight">
                    <Sprout size={28} className="text-emerald-500" />
                    AgriTrade<span className="text-slate-800">Hub</span>
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Establish Your Account Profile</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Already a network participant?{' '}
                    <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                        Sign In Here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
                            <ShieldAlert size={14} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 1. Account Role Matrix Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Select Your Network Profile Node Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => selectRole('buyer')}
                                    className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1.5 ${
                                        formData.role === 'buyer'
                                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    <ShoppingBag size={18} className={formData.role === 'buyer' ? 'text-emerald-600' : 'text-slate-400'} />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">B2B Buyer Account</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Source wholesale contracts</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectRole('farmer')}
                                    className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1.5 ${
                                        formData.role === 'farmer'
                                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    <Tractor size={18} className={formData.role === 'farmer' ? 'text-emerald-600' : 'text-slate-400'} />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Producer / Farmer</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">List active crop field assets</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* 2. Legal Full Name Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name / Corporate Entity Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={16} /></div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 pl-9 p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="e.g. John Doe Farms"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3. Electronic Mail Address Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={16} /></div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 pl-9 p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* 4. Password Credential Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Account Security Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={16} /></div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 pl-9 p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* 5. Trigger Execution Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-60"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;