import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { annonceService } from '../services/annonceService';
import api from '../services/api';
import { filtersService } from '../services/filtersService';

function AdminAddAnnonce() {
  const [form, setForm] = useState({ titre: '', description: '', type: 'chambre', prix: '', quartier: '', proprietaire: '', images: '', isAvailable: true });
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [quartiers, setQuartiers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuartiers = async () => {
      try {
        const res = await filtersService.getQuartiers();
        setQuartiers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuartiers();
  }, []);

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
      const images = uploadedImageUrl ? [uploadedImageUrl] : [];
      const payload = { ...form, prix: Number(form.prix), images };
      await annonceService.create(payload);
      setSuccess('Annonce ajoutée avec succès');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Ajouter une annonce</h1>
          <p className='text-gray-600'>Remplissez le formulaire ci-dessous pour ajouter une nouvelle annonce</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-200'>
          <div className='p-6 border-b border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Détails de l'annonce
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
                <select name='quartier' value={form.quartier} onChange={handleChange} required className='input-field'>
                  <option value=''>Sélectionner un quartier</option>
                  {quartiers.map((q) => (
                    <option key={q._id || q.nom} value={q.nom}>{q.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Propriétaire (optionnel)</label>
              <input name='proprietaire' value={form.proprietaire} onChange={handleChange} className='input-field' placeholder='Nom du propriétaire' />
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Image</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                  dragOver ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                  id='image-upload'
                />
                <label htmlFor='image-upload' className='cursor-pointer flex flex-col items-center'>
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className='text-sm text-gray-600'>Glissez une image ici ou <span className='text-primary font-medium'>parcourez</span></p>
                  <p className='text-xs text-gray-400 mt-1'>PNG, JPG jusqu'à 5MB</p>
                </label>
              </div>
              {uploading && (
                <div className='mt-3 flex items-center gap-2 text-sm text-gray-500'>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Téléchargement...
                </div>
              )}
              {preview && (
                <div className='mt-4'>
                  <img src={preview} alt='Aperçu' className='h-48 object-cover rounded-xl border border-gray-100' />
                </div>
              )}
            </div>

            <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-xl'>
              <input id='isAvailable' name='isAvailable' type='checkbox' checked={form.isAvailable} onChange={handleChange} className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary' />
              <label htmlFor='isAvailable' className='text-sm font-medium text-gray-700'>Marquer comme disponible</label>
            </div>

            <button type='submit' disabled={loading || uploading} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 py-3'>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer l'annonce
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddAnnonce;