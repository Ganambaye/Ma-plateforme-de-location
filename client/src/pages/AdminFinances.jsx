import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminFinances() {
  const [transactions, setTransactions] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreDate, setFiltreDate] = useState('');
  const [paiementEnCours, setPaiementEnCours] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, contratsRes] = await Promise.all([
        api.get('/paiements/admin').catch(() => ({ data: [] })),
        api.get('/ambassadeurs/contrats').catch(() => ({ data: [] })),
      ]);
      setTransactions(transRes.data);
      setContrats(contratsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let transactionsFiltrees = filtreStatut === 'tous'
    ? transactions
    : transactions.filter((t) => t.statut === filtreStatut);

  if (filtreDate) {
    transactionsFiltrees = transactionsFiltrees.filter((t) => {
      const date = new Date(t.dateTransaction || t.createdAt).toISOString().split('T')[0];
      return date === filtreDate;
    });
  }

  const caTotal = transactions.reduce((sum, t) => sum + (t.montant || 0), 0);
  const totalCommissions = contrats.reduce((sum, c) => sum + (c.commissionBDE || 2000), 0);
  const nombreTransactions = transactions.length;

  const getStatusConfig = (statut) => {
    const configs = {
      reussi: { bg: 'bg-green-100', text: 'text-green-800', label: 'Réussi' },
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      echoue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' },
    };
    return configs[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', label: statut };
  };

  const declencherPaiement = async (contratId) => {
    setPaiementEnCours((prev) => ({ ...prev, [contratId]: true }));
    try {
      await api.post('/ambassadeurs/paiements', { contratId });
      alert('Paiement déclenché avec succès (simulé)');
      setContrats(contrats.map((c) => c._id === contratId ? { ...c, paiementEffectue: true } : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setPaiementEnCours((prev) => ({ ...prev, [contratId]: false }));
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
          <p className='text-gray-500'>Chargement des finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Finances & Commissions</h1>
          <p className='text-gray-600'>Suivi des transactions et gestion des ambassadeurs BDE</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Chiffre d'affaires total</p>
                <p className='text-3xl font-bold text-gray-800'>{(caTotal || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Total commissions BDE</p>
                <p className='text-3xl font-bold text-gray-800'>{(totalCommissions || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Nombre de transactions</p>
                <p className='text-3xl font-bold text-gray-800'>{nombreTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-10'>
          <div className='px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h2 className='text-xl font-bold text-gray-800'>Transactions</h2>
            <div className='flex gap-2'>
              <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className='input-field w-auto'>
                <option value='tous'>Tous</option>
                <option value='reussi'>Réussi</option>
                <option value='en_attente'>En attente</option>
                <option value='echoue'>Échoué</option>
              </select>
              <input
                type='date'
                value={filtreDate}
                onChange={(e) => setFiltreDate(e.target.value)}
                className='input-field w-auto'
                placeholder='Date'
              />
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Utilisateur</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Annonce</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Montant</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Méthode</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Référence</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Statut</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Commission BDE</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {transactionsFiltrees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='px-6 py-12 text-center text-gray-500'>
                      Aucune transaction pour le moment
                    </td>
                  </tr>
                ) : transactionsFiltrees.map((t) => {
                  const status = getStatusConfig(t.statut);
                  return (
                    <tr key={t._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{t.utilisateur ? t.utilisateur.prenom + ' ' + t.utilisateur.nom : 'N/A'}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{t.annonce ? t.annonce.titre : 'N/A'}</td>
                      <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(t.montant || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                      <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{t.methode || 'N/A'}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{t.reference || 'N/A'}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{new Date(t.date).toLocaleString('fr-FR')}</td>
                      <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(t.commissionBDE || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Gestion des Ambassadeurs BDE</h2>
            <p className='text-gray-600 text-sm mt-1'>Contrats validés via code parrainage - Commission : 2 000 FCFA par contrat</p>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ambassadeur</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Code parrainage</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Contrats validés</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Commission</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Paiement</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {contrats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                      Aucun contrat d'ambassadeur pour le moment
                    </td>
                  </tr>
                ) : contrats.map((c) => (
                  <tr key={c._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{c.ambassadeur ? c.ambassadeur.prenom + ' ' + c.ambassadeur.nom : 'N/A'}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{c.codeParrainage || 'N/A'}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{c.nombreContrats || 0}</td>
                    <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(c.commissionBDE || 2000).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.paiementEffectue ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.paiementEffectue ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {!c.paiementEffectue && (
                        <button
                          onClick={() => declencherPaiement(c._id)}
                          disabled={paiementEnCours[c._id]}
                          className='btn-primary text-sm inline-flex items-center gap-1'
                        >
                          {paiementEnCours[c._id] ? 'Traitement...' : 'Déclencher le paiement'}
                        </button>
                      )}
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

export default AdminFinances;
