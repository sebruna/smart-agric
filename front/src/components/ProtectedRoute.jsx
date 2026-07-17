import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // 1. If not logged in, boot back to login screen
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If logged in but role isn't explicitly permitted for this view
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Permitted access: render the target dashboard
    return children;
};

export default ProtectedRoute;