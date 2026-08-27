import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/connexion");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/annonces', label: 'Annonces' },
    { to: '/colocation', label: 'Colocation' },
    { to: '/mes-visites', label: 'Mes visites', roles: ['etudiant'] },
    { to: '/premium/etudiant', label: 'Premium', roles: ['etudiant'] },
    { to: '/bailleur/mes-biens', label: 'Mes biens', roles: ['bailleur'] },
    { to: '/assistant-ia', label: 'Assistant IA', icon: '🤖' },
    { to: '/tableau-de-bord', label: 'Tableau de bord', roles: ['etudiant', 'bailleur'] },
    { to: '/connexion-whatsapp', label: 'WhatsApp', roles: ['etudiant', 'bailleur', 'admin'] },
    { to: '/admin', label: 'Admin', roles: ['admin'] },
    { to: '/admin/users', label: 'Utilisateurs', roles: ['admin'] },
    { to: '/admin/quartiers', label: 'Quartiers', roles: ['admin'] },
    { to: '/admin/prix', label: 'Prix', roles: ['admin'] },
  ];

  const visibleLinks = navLinks.filter(link => !link.roles || (user && link.roles.includes(user.role)));

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 nav-gradient-border' 
          : 'bg-white/70 backdrop-blur-lg shadow-sm'
      }`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div className='flex items-center'>
              <Link to='/' className='flex items-center gap-3 group relative'>
                <div className='relative w-12 h-12 logo-float'>
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300'></div>
                  <img src="/logo.svg" alt="TANAL SA LOGEMENT" className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className='hidden sm:block'>
                  <span className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 block leading-tight'>TANAL SA LOGEMENT</span>
                  <span className='text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-medium'>Choisis ton logement</span>
                </div>
              </Link>
            </div>

            <div className='hidden md:flex items-center gap-8'>
              <div className='flex items-center gap-1'>
                {visibleLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`nav-link-underline relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive(link.to)
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <span className='flex items-center gap-1.5'>
                      {link.icon && <span className='text-base'>{link.icon}</span>}
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className='flex items-center gap-3 ml-4'>
                {user ? (
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg avatar-glow'>
                        {user.prenom?.[0]}{user.nom?.[0]}
                      </div>
                      <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
                    </div>
                    <div className='hidden lg:block'>
                      <p className='text-sm font-semibold text-gray-900'>{user.prenom} {user.nom}</p>
                      <p className='text-xs text-gray-500 capitalize'>{user.role}</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className='relative px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-xl overflow-hidden group shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 btn-shimmer'
                    >
                      <span className='relative z-10'>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center gap-3'>
                    <Link 
                      to='/connexion' 
                      className='px-5 py-2.5 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100/80 transition-all duration-300 hover:text-blue-600'
                    >
                      Connexion
                    </Link>
                    <Link 
                      to='/inscription' 
                      className='relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl overflow-hidden group shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 btn-shimmer'
                    >
                      <span className='relative z-10'>Inscription</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className='md:hidden flex items-center'>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className='relative p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group'
              >
                <div className='w-6 h-5 relative flex items-center justify-center'>
                  <span className={`absolute w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                    mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}></span>
                  <span className={`absolute w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                    mobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}></span>
                  <span className={`absolute w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                    mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className='md:hidden mobile-menu-enter'>
            <div className='mx-4 mb-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
              <div className='px-4 py-4 space-y-1'>
                {visibleLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.to) 
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className='flex items-center gap-2'>
                      {link.icon && <span>{link.icon}</span>}
                      {link.label}
                    </span>
                  </Link>
                ))}
                <div className='border-t border-gray-100 pt-3 mt-3'>
                  {user ? (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg'>
                          {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                        <div>
                          <p className='text-sm font-semibold text-gray-900'>{user.prenom} {user.nom}</p>
                          <p className='text-xs text-gray-500 capitalize'>{user.role}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout} 
                        className='w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-2'
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <Link to='/connexion' className='block px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-200'>
                        Connexion
                      </Link>
                      <Link to='/inscription' className='block px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 text-center btn-shimmer'>
                        <span className='relative z-10'>Inscription</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <Link
        to='/assistant-ia'
        className='fixed bottom-8 right-8 z-50 group'
        title='Assistant IA'
      >
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-40 group-hover:opacity-70 animate-pulse'></div>
          <div className='relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center btn-shimmer'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Navbar;
