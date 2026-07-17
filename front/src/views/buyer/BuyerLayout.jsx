import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShoppingBag, History, LogOut } from 'lucide-react';

const BuyerLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
                <div>
                    <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800 font-bold text-xl text-sky-400 tracking-wide">
                        🛒 AgriTrade Hub
                    </div>
                    <nav className="mt-6 px-3 space-y-1">
                        <Link
                            to="/buyer"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                location.pathname === '/buyer'
                                ? 'bg-sky-500 text-slate-950 font-semibold shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <ShoppingBag size={20} />
                            Marketplace Bazaars
                        </Link>
                        <Link
                            to="/buyer/orders"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                location.pathname === '/buyer/orders'
                                ? 'bg-sky-500 text-slate-950 font-semibold shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <History size={20} />
                            My Orders & Offers
                        </Link>
                    </nav>
                </div>

                {/* Profile Footer */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
                    <div>
                        <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                        <p className="text-xs text-sky-400 font-mono capitalize">{user?.role} Portal</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2 rounded-md transition-colors" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Workspace */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-semibold text-slate-800">B2B Sourcing Network</h1>
                    <span className="text-xs font-semibold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">Verified Contracts</span>
                </header>

                <div className="p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default BuyerLayout;