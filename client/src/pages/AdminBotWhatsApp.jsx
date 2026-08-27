import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminBotWhatsApp() {
  const [logs, setLogs] = useState([]);
  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncEnCours, setSyncEnCours] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsRes, catRes] = await Promise.all([
        api.get('/whatsapp/logs').catch(() => ({ data: [] })),
        api.get('/whatsapp/annonces-verifiees').catch(() => ({ data: null })),
      ]);
      setLogs(logsRes.data);
      setCatalogue(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const syncCatalogue = async () => {
    setSyncEnCours(true);
    try {
      await api.post('/whatsapp/sync-catalogue');
      alert('Synchronisation du catalogue lancée (simulée)');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la synchronisation');
    } finally {
      setSyncEnCours(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-400'>Chargement du panneau de contrôle...</p>
        </div>
      </div>
    );
  }

  const statsAnnonces = catalogue?.stats || { disponibles: 0, reservees: 0, total: 0 };
  const derniereMaj = catalogue?.derniereMiseAJour || catalogue?.updatedAt;

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-white mb-2'>Panneau de contrôle - Bot WhatsApp</h1>
          <p className='text-gray-400'>Synchronisation et supervision du bot TANAL SA LOGEMENT</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
          <div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className='text-gray-400 text-sm font-medium'>Annonces disponibles</p>
                <p className='text-3xl font-bold text-white'>{statsAnnonces.disponibles}</p>
              </div>
            </div>
          </div>
          <div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className='text-gray-400 text-sm font-medium'>Annonces réservées</p>
                <p className='text-3xl font-bold text-white'>{statsAnnonces.reservees}</p>
              </div>
            </div>
          </div>
          <div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className='text-gray-400 text-sm font-medium'>Total annonces</p>
                <p className='text-3xl font-bold text-white'>{statsAnnonces.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-10'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-white'>Catalogue actuel</h2>
              <p className='text-gray-400 text-sm mt-1'>
                Dernière mise à jour : {derniereMaj ? new Date(derniereMaj).toLocaleString('fr-FR') : 'N/A'}
              </p>
            </div>
            <button
              onClick={syncCatalogue}
              disabled={syncEnCours}
              className='bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition inline-flex items-center gap-2'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {syncEnCours ? 'Synchronisation...' : 'Forcer la mise à jour du catalogue web vers WhatsApp'}
            </button>
          </div>
          {catalogue?.annonces && (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Titre</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Type</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Prix</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Quartier</th>
                  </tr>
                </thead>
                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                  {catalogue.annonces.slice(0, 10).map((a) => (
                    <tr key={a._id} className='hover:bg-gray-700 transition'>
                      <td className='px-6 py-4 text-sm text-gray-200 font-medium'>{a.titre}</td>
                      <td className='px-6 py-4 text-sm text-gray-400 capitalize'>{a.type}</td>
                      <td className='px-6 py-4 text-sm text-gray-400'>{(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                      <td className='px-6 py-4 text-sm text-gray-400'>{a.quartier}</td>
                    </tr>
                  ))}
                  {catalogue.annonces.length > 10 && (
                    <tr>
                      <td colSpan={4} className='px-6 py-4 text-center text-gray-400 text-sm'>
                        +{catalogue.annonces.length - 10} autres annonces
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='bg-gray-800 rounded-2xl shadow-lg border border-gray-700'>
          <div className='px-6 py-5 border-b border-gray-700'>
            <h2 className='text-xl font-bold text-white'>Journaux du bot (logs)</h2>
            <p className='text-gray-400 text-sm mt-1'>Historique des activités du bot WhatsApp</p>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-700'>
              <thead className='bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Niveau</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Message</th>
                </tr>
              </thead>
              <tbody className='bg-gray-800 divide-y divide-gray-700'>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='px-6 py-12 text-center text-gray-500'>
                      Aucun log pour le moment
                    </td>
                  </tr>
                ) : logs.map((log, i) => (
                  <tr key={i} className='hover:bg-gray-700 transition'>
                    <td className='px-6 py-4 text-sm text-gray-400'>{new Date(log.date).toLocaleString('fr-FR')}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${log.niveau === 'error' ? 'bg-red-100 text-red-800' : log.niveau === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {log.niveau || 'info'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-300'>{log.message}</td>
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

export default AdminBotWhatsApp;

