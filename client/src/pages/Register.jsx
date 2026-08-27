import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Register() {
  const [role, setRole] = useState('etudiant');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cniImage, setCniImage] = useState('');
  const [cniFile, setCniFile] = useState(null);
  const [cniUploading, setCniUploading] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [pays, setPays] = useState('Sénégal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (role === 'bailleur' && !cniImage) {
      setError('La CNI est requise pour les bailleurs');
      return;
    }
    setLoading(true);
    try {
      const payload = { nom, prenom, email, telephone, password, role, adresse, pays };
      if (role === 'etudiant') payload.etablissement = etablissement;
      if (role === 'bailleur') payload.cni = cniImage;
      await register(payload);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map((er) => er.msg || er.message).join(', '));
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCniChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCniUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload/public', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCniImage(res.data.url);
      setCniFile(file);
    } catch (err) {
      setError('Erreur lors du téléchargement de la CNI');
    } finally {
      setCniUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4'>
      <div className='max-w-5xl w-full animate-fade-in-up'>
        <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden'>
          <div className='text-center pt-10 pb-6 px-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a5 5 0 0111.707-2.293A5 5 0 0119 20H3z" />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Créer un compte</h2>
            <p className='text-gray-500 text-sm'>Rejoignez TANAL SA LOGEMENT et trouvez votre logement idéal</p>
          </div>

          <div className='px-8 mb-2'>
            <div className='flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl'>
              <button
                type='button'
                onClick={() => { setRole('etudiant'); setError(''); }}
                className={`flex-1 pb-2.5 pt-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-200 ${role === 'etudiant' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Étudiant
              </button>
              <button
                type='button'
                onClick={() => { setRole('bailleur'); setError(''); }}
                className={`flex-1 pb-2.5 pt-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-200 ${role === 'bailleur' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Bailleur
              </button>
            </div>
            <div className='mt-3 flex items-center gap-3 text-xs text-gray-500'>
              <span className={`px-3 py-1 rounded-full font-medium ${role === 'etudiant' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {role === 'etudiant' ? 'Recherchez un logement étudiant' : 'Proposez votre bien locatif'}
              </span>
            </div>
          </div>

          {error && (
            <div className='bg-red-50/80 backdrop-blur text-red-600 p-4 mx-8 mb-6 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-scale-in'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='space-y-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'etudiant' ? 'bg-blue-50 text-primary' : 'bg-green-50 text-secondary'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {role === 'etudiant' ? 'Informations personnelles' : 'Coordonnées du bailleur'}
                  </h3>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Nom</label>
                    <input type='text' value={nom} onChange={(e) => setNom(e.target.value)} className='input-field' required placeholder='Nom' />
                  </div>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Prénom</label>
                    <input type='text' value={prenom} onChange={(e) => setPrenom(e.target.value)} className='input-field' required placeholder='Prénom' />
                  </div>
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Téléphone</label>
                  <input type='tel' value={telephone} onChange={(e) => setTelephone(e.target.value)} className='input-field' required placeholder='+221 77 000 00 00' />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Adresse</label>
                  <input type='text' value={adresse} onChange={(e) => setAdresse(e.target.value)} className='input-field' placeholder='Votre adresse à Dakar' />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Pays de résidence</label>
                  <input type='text' value={pays} onChange={(e) => setPays(e.target.value)} className='input-field' placeholder='Sénégal' />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                  <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='input-field' required placeholder='votre@email.com' />
                </div>
                {role === 'etudiant' && (
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Établissement <span className='text-gray-400'>(optionnel)</span></label>
                    <input type='text' value={etablissement} onChange={(e) => setEtablissement(e.target.value)} className='input-field' placeholder='Université ou école' />
                  </div>
                )}
                {role === 'bailleur' && (
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Pièce d'identité (CNI) <span className='text-red-400'>*</span></label>
                    <div className='border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200'>
                      <input type='file' accept='image/*' onChange={handleCniChange} className='hidden' id='cni-upload' disabled={cniUploading} />
                      <label htmlFor='cni-upload' className='cursor-pointer flex flex-col items-center'>
                        {cniImage ? (
                          <div className='relative'>
                            <img src={cniImage} alt='CNI' className='h-32 w-32 object-cover rounded-xl mb-3 shadow-md' />
                            <span className='text-xs text-green-600 font-medium'>Cliquez pour modifier</span>
                          </div>
                        ) : (
                          <>
                            <div className='w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-3 mx-auto'>
                              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 14l4-4m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                            </div>
                            <span className='text-sm text-gray-600 font-medium'>Cliquez pour télécharger votre CNI</span>
                            <span className='text-xs text-gray-400 mt-1'>JPG, PNG ou PDF (max 5 Mo)</span>
                          </>
                        )}
                      </label>
                      {cniUploading && <span className='text-xs text-green-600 mt-2 font-medium animate-pulse'>Téléchargement...</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 text-secondary rounded-xl flex items-center justify-center'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800'>Sécurité du compte</h3>
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Mot de passe</label>
                  <div className='input-group'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='input-field'
                      required
                      placeholder='••••••••'
                      minLength={6}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='password-toggle'
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Confirmer le mot de passe</label>
                  <div className='input-group'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='input-field'
                      required
                      placeholder='••••••••'
                      minLength={6}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='password-toggle'
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mt-6 border border-blue-100'>
                  <h4 className='text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2'>
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pourquoi s'inscrire ?
                  </h4>
                  <ul className='text-sm text-gray-600 space-y-1.5'>
                    <li className='flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Accédez à toutes les annonces
                    </li>
                    <li className='flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Réservez des visites en ligne
                    </li>
                    <li className='flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Recevez des recommandations
                    </li>
                  </ul>
                </div>

                <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-4'>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Inscription...
                    </>
                  ) : "S'inscrire"}
                </button>
              </div>
            </div>
          </form>

          <div className='bg-gray-50/80 backdrop-blur px-8 py-5 text-center border-t border-gray-100'>
            <p className='text-gray-600 text-sm'>
              Déjà un compte ?{' '}
              <Link to='/connexion' className='text-primary font-semibold hover:underline inline-flex items-center gap-1 transition-colors'>
                Se connecter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

