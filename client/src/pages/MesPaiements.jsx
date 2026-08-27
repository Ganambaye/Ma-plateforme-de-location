import { useState, useEffect } from 'react';
import api from '../services/api';

function MesPaiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/paiements/mes-paiements');
        setPaiements(res.data);
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
      reussi: { bg: 'bg-green-100', text: 'text-green-800', label: 'Réussi' },
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      echoue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' },
      rembourse: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Remboursé' },
    };
    return configs[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', label: statut };
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12C0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12C0 5.373 0 12h4z"></path>
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
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Mes paiements</h1>
          <p className='text-gray-600'>Historique de vos transactions</p>
        </div>

        {paiements.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>Aucun paiement</h3>
            <p className='text-gray-600'>Vous n'avez pas encore effectué de paiement.</p>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-100'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Annonce</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Montant</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Méthode</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Référence</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Statut</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {paiements.map((p) => {
                    const status = getStatusConfig(p.statut);
                    return (
                      <tr key={p._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{p.annonce?.titre || 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(p.montant || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                        <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{p.methode || 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{p.reference || 'N/A'}</td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MesPaiements;
