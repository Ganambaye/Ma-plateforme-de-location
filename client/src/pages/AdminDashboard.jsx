import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', etablissement: '' });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [pubStats, setPubStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, annoncesRes, pubStatsRes] = await Promise.all([
          adminService.getStats().catch(() => ({ data: null })),
          adminService.getAnnonces().catch(() => ({ data: [] })),
          adminService.getPublicationStats().catch(() => ({ data: {} })),
        ]);
        setStats(statsRes?.data || null);
        setAnnonces((annoncesRes?.data || []).slice(0, 10));
        setPubStats(pubStatsRes?.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMessage('');
    setAdminError('');
    try {
      await adminService.createUser({ ...adminForm, role: 'admin' });
      setAdminMessage('Admin créé avec succès');
      setAdminForm({ nom: '', prenom: '', email: '', telephone: '', password: '', etablissement: '' });
      setShowAddAdmin(false);
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-500'>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Inscrits', value: (stats?.totalEtudiants ?? 0) + (stats?.totalBailleurs ?? 0), color: 'bg-blue-500', to: '#', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Étudiants', value: stats?.totalEtudiants ?? 0, color: 'bg-green-500', to: '#', icon: 'M12 14l9-5-9-5-9 5 9 5z' },
    { label: 'Bailleurs', value: stats?.totalBailleurs ?? 0, color: 'bg-yellow-500', to: '#', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Total annonces', value: stats?.totalAnnonces ?? 0, color: 'bg-primary', to: '/annonces', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Disponibles', value: stats?.annoncesActives ?? 0, color: 'bg-green-500', to: '/annonces', icon: 'M5 13l4 4L19 7' },
    { label: 'Réservées', value: stats?.annoncesReservees ?? 0, color: 'bg-accent', to: '#', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { label: 'En attente', value: stats?.annoncesEnAttente ?? 0, color: 'bg-accent', to: '/admin/annonces/en-attente', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Visites en attente', value: stats?.visitesEnAttente ?? 0, color: 'bg-yellow-500', to: '/admin/visites', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Tableau de bord</h1>
           <p className='text-gray-600'>Vue d'ensemble de votre plateforme TANAL SA LOGEMENT</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          {statCards.map((c, i) => (
            <Link
              key={c.label}
              to={c.to}
              className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group animate-fade-in-up'
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-white`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                  </svg>
                </div>
              </div>
              <h3 className='text-gray-600 text-sm font-medium mb-1'>{c.label}</h3>
              <p className='text-3xl font-bold text-gray-800'>{c.value}</p>
            </Link>
          ))}
          {pubStats && (
            <>
              <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 animate-fade-in-up'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white'>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className='text-gray-600 text-sm font-medium mb-1'>Boosts vendus</h3>
                <p className='text-3xl font-bold text-gray-800'>{pubStats.totalPublications || 0}</p>
              </div>
              <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 animate-fade-in-up'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white'>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className='text-gray-600 text-sm font-medium mb-1'>Revenus publications</h3>
                <p className='text-3xl font-bold text-gray-800'>{(pubStats.revenusPublications || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className='flex flex-wrap gap-4 mb-8 animate-fade-in-up animation-delay-400'>
          <Link to='/admin/visites' className='btn-accent inline-flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gérer les visites
          </Link>
          <Link to='/admin/annonces/ajouter' className='btn-primary inline-flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une annonce
          </Link>
          <Link to='/admin/annonces/en-attente' className='bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-yellow-600 transition'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Annonces en attente
          </Link>
          <button onClick={() => setShowAddAdmin(!showAddAdmin)} className='bg-purple-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-purple-600 transition'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showAddAdmin ? 'Annuler' : 'Ajouter un admin'}
          </button>
          <Link to='/admin/users' className='bg-purple-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-purple-600 transition'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gérer les utilisateurs
          </Link>
          <Link to='/admin/quartiers' className='bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-emerald-600 transition'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
            </svg>
            Gérer les quartiers
          </Link>
        </div>

        {/* Add Admin Section */}
        {showAddAdmin && (
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-fade-in-up'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Ajouter un administrateur</h2>
            {adminMessage && (
              <div className='bg-green-50 text-green-600 p-4 rounded-xl mb-4 flex items-center gap-2'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {adminMessage}
              </div>
            )}
            {adminError && (
              <div className='bg-red-50 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {adminError}
              </div>
            )}
            <form onSubmit={handleCreateAdmin} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Nom</label>
                <input type='text' name='nom' value={adminForm.nom} onChange={(e) => setAdminForm({ ...adminForm, nom: e.target.value })} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Prénom</label>
                <input type='text' name='prenom' value={adminForm.prenom} onChange={(e) => setAdminForm({ ...adminForm, prenom: e.target.value })} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                <input type='email' name='email' value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Téléphone</label>
                <input type='tel' name='telephone' value={adminForm.telephone} onChange={(e) => setAdminForm({ ...adminForm, telephone: e.target.value })} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Mot de passe</label>
                <div className='input-group'>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    name='password'
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className='input-field'
                    required
                    minLength={6}
                  />
                  <button
                    type='button'
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className='password-toggle'
                    aria-label={showAdminPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showAdminPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Établissement</label>
                <input type='text' name='etablissement' value={adminForm.etablissement} onChange={(e) => setAdminForm({ ...adminForm, etablissement: e.target.value })} className='input-field' />
              </div>
              <div className='md:col-span-2'>
                <button type='submit' className='btn-primary'>Créer l'administrateur</button>
              </div>
            </form>
          </div>
        )}

        {/* Latest Annonces Table */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in-up animation-delay-400'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Dernières annonces</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Titre</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quartier</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Prix</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Statut</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Disponibilité</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {annonces.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-8 text-center text-gray-500'>
                      <div className='inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3'>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      Aucune annonce pour le moment
                    </td>
                  </tr>
                ) : annonces.map((a) => (
                  <tr key={a._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-800'>{a.titre}</td>
                    <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{a.type}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{a.quartier}</td>
                     <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {a.isVerified ? 'Vérifié' : 'En attente'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {a.isAvailable ? 'Disponible' : 'Réservée'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <Link to={'/admin/annonces/modifier/' + a._id} className='text-primary hover:text-blue-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </Link>
                        <button onClick={() => { if (window.confirm('Supprimer cette annonce ?')) { adminService.deleteAnnonce(a._id).then(() => setAnnonces(annonces.filter((x) => x._id !== a._id))); } }} className='text-red-600 hover:text-red-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
