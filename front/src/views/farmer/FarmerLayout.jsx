import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, Tractor, Shovel, LogOut, ListOrdered, User } from 'lucide-react';

const FarmerLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Overview', path: '/farmer', icon: <LayoutDashboard size={20} /> },
        { name: 'My Fields', path: '/farmer/fields', icon: <Tractor size={20} /> },
        { name: 'Crop Batches', path: '/farmer/crops', icon: <Shovel size={20} /> },
        { name: 'Contract Proposals', path: '/farmer/orders', icon: <ListOrdered size={20} /> },
        { name: 'Profile and Hub Settings', path: '/farmer/profile', icon: <User size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-stone-50">
            {/* Farmer Sidebar */}
            <aside className="w-64 bg-emerald-900 text-white flex flex-col justify-between shadow-lg">
                <div>
                    <div className="h-16 flex items-center gap-2 px-6 border-b border-emerald-800 font-bold text-xl text-amber-400 tracking-wide">
                        🚜 GreenFarm Node
                    </div>
                    <nav className="mt-6 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                        isActive
                                        ? 'bg-amber-500 text-emerald-950 font-semibold shadow-md'
                                        : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Farmer Profile Footer */}
                <div className="p-4 border-t border-emerald-800 flex items-center justify-between bg-emerald-950/40">
                    <div>
                        <p className="text-sm font-medium text-emerald-50">{user?.name}</p>
                        <p className="text-xs text-amber-400 font-mono">Operator ##{user?.id}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-emerald-300 hover:text-amber-400 p-2 rounded-md transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content Workspace */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Global Farm Area Header Banner */}
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-semibold text-stone-800">Farm Management System</h1>
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Live Operation Mode</span>
                    </div>
                </header>

                {/* Embedded Content Outlet Wrapper */}
                <div className="p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default FarmerLayout;