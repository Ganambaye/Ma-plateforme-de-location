import { useState, useEffect } from 'react';
import { visiteService } from '../services/visiteService';
import { Link } from 'react-router-dom';

function MesVisites() {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);

  const cancelVisite = async (id) => {
    if (!window.confirm('Voulez-vous annuler cette demande de visite ?')) return;
    try {
      await visiteService.cancel(id);
      setVisites(prev => prev.map(v => v._id === id ? { ...v, statut: 'rejetee' } : v));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await visiteService.getMyVisites();
        setVisites(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusConfig = (statut) => {
    const configs = {
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'En attente', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      confirmee: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Confirmée', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      effectuee: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Effectuée', icon: 'M5 13l4 4L19 7' },
      rejetee: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rejetée', icon: 'M6 18L18 6M6 6l12 12' },
    };
    return configs[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', label: statut, icon: '' };
  };

  const getStatusStep = (statut) => {
    switch (statut) {
      case 'en_attente': return 1;
      case 'confirmee': return 2;
      case 'effectuee': return 3;
      case 'rejetee': return 0;
      default: return 1;
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

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Mes visites</h1>
          <p className='text-gray-600'>Suivez toutes vos demandes de visite</p>
        </div>

        {visites.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100 animate-fade-in-up'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-primary rounded-full mb-4'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>Aucune visite demandée</h3>
            <p className='text-gray-600 mb-6'>Parcourez nos annonces et réservez une visite</p>
            <Link to='/annonces' className='btn-primary inline-flex items-center gap-2'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Voir les annonces
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {visites.map((v) => {
              const status = getStatusConfig(v.statut);
              const step = v.statut === 'rejetee' ? 0 : (v.statut === 'en_attente' ? 1 : v.statut === 'confirmee' ? 2 : 3);
              return (
                <div key={v._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up'>
                  <div className='p-6'>
                    <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
                      <div className='flex items-center gap-4'>
                        {v.annonce && v.annonce.images && v.annonce.images.length > 0 ? (
                          <img src={v.annonce.images[0]} alt={v.annonce.titre} className='w-16 h-16 rounded-xl object-cover' />
                        ) : (
                          <div className='w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center'>
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <h3 className='text-lg font-semibold text-gray-800'>
                            {v.annonce ? <Link to={'/annonces/' + v.annonce._id} className='hover:text-primary transition'>{v.annonce.titre}</Link> : 'Annonce #' + v.annonceId}
                          </h3>
                          <p className='text-sm text-gray-600'>{new Date(v.dateVisite).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className='relative flex items-center justify-between pt-4'>
                      <div className='absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -translate-y-1/2'></div>
                      <div className='absolute top-1/2 left-0 h-1 bg-primary rounded-full -translate-y-1/2' style={{ width: step === 0 ? '0%' : step === 1 ? '33%' : step === 2 ? '66%' : step === 3 ? '100%' : '0%' }}></div>

                      {[
                        { label: 'En attente', step: 1 },
                        { label: 'Confirmée', step: 2 },
                        { label: 'Effectuée', step: 3 },
                      ].map((s) => {
                        const isActive = step >= s.step;
                        const isCurrent = step === s.step;
                        return (
                          <div key={s.label} className='relative flex flex-col items-center gap-1'>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                                isActive ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-200'
                              }`}
                            >
                              {isCurrent ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                s.step
                              )}
                            </div>
                            <span className={`text-xs ${isActive ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>

                     {v.statut === 'rejetee' && (
                       <div className='mt-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2'>
                         <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         Cette demande de visite a été rejetée.
                       </div>
                     )}
                     {v.statut === 'en_attente' && (
                       <div className='mt-4'>
                         <button onClick={() => cancelVisite(v._id)} className='bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-1'>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                           Annuler la demande
                         </button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MesVisites;