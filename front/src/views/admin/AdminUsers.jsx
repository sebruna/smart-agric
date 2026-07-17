import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { ShieldCheck, UserCheck, RefreshCw, Mail, Calendar } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/user/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
           
            if (!response.ok) throw new Error(data.message || 'Failed to sync users.');
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModifyRole = async (userId, updatedRole) => {
        try {
            const response = await fetch(`http://localhost:4000/api/user/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: updatedRole })
            });
        
            if (response.ok) {
                // Dynamically refresh data grid profiles locally
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSuspend = async (userId) => {
        if (!window.confirm("Are you sure you want to suspend this account?")) return;
        
        try {
            const response = await fetch(`http://localhost:4000/api/user/remove/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        
            if (response.ok) {
                // Instantly remove the deleted user from your screen state layout
                setUsers(users.filter(user => user.id !== userId));
            }
        } catch (err) {
            alert("Failed to suspend user: " + err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'farmer': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'buyer': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <AdminLayout>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Ecosystem User Directories</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage global permissions, roles, and review authentication accounts active within the platform.
                    </p>
                </div>
                <div className="mt-4 sm:ml-4 sm:mt-0">
                    <button
                        onClick={fetchUsers}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Registries
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Analyzing directory data blocks...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Account User</th>
                                    <th className="px-6 py-4">Email Channel</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4">Privilege Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-700">
                                {users.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-gray-100 p-2 text-gray-600">
                                                    {account.role === 'admin' ? <ShieldCheck size={18} className="text-purple-600" /> : <UserCheck size={18} />}
                                                </div>
                                                <div>
                                                    <span className="block font-semibold">{account.name}</span>
                                                    <span className="text-xs text-gray-400">UID: #{account.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} className="text-gray-400" />
                                                {account.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(account.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${getRoleBadgeStyle(account.role)}`}>
                                                {account.role}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold">
                                            <button onClick={() => handleSuspend(account.id)} className="text-gray-400 hover:text-red-600 mr-3 transition-colors">Suspend</button>
                                            <button onClick={() => handleModifyRole(account.id, )} className="text-emerald-600 hover:text-emerald-900 hover:underline transition-all">Modify</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;