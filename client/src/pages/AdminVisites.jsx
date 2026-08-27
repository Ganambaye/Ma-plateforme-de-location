import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import api from '../services/api';

function AdminVisites() {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreDate, setFiltreDate] = useState('');

  const fetchVisites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/visites/admin/visites');
      setVisites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisites();
  }, []);

  const visitesFiltrees = visites.filter((v) => {
    if (filtreStatut !== 'tous' && v.statut !== filtreStatut) return false;
    if (filtreDate) {
      const visiteDate = new Date(v.dateVisite).toISOString().split('T')[0];
      if (visiteDate !== filtreDate) return false;
    }
    return true;
  });

  const updateStatut = async (id, statut) => {
    try {
      await api.put('/visites/admin/visites/' + id + '/statut', { statut });
      fetchVisites();
    } catch (err) {
      console.error(err);
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
          <p className='text-gray-500'>Chargement...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (statut) => {
    const configs = {
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'En attente', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      confirmee: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Confirmée', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      effectuee: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Effectuée', icon: 'M5 13l4 4L19 7' },
      rejetee: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rejetée', icon: 'M6 18L18 6M6 6l12 12' },
    };
    return configs[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', label: statut, icon: '' };
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Gestion des visites</h1>
          <p className='text-gray-600'>Validez et gérez les demandes de visite</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6'>
          <div className='px-6 py-4 border-b border-gray-100'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <h2 className='text-xl font-bold text-gray-800'>Filtres</h2>
              <div className='flex gap-3'>
                <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className='input-field w-auto'>
                  <option value='tous'>Tous les statuts</option>
                  <option value='en_attente'>En attente</option>
                  <option value='confirmee'>Confirmée</option>
                  <option value='effectuee'>Effectuée</option>
                  <option value='rejetee'>Rejetée</option>
                </select>
                <input
                  type='date'
                  value={filtreDate}
                  onChange={(e) => setFiltreDate(e.target.value)}
                  className='input-field w-auto'
                  placeholder='Date de visite'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Étudiant</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Contact</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Localisation</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Annonce</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Statut</th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                  {visites.length === 0 ? (
                    <tr>
                      <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3'>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {visitesFiltrees.length === 0 && visites.length > 0 ? 'Aucune visite ne correspond aux filtres' : 'Aucune visite pour le moment'}
                      </td>
                    </tr>
                  ) : visitesFiltrees.map((v) => {
                    const status = getStatusConfig(v.statut);
                    return (
                      <tr key={v._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{v.etudiant ? v.etudiant.prenom + ' ' + v.etudiant.nom : 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{v.etudiant ? v.etudiant.telephone : 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{v.etudiant ? (v.etudiant.adresse || 'N/A') + ' - ' + (v.etudiant.pays || 'N/A') : 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{v.annonce ? v.annonce.titre : 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{new Date(v.dateVisite).toLocaleString('fr-FR')}</td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                        {v.statut === 'en_attente' && (
                          <div className='flex gap-2'>
                            <button onClick={() => updateStatut(v._id, 'confirmee')} className='bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-1'>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Valider
                            </button>
                            <button onClick={() => updateStatut(v._id, 'rejetee')} className='bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-1'>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Rejeter
                            </button>
                          </div>
                        )}
                        {v.statut === 'confirmee' && (
                          <button onClick={() => updateStatut(v._id, 'effectuee')} className='bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Marquer effectuée
                          </button>
                        )}
                        {(v.statut === 'effectuee' || v.statut === 'rejetee') && (
                          <span className='text-gray-400 text-sm'>Terminé</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminVisites;