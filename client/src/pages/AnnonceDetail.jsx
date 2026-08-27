import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { annonceService } from '../services/annonceService';
import { visiteService } from '../services/visiteService';

function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [dateVisite, setDateVisite] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await annonceService.getOne(id);
        setAnnonce(res.data);
        const res2 = await annonceService.getAll({ type: res.data.type });
        setRelated(res2.data.filter((a) => a._id !== id).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
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

  if (!annonce) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4'>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className='text-gray-500 text-lg'>Annonce non trouvée</p>
          <Link to='/annonces' className='btn-primary mt-4 inline-flex'>Retour aux annonces</Link>
        </div>
      </div>
    );
  }

  const images = annonce.images && annonce.images.length > 0 ? annonce.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];

  const handleRequestVisit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!dateVisite) {
      setMessage('Veuillez choisir une date');
      return;
    }
    setSubmitting(true);
    try {
      await visiteService.create({ annonceId: id, dateVisite });
      setMessage('Demande de visite envoyée avec succès');
      setDateVisite('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className='mb-6 animate-fade-in-up'>
          <ol className='flex items-center gap-2 text-sm text-gray-500'>
            <li><Link to='/' className='hover:text-primary transition'>Accueil</Link></li>
            <li>/</li>
            <li><Link to='/annonces' className='hover:text-primary transition'>Annonces</Link></li>
            <li>/</li>
            <li className='text-gray-800 font-medium truncate'>{annonce.titre}</li>
          </ol>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Image Gallery */}
            <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in-up'>
              <div className='relative'>
                <img
                  src={images[activeImage]}
                  alt={`${annonce.titre} ${activeImage + 1}`}
                  className='w-full h-64 sm:h-96 object-cover'
                />
                <div className='absolute top-4 right-4 flex gap-2'>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${annonce.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {annonce.isAvailable ? 'Disponible' : 'Non disponible'}
                  </span>
                  {annonce.isVerified && (
                    <span className='bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium'>Vérifié</span>
                  )}
                </div>
              </div>
              {images.length > 1 && (
                <div className='flex gap-2 p-4 bg-gray-50'>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img src={img} alt={`${annonce.titre} ${idx + 1}`} className='w-full h-full object-cover' />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in-up animation-delay-200'>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span className='bg-primary text-white px-4 py-1.5 rounded-full text-sm capitalize font-medium'>{annonce.type}</span>
                <span className='bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm'>{annonce.quartier}</span>
              </div>

              <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-3'>{annonce.titre}</h1>
              <p className='text-3xl font-bold text-green-600 mb-6'>{(annonce.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</p>

              <div className='prose max-w-none mb-6'>
                <p className='text-gray-600 whitespace-pre-wrap leading-relaxed'>{annonce.description}</p>
              </div>

              {annonce.bailleur && (
                <div className='bg-gray-50 rounded-xl p-5 border border-gray-100'>
                  <h3 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Informations du bailleur
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm'>
                    <p className='text-gray-600'>{annonce.bailleur.nom} {annonce.bailleur.prenom}</p>
                    <p className='text-gray-600'>{annonce.bailleur.email}</p>
                    <p className='text-gray-600'>{annonce.bailleur.telephone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Related Annonces */}
            {related.length > 0 && (
              <div className='mt-8 animate-fade-in-up animation-delay-400'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>Annonces similaires</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {related.map((a) => (
                    <Link
                      key={a._id}
                      to={`/annonces/${a._id}`}
                      className='group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                    >
                      <div className='overflow-hidden'>
                        <img
                          src={a.images && a.images.length > 0 ? a.images[0] : 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600'}
                          alt={a.titre}
                          className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      </div>
                      <div className='p-4'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition'>{a.titre}</h3>
                        <p className='text-green-600 font-bold'>{(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 space-y-6'>
              {/* Booking Card */}
              <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in-up animation-delay-300'>
                <h3 className='text-xl font-bold text-gray-800 mb-2'>{(annonce.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</h3>
                <p className='text-sm text-gray-500 mb-4'>{annonce.type} - {annonce.quartier}</p>

                {message && (
                  <div className={`text-sm mb-4 p-3 rounded-xl flex items-center gap-2 ${message.includes('succès') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {message}
                  </div>
                )}

                {annonce.isAvailable && user && user.role === 'etudiant' && (
                  <form onSubmit={handleRequestVisit} className='space-y-4'>
                    <div>
                      <label className='block text-gray-700 text-sm font-medium mb-2'>Date de visite souhaitée</label>
                      <input
                        type='datetime-local'
                        value={dateVisite}
                        onChange={(e) => setDateVisite(e.target.value)}
                        className='input-field'
                        required
                      />
                    </div>
                    <button type='submit' disabled={submitting} className='btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50'>
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="none" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Valider la demande
                        </>
                      )}
                    </button>
                  </form>
                )}

                {annonce.isAvailable && (!user || user.role !== 'etudiant') && (
                  <div className='bg-blue-50 rounded-xl p-4 text-sm text-gray-600'>
                    <Link to='/connexion' className='text-primary font-medium hover:underline'>Connectez-vous</Link> en tant qu'étudiant pour réserver.
                  </div>
                )}

                {!annonce.isAvailable && (
                  <div className='bg-red-50 text-red-600 p-4 rounded-xl text-sm'>
                    Cette annonce est déjà prise / non disponible.
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Informations utiles
                </h4>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li className='flex items-start gap-2'>
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Annonce vérifiée par nos équipes
                  </li>
                  <li className='flex items-start gap-2'>
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Visite accompagnée par le propriétaire
                  </li>
                  <li className='flex items-start gap-2'>
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Réponse sous 24h
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnonceDetail;