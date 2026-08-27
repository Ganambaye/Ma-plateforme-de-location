import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_CONFIG = {
  en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'En attente' },
  confirmee: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Confirmée' },
  effectuee: { bg: 'bg-blue-100', text: 'bg-blue-800', dot: 'bg-blue-500', label: 'Effectuée' },
  rejetee: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rejetée' },
};

function MesBiens() {
  const { user } = useAuth();
  const [biens, setBiens] = useState([]);
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [annoncesRes, visitesRes] = await Promise.all([
        api.get('/annonces').catch(() => ({ data: [] })),
        api.get('/visites/mes-annonces').catch(() => ({ data: [] })),
      ]);

      const mesAnnonces = annoncesRes.data.filter(
        (a) => a.bailleur?._id === user?.id || a.bailleur === user?.id
      );
      setBiens(mesAnnonces);

      const mesVisites = visitesRes.data.filter(
        (v) =>
          v.annonce &&
          mesAnnonces.some((a) => a._id === (v.annonce._id || v.annonceId))
      );
      setVisites(mesVisites);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.put('/annonces/' + id, { isAvailable: !currentStatus });
      setBiens((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isAvailable: !currentStatus } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusConfig = (statut) => STATUS_CONFIG[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', label: statut };

  const getVisitsByDate = () => {
    const byDate = {};
    visites.forEach((v) => {
      const date = new Date(v.dateVisite);
      const day = date.getDate();
      const month = date.getMonth();
      const key = `${month}-${day}`;
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(v);
    });
    return byDate;
  };

  const visitsByDate = getVisitsByDate();
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
  const today = new Date();

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

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in-up'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Mes biens</h1>
            <p className='text-gray-600'>Gérez tous vos logements et suivez les demandes de visite</p>
          </div>
          <Link to='/bailleur/ajouter-logement' className='btn-primary inline-flex items-center gap-2 mt-4 sm:mt-0'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un logement
          </Link>
        </div>

        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 mb-6'>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Liste de mes biens</h2>
          </div>

          {biens.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p>Aucun bien enregistré</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-100'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Photo</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Titre</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Quartier</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Prix</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Statut</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {biens.map((b) => (
                    <tr key={b._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4'>
                        {b.images && b.images.length > 0 ? (
                          <img src={b.images[0]} alt={b.titre} className='w-16 h-16 rounded-xl object-cover' />
                        ) : (
                          <div className='w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center'>
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4.414-4.414a2 2 0 012.828 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-800'>
                        {b.titre}
                        {b.premium && (
                          <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800'>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Boosté
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{b.quartier}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{(b.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {b.isAvailable ? 'Disponible' : 'Réservé'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col gap-2'>
                          <button
                            onClick={() => toggleAvailability(b._id, b.isAvailable)}
                            className={`${b.isAvailable ? 'bg-accent hover:bg-red-700' : 'bg-secondary hover:bg-green-700'} text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1`}
                          >
                            {b.isAvailable ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2-2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Désactiver
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Activer
                              </>
                            )}
                          </button>
                          {!b.premium && (
                            <Link
                              to={'/bailleur/booster/' + b._id}
                              className='bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1'
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Booster
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mt-8 animate-fade-in-up animation-delay-300'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Calendrier des demandes de visite</h2>
            <p className='text-sm text-gray-600 mt-1'>{visites.length} demande{visites.length > 1 ? 's' : ''} de visite{visites.length > 1 ? 's' : ''}</p>
          </div>

          {visites.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Aucune visite programmée</p>
            </div>
          ) : (
            <div className='p-6'>
              <div className='grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 mb-2'>
                <div>Dim</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mer</div>
                <div>Jeu</div>
                <div>Ven</div>
                <div>Sam</div>
              </div>

              <div className='grid grid-cols-7 gap-2'>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateKey = `${currentMonth}-${dayNum}`;
                  const dayVisits = visitsByDate[dateKey] || [];
                  const dayObj = new Date();
                  dayObj.setDate(dayNum);
                  const dayOfWeek = (dayObj.getDay() + 6) % 7;

                  return (
                    <div
                      key={i}
                      className={`min-h-[60px] p-1 border border-gray-100 rounded-lg relative ${
                        dayNum === today.getDate() ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <span className='text-xs text-gray-500 absolute top-1 right-1'>{dayNum}</span>
                      <div className='flex flex-col gap-0.5 mt-5'>
                        {dayVisits.map((v) => (
                          <div
                            key={v._id}
                            className={`text-xs p-1 rounded truncate ${getStatusConfig(v.statut).bg} ${getStatusConfig(v.statut).text} font-medium`}
                            title={v.etudiant ? `${v.etudiant.prenom} ${v.etudiant.nom}` : 'Visite'}
                          >
                            {v.etudiant ? v.etudiant.prenom + ' ' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='mt-6 space-y-3'>
                {visites.map((v) => {
                  const status = getStatusConfig(v.statut);
                  return (
                    <div key={v._id} className='border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-gray-50'>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-800'>
                          {v.annonce ? v.annonce.titre : 'Annonce #' + v.annonceId}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {v.etudiant ? `${v.etudiant.prenom} ${v.etudiant.nom}` : 'Étudiant'}
                          {' — '}
                          {new Date(v.dateVisite).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MesBiens;

