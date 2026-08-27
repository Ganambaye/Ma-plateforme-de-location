import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TABS = [
  { id: 'en_attente', label: 'En attente' },
  { id: 'valide', label: 'Validé' },
  { id: 'contrat_signe', label: 'Contrat signé' },
];

const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave', color: 'bg-blue-500' },
  { id: 'orange', label: 'Orange Money', color: 'bg-orange-500' },
];

const MONTANT = 20000;

function MesDossiers() {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [activeTab, setActiveTab] = useState('en_attente');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paiementLoading, setPaiementLoading] = useState(false);
  const [paiementSuccess, setPaiementSuccess] = useState('');

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const [dossiersRes, paiementsRes] = await Promise.all([
        api.get('/dossiers/mes-dossiers').catch(() => ({ data: [] })),
        api.get('/paiements/mes-paiements').catch(() => ({ data: [] })),
      ]);
      setDossiers(dossiersRes.data);
      setPaiements(paiementsRes.data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, [user]);

  const handlePaiement = async (dossierId, methode) => {
    setPaiementLoading(true);
    setPaiementSuccess('');
    setError('');
    try {
      await api.post('/paiements', {
        montant: MONTANT,
        methode,
        dossierId,
      });
      setPaiementSuccess('Paiement effectué avec succès via ' + methode);
      fetchDossiers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setPaiementLoading(false);
    }
  };

  const filteredDossiers = dossiers.filter((d) => {
    const statut = d.statut || (d.valide ? 'valide' : 'en_attente');
    if (statut === 'en_attente') return activeTab === 'en_attente';
    if (statut === 'valide' || statut === 'contrat_signe')
      return activeTab === statut;
    if (statut === 'contrat signe' || statut === 'contrat signé')
      return activeTab === 'contrat_signe';
    return false;
  });

  const showPayment = (d) => {
    const statut = d.statut || (d.valide ? 'valide' : 'en_attente');
    return statut === 'valide' || statut === 'contrat_signe';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Mes dossiers</h1>
          <p className='text-gray-600'>Suivez vos dossiers de colocation et effectuez vos paiements</p>
        </div>

        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 mb-6'>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {paiementSuccess && (
          <div className='bg-green-50 text-green-600 p-4 rounded-xl text-sm flex items-center gap-2 mb-6'>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {paiementSuccess}
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-200'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <div className='flex items-center gap-4'>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setError(''); setPaiementSuccess(''); }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className='p-6'>
            {filteredDossiers.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p>Aucun dossier dans cette catégorie</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {filteredDossiers.map((d) => {
                  const statut = d.statut || (d.valide ? 'valide' : 'en_attente');
                  return (
                    <div key={d._id} className='border border-gray-100 rounded-xl p-6 bg-gray-50'>
                      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4'>
                        <div className='flex items-start gap-4'>
                          {d.annonce && d.annonce.images && d.annonce.images.length > 0 ? (
                            <img src={d.annonce.images[0]} alt={d.annonce.titre} className='w-20 h-20 rounded-xl object-cover' />
                          ) : (
                            <div className='w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center'>
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4.414-4.414a2 2 0 012.828 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
                              {d.annonce ? d.annonce.titre : 'Annonce #' + d.annonceId}
                            </h3>
                            <p className='text-sm text-gray-600 mb-2'>
                              {d.annonce ? d.annonce.quartier : 'Quartier inconnu'} · {(d.annonce?.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois
                            </p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              statut === 'en_attente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : statut === 'valide'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {statut === 'en_attente'
                                ? 'En attente'
                                : statut === 'valide'
                                ? 'Validé'
                                : 'Contrat signé'}
                            </span>
                            <p className='text-xs text-gray-400 mt-2'>
                              Déposé le {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        {d.annonce && (
                          <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium text-center'>
                            {d.annonce.type}
                          </span>
                        )}
                      </div>

                      {(showPayment(d) || statut === 'contrat_signe') && (
                        <div className='border-t border-gray-200 pt-4'>
                          <h4 className='font-medium text-gray-800 mb-3 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Paiement de {MONTANT.toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA
                          </h4>
                          <p className='text-sm text-gray-600 mb-3'>
                            {statut === 'valide'
                              ? 'Votre dossier a été validé. Effectuez le paiement pour finaliser.'
                              : 'Finalisez votre paiement pour signer le contrat.'}
                          </p>
                          <div className='flex flex-wrap gap-3'>
                            {PAYMENT_METHODS.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => handlePaiement(d._id, m.id)}
                                disabled={paiementLoading}
                                className={`${m.color} text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50`}
                              >
                                {paiementLoading ? (
                                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                )}
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 mt-8 animate-fade-in-up animation-delay-300'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Historique des paiements</h2>
          </div>

          {paiements.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p>Aucun paiement effectué</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-100'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Date</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Montant</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Méthode</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Statut</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {paiements.map((p) => (
                    <tr key={p._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-800'>{(p.montant || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                      <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{p.methode}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.statut === 'reussi' || p.statut === 'success'
                            ? 'bg-green-100 text-green-800'
                            : p.statut === 'echoue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {p.statut === 'reussi' || p.statut === 'success'
                            ? 'Réussi'
                            : p.statut === 'echoue'
                            ? 'Échoué'
                            : p.statut || 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MesDossiers;
