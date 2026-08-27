import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnonceList from '../components/AnnonceList';
import { filtersService } from '../services/filtersService';
import api from '../services/api';

function Home() {
  const [type, setType] = useState('');
  const [quartier, setQuartier] = useState('');
  const [prix, setPrix] = useState('');
  const [quartiers, setQuartiers] = useState([]);
  const [prixs, setPrixs] = useState([]);
  const [premiums, setPremiums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    filtersService.getAllOptions().then(({ quartiers: q, prix: p }) => {
      setQuartiers(q);
      setPrixs(p);
    }).catch(console.error);
    api.get('/annonces', { params: { available: 'true' } }).then((res) => {
      const filtered = (res.data || []).filter((a) => a.premium && a.isVerified).slice(0, 6);
      setPremiums(filtered);
    }).catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (quartier) params.set('quartier', quartier);
    if (prix) params.set('prixMax', prix);
    navigate('/annonces?' + params.toString());
  };

  const steps = [
    {
      title: 'Recherchez',
      description: 'Parcourez des centaines d\'annonces vérifiées à Dakar. Filtrez par quartier, type et budget.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Visitez',
      description: 'Réservez une visite en un clic et rencontrez le propriétaire. Confirmez votre créneau en ligne.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Emménagez',
      description: 'Trouvez votre nouveau logement et emménagez en toute sérénité. accompagnement personnalisé.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
  ];

  const features = [
    { title: 'Annonces vérifiées', desc: 'Toutes nos annonces sont validées par notre équipe pour éviter les arnaques.', color: 'bg-blue-500' },
    { title: 'Gestion des visites', desc: 'Réservez et gérez vos visites directement depuis votre tableau de bord.', color: 'bg-green-500' },
    { title: 'Support 24/7', desc: 'Notre équipe est disponible à tout moment pour vous accompagner.', color: 'bg-purple-500' },
    { title: 'Sécurisé', desc: 'Vos données sont protégées et vos transactions sont sécurisées.', color: 'bg-accent' },
  ];

  return (
    <div className='min-h-screen bg-light'>
      {/* Hero Section */}
      <section className='relative bg-dark text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <img src='https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1600&q=80' alt='Accueil' className='w-full h-full object-cover opacity-100' style={{ transform: 'translateZ(0)' }} />
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center'>
          <div className='mb-6 inline-block animate-fade-in-up'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6'>
              <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
              <span className='text-sm text-white/90 font-medium'>Plateforme #1 de logement étudiant à Dakar</span>
            </div>
          </div>
          <h1 className='text-4xl md:text-7xl font-bold mb-6 animate-fade-in-up leading-tight'>
            Trouvez votre <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500'>logement idéal</span> à Dakar
          </h1>
          <p className='text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200'>
            TANAL SA LOGEMENT - Choisis ton logement. Recherchez, visitez et emménagez en toute simplicité.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400'>
            <Link to='/annonces' className='inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition transform hover:scale-105 shadow-lg hover:shadow-xl'>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Voir les annonces
            </Link>
            <Link to='/inscription' className='inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg hover:shadow-xl'>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a5 5 0 0111.707-2.293A5 5 0 0119 20H3z" />
              </svg>
              S'inscrire gratuitement
            </Link>
          </div>

          <div className='mt-12 flex items-center justify-center gap-8 text-sm text-gray-300 animate-fade-in-up animation-delay-600'>
            <div className='flex items-center gap-2'>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Annonces vérifiées</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Paiement sécurisé</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Slides */}
      {premiums.length > 0 && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>Annonces en vedette</h2>
              <p className='text-gray-600 text-sm'>Les bailleurs qui boostent leur annonce apparaissent ici</p>
            </div>
          </div>
          <div className='relative'>
            <div className='flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth' style={{ scrollbarWidth: 'none' }}>
              {premiums.map((a) => (
                <Link key={a._id} to={'/annonces/' + a._id} className='min-w-[320px] snap-start'>
                  <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='relative h-48'>
                      {a.images && a.images.length > 0 ? (
                        <img src={a.images[0]} alt={a.titre} className='w-full h-full object-cover' />
                      ) : (
                        <img src='https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600' alt={a.titre} className='w-full h-full object-cover' />
                      )}
                      <div className='absolute top-3 left-3 flex gap-2'>
                        <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Premium
                        </span>
                      </div>
                    </div>
                    <div className='p-5'>
                      <h3 className='text-lg font-semibold text-gray-800 mb-1 line-clamp-1'>{a.titre}</h3>
                      <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{a.description}</p>
                      <div className='flex items-center justify-between'>
                        <span className='text-green-600 font-bold'>{(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</span>
                        <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium'>{a.quartier}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <form onSubmit={handleSearch} className='bg-white rounded-2xl shadow-xl p-6 -mt-16 relative z-10 border border-gray-100'>
           <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
             <select value={type} onChange={(e) => setType(e.target.value)} className='input-field'>
               <option value=''>Type de logement</option>
               <option value='chambre'>Chambre</option>
               <option value='studio'>Studio</option>
               <option value='appartement'>Appartement</option>
             </select>
             <select value={quartier} onChange={(e) => setQuartier(e.target.value)} className='input-field'>
               <option value=''>Quartier</option>
               {quartiers.map((q) => (
                 <option key={q._id} value={q.nom}>{q.nom}</option>
               ))}
             </select>
             <select value={prix} onChange={(e) => setPrix(e.target.value)} className='input-field'>
               <option value=''>Prix max</option>
               {prixs.map((p) => (
                 <option key={p._id} value={p.max}>{p.label}</option>
               ))}
             </select>
            <button type='submit' className='btn-primary w-full flex items-center justify-center gap-2'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rechercher
            </button>
          </div>
        </form>
      </section>

      {/* Comment ça marche */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Comment ça marche ?</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Trois étapes simples pour trouver votre logement idéal à Dakar</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='relative bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'>
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg'>
                  {index + 1}
                </div>
              </div>
              <div className='mt-8 mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-primary rounded-2xl'>
                {step.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>{step.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
             <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Pourquoi choisir TANAL SA LOGEMENT ?</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Nous offrons une expérience unique pour la recherche de logement à Dakar</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, index) => (
              <div key={index} className='group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200'>
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{feature.title}</h3>
                <p className='text-gray-600 text-sm leading-relaxed'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Annonces */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Annonces récentes</h2>
          <p className='text-lg text-gray-600'>Découvrez les dernières opportunités de logement à Dakar</p>
        </div>
        <AnnonceList limit={6} />
        <div className='text-center mt-12'>
          <Link to='/annonces' className='inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl'>
            Voir toutes les annonces
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-dark text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            <div>
               <h3 className='text-2xl font-bold mb-4'>TANAL SA LOGEMENT</h3>
              <p className='text-gray-300'>Votre partenaire de confiance pour la recherche de logement à Dakar.</p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Liens rapides</h4>
              <ul className='space-y-2'>
                <li><Link to='/annonces' className='text-gray-300 hover:text-white transition'>Annonces</Link></li>
                <li><Link to='/colocation' className='text-gray-300 hover:text-white transition'>Colocation</Link></li>
                <li><Link to='/inscription' className='text-gray-300 hover:text-white transition'>Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Contact</h4>
              <ul className='space-y-2'>
                <li className='text-gray-300'>contact@tanal-sa-logement.sn</li>
                <li className='text-gray-300'>+221 78 136 59 25</li>
                <li className='text-gray-300'>Dakar, Sénégal</li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Suivez-nous</h4>
              <div className='flex gap-4'>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/></svg>
                </a>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44 0-.795-.644-1.44-1.439-1.44z'/></svg>
                </a>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className='border-t border-gray-700 pt-8 text-center'>
             <p className='text-gray-400'>© 2025 TANAL SA LOGEMENT. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;


