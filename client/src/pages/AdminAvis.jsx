import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminAvis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreType, setFiltreType] = useState('tous');
  const [filtreApprouve, setFiltreApprouve] = useState('tous');

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const res = await api.get('/avis/admin');
      setAvis(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  const handleApprouver = async (id) => {
    try {
      await api.post('/avis/' + id + '/approuver');
      fetchAvis();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleRejeter = async (id) => {
    try {
      await api.post('/avis/' + id + '/rejeter');
      fetchAvis();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const avisFiltres = avis.filter((a) => {
    if (filtreType !== 'tous' && a.cibleType !== filtreType) return false;
    if (filtreApprouve === 'approuve' && !a.estApprouve) return false;
    if (filtreApprouve === 'rejete' && a.estApprouve) return false;
    return true;
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-500'>Chargement des avis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Gestion des avis</h1>
          <p className='text-gray-600'>Modérez les témoignages et avis sur les logements et la plateforme</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h2 className='text-xl font-bold text-gray-800'>Tous les avis</h2>
            <div className='flex gap-2'>
              <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className='input-field w-auto'>
                <option value='tous'>Tous les types</option>
                <option value='logement'>Logement</option>
                <option value='plateforme'>Plateforme</option>
              </select>
              <select value={filtreApprouve} onChange={(e) => setFiltreApprouve(e.target.value)} className='input-field w-auto'>
                <option value='tous'>Tous les statuts</option>
                <option value='approuve'>Approuvés</option>
                <option value='rejete'>Rejetés</option>
              </select>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Auteur</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Note</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Commentaire</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Approuvé</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {avisFiltres.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                      Aucun avis pour le moment
                    </td>
                  </tr>
                ) : avisFiltres.map((a) => (
                  <tr key={a._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{a.auteur ? a.auteur.prenom + ' ' + a.auteur.nom : 'N/A'}</td>
                     <td className='px-6 py-4 text-sm text-gray-600 capitalize'>{a.cibleType}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      <span className='inline-flex items-center gap-1'>
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {a.note}/5
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 max-w-xs truncate'>{a.commentaire}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.estApprouve ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {a.estApprouve ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button onClick={() => handleApprouver(a._id)} className='text-green-600 hover:text-green-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approuver
                        </button>
                        <button onClick={() => handleRejeter(a._id)} className='text-red-600 hover:text-red-700 text-sm font-medium hover:underline inline-flex items-center gap-1'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejeter
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

export default AdminAvis;
