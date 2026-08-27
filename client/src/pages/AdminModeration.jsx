import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import api from '../services/api';

function AdminModeration() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('toutes');

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnnonces();
      setAnnonces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminService.verifyAnnonce(id);
      fetchAnnonces();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la vérification');
    }
  };

  const handleDisponibilite = async (id, isAvailable) => {
    try {
      await api.put('/annonces/' + id, { isAvailable: !isAvailable });
      fetchAnnonces();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette annonce ?')) {
      try {
        await adminService.deleteAnnonce(id);
        setAnnonces(annonces.filter((a) => a._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const annoncesFiltrees = filtre === 'verifiees'
    ? annonces.filter((a) => a.isVerified)
    : filtre === 'en_attente'
      ? annonces.filter((a) => !a.isVerified)
      : annonces;

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-500'>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Modération des logements</h1>
          <p className='text-gray-600'>Validez, rejetez ou gérez la disponibilité des annonces</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h2 className='text-xl font-bold text-gray-800'>Toutes les annonces</h2>
            <div className='flex gap-2'>
              <button onClick={() => setFiltre('toutes')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtre === 'toutes' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Toutes
              </button>
              <button onClick={() => setFiltre('verifiees')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtre === 'verifiees' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Vérifiées
              </button>
              <button onClick={() => setFiltre('en_attente')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtre === 'en_attente' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                En attente
              </button>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Titre</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Prix</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quartier</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Statut</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Disponibilité</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {annoncesFiltrees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                      Aucune annonce pour le moment
                    </td>
                  </tr>
                ) : annoncesFiltrees.map((a) => (
                  <tr key={a._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-800'>{a.titre}</td>
                    <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{a.type}</td>
                     <td className='px-6 py-4 text-sm text-gray-600 font-medium'>{(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{a.quartier}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {a.isVerified ? 'Vérifié' : 'En attente'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => handleDisponibilite(a._id, a.isAvailable)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${a.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {a.isAvailable ? 'Disponible' : 'Réservée'}
                      </button>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {!a.isVerified && (
                          <button onClick={() => handleVerify(a._id)} className='text-green-600 hover:text-green-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approuver
                          </button>
                        )}
                        <button onClick={() => handleDelete(a._id)} className='text-red-600 hover:text-red-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
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

export default AdminModeration;
