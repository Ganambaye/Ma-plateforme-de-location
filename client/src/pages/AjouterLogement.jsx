import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { annonceService } from '../services/annonceService';
import { filtersService } from '../services/filtersService';

const STEPS = [
  { id: 1, label: 'Caractéristiques', icon: 'M9 12h6m-6 4h6' },
  { id: 2, label: 'Localisation', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z' },
  { id: 3, label: 'Médias', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4.414-4.414a2 2 0 012.828 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2z' },
];

const TYPES_LOGEMENT = [
  { value: 'chambre', label: 'Chambre' },
  { value: 'studio', label: 'Studio' },
  { value: 'appartement', label: 'Appartement' },
];

function AjouterLogement() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: 'chambre',
    nbPieces: '',
    superficie: '',
    loyer: '',
    caution: '',
    titre: '',
    description: '',
    adresse: '',
    quartier: '',
    demandeVerification: false,
    images: [],
    isAvailable: true,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quartiers, setQuartiers] = useState([]);
  const [loadingQuartiers, setLoadingQuartiers] = useState(true);
  const [customQuartier, setCustomQuartier] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuartiers = async () => {
      try {
        setLoadingQuartiers(true);
        const res = await filtersService.getQuartiers();
        setQuartiers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQuartiers(false);
      }
    };
    fetchQuartiers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    for (const file of files) {
      try {
        const data = new FormData();
        data.append('image', file);
        const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setUploadedImages((prev) => [...prev, res.data.url]);
      } catch (err) {
        setError("Erreur lors du téléchargement de l'image");
      }
    }
    setUploading(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    for (const file of files) {
      try {
        const data = new FormData();
        data.append('image', file);
        const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setUploadedImages((prev) => [...prev, res.data.url]);
      } catch (err) {
        setError("Erreur lors du téléchargement de l'image");
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      setError('Veuillez télécharger au moins une image');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        nbPieces: Number(form.nbPieces),
        superficie: Number(form.superficie),
        loyer: Number(form.loyer),
        caution: Number(form.caution),
        prix: Number(form.loyer),
        titre: form.titre,
        description: form.description,
        adresse: form.adresse,
        quartier: customQuartier.trim() || form.quartier,
        isVerified: form.demandeVerification,
        images: uploadedImages,
        isAvailable: form.isAvailable,
      };
      await annonceService.create(payload);
      setSuccess('Annonce déposée avec succès');
      setTimeout(() => navigate('/dashboard/bailleur'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du dépôt de l\'annonce');
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = (s) => {
    if (s === 1) return form.titre && form.description && form.loyer && form.type && form.nbPieces && form.superficie && form.caution;
    if (s === 2) return form.adresse && form.quartier;
    if (s === 3) return uploadedImages.length > 0;
    return true;
  };

  const nextStep = () => {
    if (!isStepValid(step)) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Déposer une annonce</h1>
          <p className='text-gray-600'>Publiez votre logement en quelques étapes simples</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up animation-delay-200'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between mb-2'>
              {STEPS.map((s) => (
                <div key={s.id} className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition ${
                      step >= s.id
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}
                  >
                    {step > s.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.id}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className='relative mt-3'>
              <div className='absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2'></div>
              <div
                className='absolute top-1/2 left-0 h-2 bg-primary rounded-full -translate-y-1/2 transition-all duration-300'
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
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

          <form onSubmit={handleSubmit} className='p-6'>
            {step === 1 && (
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className='text-xl font-bold text-gray-800'>Caractéristiques du bien</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Type de bien</label>
                    <select name='type' value={form.type} onChange={handleChange} className='input-field'>
                      {TYPES_LOGEMENT.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Nombre de pièces</label>
                    <input type='number' name='nbPieces' value={form.nbPieces} onChange={handleChange} min='0' className='input-field' placeholder='Ex: 3' />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Superficie (m²)</label>
                    <input type='number' name='superficie' value={form.superficie} onChange={handleChange} min='0' className='input-field' placeholder='Ex: 25' />
                  </div>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Loyer mensuel (FCFA)</label>
                    <input type='number' name='loyer' value={form.loyer} onChange={handleChange} min='0' className='input-field' placeholder='Ex: 80000' />
                  </div>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Caution exigée (FCFA)</label>
                  <input type='number' name='caution' value={form.caution} onChange={handleChange} min='0' className='input-field' placeholder='Ex: 100000' />
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Titre de l'annonce</label>
                  <input name='titre' value={form.titre} onChange={handleChange} required className='input-field' placeholder="Ex: Jolie chambre meublée au Plateau" />
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Description</label>
                  <textarea name='description' value={form.description} onChange={handleChange} required rows='4' className='input-field' placeholder='Décrivez votre logement en détail...'></textarea>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-green-50 text-secondary rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
                    </svg>
                  </div>
                  <h2 className='text-xl font-bold text-gray-800'>Localisation</h2>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Adresse exacte</label>
                  <input name='adresse' value={form.adresse} onChange={handleChange} required className='input-field' placeholder='Rue 12, Villa 45, Dakar' />
                  <p className='text-xs text-gray-500 mt-1'>Cette adresse restera confidentielle et ne sera pas affichée au public.</p>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Quartier</label>
                  <select name='quartier' value={form.quartier} onChange={(e) => { handleChange(e); setCustomQuartier(''); }} required className='input-field'>
                    <option value=''>Sélectionner un quartier</option>
                    {quartiers.map((q) => (
                      <option key={q._id || q.nom} value={q.nom}>{q.nom}</option>
                    ))}
                  </select>
                  <p className='text-xs text-gray-500 mt-1'>Vous ne trouvez pas votre quartier ? Ajoutez-le ci-dessous.</p>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Nouveau quartier <span className='text-gray-400'>(optionnel)</span></label>
                  <input
                    type='text'
                    value={customQuartier}
                    onChange={(e) => setCustomQuartier(e.target.value)}
                    className='input-field'
                    placeholder='Ex: Ngor Virage, Mamelles...'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Si vous renseignez un nouveau quartier, il sera ajouté à la plateforme.</p>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className='font-medium text-gray-800 text-sm'>Demander la vérification TANAL-SA-LOGEMENT</p>
                      <p className='text-xs text-gray-500 mt-0.5'>
                        Une fois vérifiée, votre annonce affichera le badge "Vérifiée".
                      </p>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => setForm((prev) => ({ ...prev, demandeVerification: !prev.demandeVerification }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.demandeVerification ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className='absolute inset-y-0 left-0.5 h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200' style={{ transform: form.demandeVerification ? 'translateX(20px)' : 'translateX(0)' }}></span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4.414-4.414a2 2 0 012.828 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className='text-xl font-bold text-gray-800'>Photos du logement</h2>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className='border-2 border-dashed rounded-xl p-8 text-center transition border-gray-200'
                >
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    className='hidden'
                    id='photos-upload'
                  />
                  <label htmlFor='photos-upload' className='cursor-pointer flex flex-col items-center'>
                    <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4.414-4.414a2 2 0 012.828 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v.01M12 9v.01M12 13a4 4 0 110-8 4 4 0 010 8z" />
                      </svg>
                    </div>
                    <p className='text-sm text-gray-600'>Cliquez pour télécharger ou glissez vos photos ici</p>
                    <p className='text-xs text-gray-400 mt-1'>PNG, JPG - plusieurs fichiers autorisés</p>
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

                {uploadedImages.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4'>
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className='relative'>
                        <img src={img} alt={`Photo ${idx + 1}`} className='w-full h-24 object-cover rounded-xl border border-gray-100' />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className='flex justify-between pt-6 border-t border-gray-100'>
              <button
                type='button'
                onClick={prevStep}
                disabled={step === 1}
                className='px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>

              {step < 3 ? (
                <button
                  type='button'
                  onClick={nextStep}
                  className='btn-primary flex items-center justify-center gap-2'
                >
                  Suivant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={submitting || uploading || uploadedImages.length === 0}
                  className='btn-secondary flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Dépôt...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Déposer l'annonce
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AjouterLogement;

