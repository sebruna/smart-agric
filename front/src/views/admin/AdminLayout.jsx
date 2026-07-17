import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, Users, Sprout, ShieldAlert, LogOut, Settings } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Monitor Fields', path: '/admin/fields', icon: <Sprout size={20} /> },
        { name: 'System Logs', path: '/admin/logs', icon: <ShieldAlert size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
                <div>
                    <div className="h-16 flex items-center justify-center border-b border-gray-800 font-bold text-xl text-emerald-400 tracking-wide">
                        🌱 AgriAdmin
                    </div>
                    <nav className="mt-6 px-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-emerald-400 transition-colors"
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom User Profile Section */}
                <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-200">{user?.name}</p>
                        <p className="text-xs text-emerald-400 capitalize">{user?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-400 p-2 rounded-md transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-semibold text-gray-800">Admin Control Center</h1>
                    <span className="text-sm text-gray-500">System Live</span>
                </header>

                {/* Dashboard Main Content Container */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;