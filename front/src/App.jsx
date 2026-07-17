import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './views/admin/AdminLayout.jsx';
import AdminFields from './views/admin/AdminFields.jsx';
import FarmerLayout from './views/farmer/FarmerLayout.jsx';
import FarmerFields from './views/farmer/FarmerFields.jsx';
import FarmerCrops from './views/farmer/FarmerCrops.jsx';
import AdminUsers from './views/admin/AdminUsers.jsx';
import AdminDashboard from './views/admin/AdminDashboard.jsx';
import BuyerDashboard from './views/buyer/BuyerDashboard.jsx';
import BuyerOrders from './views/buyer/BuyerOrders.jsx';
import FarmerOrders from './views/farmer/FarmerOrders.jsx';
import SystemLogs from './views/admin/SystemLogs.jsx';
import LandingPage from './views/public/LandingPage.jsx';
import Register from './views/auth/Register.jsx';
import FarmerProfile from './views/farmer/FarmerProfile.jsx';
import AdminSettings from './views/admin/AdminSettings.jsx';

// Placeholder view imports (We will build these actual screens next)
import Login from './views/auth/Login.jsx';
const Unauthorized = () => <div className="p-8 text-red-500"><h1>🚫 Access Denied</h1></div>;

// Update or declare this block inside your App.jsx
const FarmerDashboard = () => {
  return (
    <FarmerLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Welcome Back, Operational Node Overview</h2>
        <p className="text-sm text-stone-500 mt-1">Here is the active state summary across your allocated agricultural fields.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">My Operational Land</h3>
          <p className="text-4xl font-extrabold text-stone-800 mt-2">4 Plots</p>
          <span className="text-xs font-semibold text-emerald-600 mt-2 block">Active & Tracked</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Current Yield Strains</h3>
          <p className="text-4xl font-extrabold text-stone-800 mt-2">2 Batches</p>
          <span className="text-xs font-semibold text-amber-600 mt-2 block">1 Planted • 1 Growing</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 bg-gradient-to-br from-emerald-50 to-stone-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Telemetry Expansion Space</h3>
          <p className="text-lg font-bold text-emerald-950 mt-3">Smart Sensors Gateway</p>
          <span className="inline-block mt-2 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Ready For Hardware Integration Later
          </span>
        </div>
      </div>
    </FarmerLayout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Secure Admin Route */}
        <Route
          path="/admin/fields"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFields />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        // Append this route inside your App.jsx layout router matrix:
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Secure Farmer Route */}
        <Route
          path="/farmer/*"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Global Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* Secure Farmer Routes */}
        // Replace the older path="/farmer/fields" entry configuration inside App.jsx:
        <Route
          path="/farmer/fields"
          element = {
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerFields />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/fields"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerLayout><div className="p-4 bg-white rounded-lg border">Fields view layout coming next...</div></FarmerLayout>
            </ProtectedRoute>
          }
        />

        // Update this route block configuration inside your entry file:
        <Route
          path="/farmer/crops"
          element = {
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerCrops />
            </ProtectedRoute>
          }
        />

        // Append this route next to your main farmer sub-routes inside your router grid:
        <Route
          path="/farmer/orders"
          入
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerOrders />
            </ProtectedRoute>
          }
        />

        // Append this route alongside your existing farmer routes:
        <Route
          path="/farmer/profile"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerProfile />
            </ProtectedRoute>
          }
        />

        // Append this route to your App() router system list:
        <Route
          path="/buyer"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        // Append this route next to your main buyer route definition:
        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerOrders />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;