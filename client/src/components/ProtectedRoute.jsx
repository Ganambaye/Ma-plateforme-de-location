import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly, etudiantOnly, bailleurOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className='flex items-center justify-center min-h-screen'><p>Chargement...</p></div>;
  if (!user) return <Navigate to='/connexion' replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to='/' replace />;
  if (etudiantOnly && user.role !== 'etudiant') return <Navigate to='/' replace />;
  if (bailleurOnly && user.role !== 'bailleur') return <Navigate to='/' replace />;
  return children;
}

export default ProtectedRoute;
