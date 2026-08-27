import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../services/adminService';
import api from '../services/api';

function AdminEditAnnonce() {
  const { id } = useParams();
  const [form, setForm] = useState({ titre: '', description: '', type: 'chambre', prix: '', quartier: '', proprietaire: '', images: '', isAvailable: true });
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const res = await adminService.getAnnonces();
        const annonce = res.data.find((a) => a._id === id);
        if (annonce) {
          setForm({
            titre: annonce.titre || '',
            description: annonce.description || '',
            type: annonce.type || 'chambre',
            prix: annonce.prix || '',
            quartier: annonce.quartier || '',
            proprietaire: annonce.proprietaire || '',
            images: Array.isArray(annonce.images) ? annonce.images.join(', ') : '',
            isAvailable: annonce.isAvailable ?? true,
          });
          if (annonce.images && annonce.images.length > 0) {
            setPreview(annonce.images[0]);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'annonce');
      } finally {
        setFetching(false);
      }
    };
    fetchAnnonce();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedImageUrl(res.data.url);
      setPreview(res.data.url);
    } catch (err) {
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedImageUrl(res.data.url);
      setPreview(res.data.url);
    } catch (err) {
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const images = uploadedImageUrl ? [uploadedImageUrl] : form.images.split(',').map((url) => url.trim()).filter((url) => url.length > 0);
      const payload = { ...form, prix: Number(form.prix), images };
      await adminService.updateAnnonce(id, payload);
      setSuccess('Annonce modifiée avec succès');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Modifier l'annonce</h1>
          <p className='text-gray-600'>Modifiez les informations de l'annonce</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-200'>
          <div className='p-6 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifications
            </h2>
          </div>

          {error && (
            <div className='mx-6 mt-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className='mx-6 mt-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm flex items-center gap-2'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Titre de l'annonce</label>
                <input name='titre' value={form.titre} onChange={handleChange} required className='input-field' placeholder='Ex: Belle chambre à Dakar Plateau' />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Prix (FCFA/mois)</label>
                <input name='prix' type='number' value={form.prix} onChange={handleChange} required min='0' className='input-field' placeholder='Ex: 50000' />
              </div>
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Description</label>
              <textarea name='description' value={form.description} onChange={handleChange} required rows='4' className='input-field' placeholder='Décrivez le logement en détail...'></textarea>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Type</label>
                <select name='type' value={form.type} onChange={handleChange} className='input-field'>
                  <option value='chambre'>Chambre</option>
                  <option value='studio'>Studio</option>
                  <option value='appartement'>Appartement</option>
                </select>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Quartier</label>
                <input name='quartier' value={form.quartier} onChange={handleChange} required className='input-field' placeholder='Ex: Plateau' />
              </div>
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Propriétaire (optionnel)</label>
              <input name='proprietaire' value={form.proprietaire} onChange={handleChange} className='input-field' placeholder='Nom du propriétaire' />
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Images (URLs séparées par des virgules)</label>
              <input name='images' value={form.images} onChange={handleChange} className='input-field' placeholder='https://...' />
              {preview && <img src={preview} alt='Aperçu' className='mt-2 h-48 object-cover rounded-xl border border-gray-100' />}
            </div>

            <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-xl'>
              <input id='isAvailable' name='isAvailable' type='checkbox' checked={form.isAvailable} onChange={handleChange} className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary' />
              <label htmlFor='isAvailable' className='text-sm font-medium text-gray-700'>Marquer comme disponible</label>
            </div>

            <div className='flex gap-4 pt-4'>
              <button type='submit' disabled={loading || uploading} className='btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50'>
                {loading ? 'Modification...' : 'Modifier l\'annonce'}
              </button>
              <button type='button' onClick={() => navigate('/admin')} className='px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition'>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminEditAnnonce;