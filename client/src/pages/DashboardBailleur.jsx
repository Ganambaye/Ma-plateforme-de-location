import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function DashboardBailleur() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ biens: 0, visites: 0, actifs: 0, boost: 0 });
  const [biens, setBiens] = useState([]);
  const [revenus, setRevenus] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/annonces').catch(() => ({ data: [] })),
      api.get('/visites/mes-annonces').catch(() => ({ data: [] })),
      api.get('/paiements/mes-paiements').catch(() => ({ data: [] })),
    ]).then(([annoncesRes, visitesRes, paiementsRes]) => {
      const mesAnnonces = annoncesRes.data.filter(a => a.bailleur?._id === user?.id || a.bailleur === user?.id);
      setStats({
        biens: mesAnnonces.length,
        visites: visitesRes.data.filter(v => v.annonce && mesAnnonces.some(a => a._id === v.annonce._id)).length,
        actifs: mesAnnonces.filter(a => a.isAvailable).length,
        boost: mesAnnonces.filter(a => a.premium).length,
      });
      setBiens(mesAnnonces);
      const pubPaiements = paiementsRes.data.filter(p => p.type === 'publication' && p.statut === 'reussi');
      setRevenus(pubPaiements.reduce((sum, p) => sum + (p.montant || 0), 0));
    });
  }, [user]);

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Tableau de bord Bailleur</h1>
        <p className='text-gray-600 mb-8'>Gérez vos biens et visites</p>

        <div className='flex flex-wrap gap-4 mb-8'>
          <Link to='/bailleur/ajouter-logement' className='btn-primary inline-flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Ajouter un logement
          </Link>
          <Link to='/bailleur/mes-biens' className='bg-secondary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-emerald-600 transition'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 011-1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Mes biens
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <h3 className='text-gray-600 text-sm'>Biens en ligne</h3>
            <p className='text-3xl font-bold text-gray-800'>{stats.biens}</p>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <h3 className='text-gray-600 text-sm'>Visites programmées</h3>
            <p className='text-3xl font-bold text-gray-800'>{stats.visites}</p>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <h3 className='text-gray-600 text-sm'>Biens disponibles</h3>
            <p className='text-3xl font-bold text-gray-800'>{stats.actifs}</p>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <h3 className='text-gray-600 text-sm'>Annonces boostées</h3>
            <p className='text-3xl font-bold text-gray-800'>{stats.boost}</p>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
            <h3 className='text-gray-600 text-sm'>Revenus publications</h3>
            <p className='text-3xl font-bold text-gray-800'>{(revenus || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</p>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Mes logements</h2>
          </div>
          {biens.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>Aucun logement ajouté</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-100'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Titre</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Quartier</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Prix</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Statut</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {biens.map((b) => (
                    <tr key={b._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm font-medium text-gray-800'>{b.titre}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{b.quartier}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{(b.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {b.isAvailable ? 'Disponible' : 'Réservé'}
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

export default DashboardBailleur;
