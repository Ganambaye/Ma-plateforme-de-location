import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AnnonceCard from '../components/AnnonceCard';
import { annonceService } from '../services/annonceService';
import { filtersService } from '../services/filtersService';

function AnnonceList() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quartiers, setQuartiers] = useState([]);
  const [prixs, setPrixs] = useState([]);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    quartier: searchParams.get('quartier') || '',
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
  });

  const fetchFilterOptions = async () => {
    try {
      const { quartiers: q, prix: p } = await filtersService.getAllOptions();
      setQuartiers(q);
      setPrixs(p);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const res = await annonceService.getAll(filters);
      setAnnonces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchAnnonces();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAnnonces();
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header Section */}
        <div className='text-center mb-12 animate-fade-in-up'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>Nos annonces</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Découvrez toutes nos offres de logement vérifiées à Dakar
          </p>
          {annonces.length > 0 && !loading && (
            <p className='text-primary font-medium mt-2'>{annonces.length} annonce{annonces.length > 1 ? 's' : ''} disponible{annonces.length > 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Filter Bar */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100 animate-fade-in-up animation-delay-200'>
          <form onSubmit={handleFilter}>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-800'>Filtrer les annonces</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Type de logement</label>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className='input-field'>
                  <option value=''>Tous les types</option>
                  <option value='chambre'>Chambre</option>
                  <option value='studio'>Studio</option>
                  <option value='appartement'>Appartement</option>
                </select>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Quartier</label>
                <select value={filters.quartier} onChange={(e) => setFilters({ ...filters, quartier: e.target.value })} className='input-field'>
                  <option value=''>Tous les quartiers</option>
                  {quartiers.map((q) => (
                    <option key={q._id} value={q.nom}>{q.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Budget (FCFA/mois)</label>
                <select value={filters.prixMax} onChange={(e) => {
                  const selected = prixs.find(p => String(p.max) === e.target.value);
                  setFilters({
                    ...filters,
                    prixMax: selected ? String(selected.max) : '',
                    prixMin: selected ? String(selected.min) : '',
                  });
                }} className='input-field'>
                  <option value=''>Tous les prix</option>
                  {prixs.map((p) => (
                    <option key={p._id} value={p.max}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className='flex items-end'>
                <button type='submit' className='btn-primary w-full flex items-center justify-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className='space-y-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse'>
                <div className='h-48 bg-gray-200'></div>
                <div className='p-6 space-y-4'>
                  <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-full'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        ) : annonces.length === 0 ? (
          <div className='text-center py-20 animate-fade-in-up'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full mb-6'>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>Aucune annonce trouvée</h3>
            <p className='text-gray-600 mb-6'>Essayez de modifier vos critères de recherche</p>
            <Link to='/annonces' className='btn-primary inline-flex items-center gap-2'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser les filtres
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {annonces.map((a) => (
              <AnnonceCard key={a._id} annonce={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnonceList;