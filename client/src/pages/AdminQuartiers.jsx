import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import api from '../services/api';

function AdminQuartiers() {
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [nom, setNom] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchQuartiers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getQuartiers();
      setQuartiers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des quartiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuartiers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await adminService.addQuartier({ nom });
      setMessage('Quartier ajouté avec succès');
      setNom('');
      setShowAdd(false);
      fetchQuartiers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminService.toggleQuartier(id);
      fetchQuartiers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce quartier ?')) return;
    try {
      await adminService.deleteQuartier(id);
      fetchQuartiers();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className='p-8'>Chargement...</div>;

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Gestion des quartiers</h1>
          <button onClick={() => setShowAdd(!showAdd)} className='btn-primary px-4 py-2 rounded-lg font-medium'>+ Ajouter un quartier</button>
        </div>
        {message && <div className='bg-green-50 text-green-600 p-3 rounded-lg mb-4'>{message}</div>}
        {error && <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4'>{error}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className='bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Nom du quartier</label>
                <input type='text' value={nom} onChange={(e) => setNom(e.target.value)} className='input-field' placeholder='Ex: Plateau' required />
              </div>
              <div className='flex gap-2'>
                <button type='submit' className='btn-primary px-4 py-2 rounded-lg'>Enregistrer</button>
                <button type='button' onClick={() => setShowAdd(false)} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>Annuler</button>
              </div>
            </div>
          </form>
        )}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <table className='min-w-full divide-y divide-gray-100'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Nom</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Statut</th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {quartiers.map((q) => (
                <tr key={q._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 text-sm font-medium text-gray-800'>{q.nom}</td>
                  <td className='px-6 py-4'>
                    <span className={`px-2 py-1 rounded-full text-xs ${q.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{q.active ? 'Actif' : 'Inactif'}</span>
                  </td>
                  <td className='px-6 py-4 text-right space-x-2'>
                    <button onClick={() => handleToggle(q._id)} className='text-primary hover:text-blue-700 text-sm font-medium'>{q.active ? 'Désactiver' : 'Activer'}</button>
                    <button onClick={() => handleDelete(q._id)} className='text-red-600 hover:text-red-700 text-sm font-medium'>Supprimer</button>
                  </td>
                </tr>
              ))}
              {quartiers.length === 0 && (
                <tr><td colSpan={3} className='px-6 py-8 text-center text-gray-500'>Aucun quartier</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminQuartiers;
