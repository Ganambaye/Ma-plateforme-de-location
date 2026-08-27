import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titre: '', message: '', type: 'systeme' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/notifications', form);
      setMessage('Notification globale créée avec succès');
      setForm({ titre: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const marquerToutLu = async () => {
    try {
      await api.post('/notifications/marquer-tout-lu');
      fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const getTypeConfig = (type) => {
    const configs = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    return configs[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-500'>Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Gestion des notifications</h1>
            <p className='text-gray-600'>Envoyez des notifications globales et consultez l'historique</p>
          </div>
          <button onClick={marquerToutLu} className='btn-secondary inline-flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Marquer tout comme lu
          </button>
        </div>

        {message && (
          <div className='bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Créer une notification globale</h2>
          <form onSubmit={handleCreate} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Titre</label>
              <input type='text' name='titre' value={form.titre} onChange={handleChange} className='input-field' required />
            </div>
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Type</label>
              <select name='type' value={form.type} onChange={handleChange} className='input-field'>
                <option value='systeme'>Système</option>
                <option value='visite'>Visite</option>
                <option value='paiement'>Paiement</option>
                <option value='annonce'>Annonce</option>
                <option value='colocation'>Colocation</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
            <div className='md:col-span-2'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Message</label>
              <textarea name='message' value={form.message} onChange={handleChange} className='input-field' rows={3} required />
            </div>
            <div className='md:col-span-2'>
              <button type='submit' className='btn-primary'>Envoyer la notification</button>
            </div>
          </form>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='px-6 py-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800'>Historique des notifications</h2>
          </div>
          <div className='divide-y divide-gray-100'>
            {notifications.length === 0 ? (
              <div className='px-6 py-12 text-center text-gray-500'>
                Aucune notification pour le moment
              </div>
            ) : notifications.map((n) => (
              <div key={n._id} className='px-6 py-4 hover:bg-gray-50 transition'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-3 mb-1'>
                      <h3 className='text-sm font-medium text-gray-800'>{n.titre}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeConfig(n.type)}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600'>{n.message}</p>
                     <p className='text-xs text-gray-400 mt-1'>{new Date(n.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotifications;
