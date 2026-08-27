import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { colocationService } from '../services/colocationService';

function Colocation() {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [form, setForm] = useState({ budgetMax: '', quartierRecherche: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({ quartier: '', budgetMin: '', budgetMax: '' });
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingList(true);
        const res = await colocationService.getAll();
        setAnnonces(res.data);
        setFilteredAnnonces(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = annonces;
    if (filters.quartier) {
      result = result.filter(c => c.quartierRecherche && c.quartierRecherche.toLowerCase().includes(filters.quartier.toLowerCase()));
    }
    if (filters.budgetMin) {
      result = result.filter(c => c.budgetMax >= Number(filters.budgetMin));
    }
    if (filters.budgetMax) {
      result = result.filter(c => c.budgetMax <= Number(filters.budgetMax));
    }
    setFilteredAnnonces(result);
  }, [filters, annonces]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!user) {
      setMessage('Veuillez vous connecter pour publier une demande.');
      return;
    }
    setSubmitting(true);
    try {
      await colocationService.create(form);
      setMessage('Demande publiée avec succès !');
      setForm({ budgetMax: '', quartierRecherche: '', description: '' });
      const res = await colocationService.getAll();
      setAnnonces(res.data);
    } catch (err) {
      setMessage('Erreur lors de la publication');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12 animate-fade-in-up'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>Colocation</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Trouvez ou proposez une colocation à Dakar</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Form Section */}
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in-up animation-delay-200'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>Publier une demande</h2>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 ${message.includes('succès') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Budget maximum (FCFA/mois)</label>
                <input
                  type='number'
                  name='budgetMax'
                  value={form.budgetMax}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='Ex: 50000'
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Quartier souhaité</label>
                <input
                  type='text'
                  name='quartierRecherche'
                  value={form.quartierRecherche}
                  onChange={handleChange}
                  className='input-field'
                  placeholder='Ex: Plateau, Médina...'
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Description</label>
                <textarea
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  rows='4'
                  className='input-field'
                  placeholder='Décrivez ce que vous cherchez...'
                ></textarea>
              </div>
              <button type='submit' disabled={submitting} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50'>
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publication...
                  </>
                ) : 'Publier ma demande'}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in-up animation-delay-400'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-green-50 text-secondary rounded-xl flex items-center justify-center'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>Demandes de colocation</h2>
            </div>

            {/* Filters */}
            <div className='bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100'>
              <div className='flex items-center gap-3 mb-3'>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className='text-sm font-semibold text-gray-700'>Filtrer les demandes</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-gray-700 text-xs font-medium mb-1'>Quartier</label>
                  <input
                    type='text'
                    placeholder='Ex: Plateau, Médina...'
                    value={filters.quartier}
                    onChange={(e) => setFilters({ ...filters, quartier: e.target.value })}
                    className='input-field'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-xs font-medium mb-1'>Budget min (FCFA)</label>
                  <input
                    type='number'
                    placeholder='Ex: 30000'
                    value={filters.budgetMin}
                    onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
                    className='input-field'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-xs font-medium mb-1'>Budget max (FCFA)</label>
                  <input
                    type='number'
                    placeholder='Ex: 80000'
                    value={filters.budgetMax}
                    onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                    className='input-field'
                  />
                </div>
              </div>
            </div>

            {loadingList ? (
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='border border-gray-100 rounded-xl p-4 animate-pulse'>
                    <div className='h-5 bg-gray-200 rounded w-1/3 mb-3'></div>
                    <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                  </div>
                ))}
              </div>
            ) : filteredAnnonces.length === 0 ? (
              <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4'>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className='text-gray-500'>Aucune demande de colocation pour le moment.</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredAnnonces.map((c) => (
                  <div key={c._id} className='border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-white'>
                    {c.etudiant ? (
                      <div>
                        <h3 className='font-semibold text-gray-800'>{c.etudiant.prenom} {c.etudiant.nom}</h3>
                        <p className='text-sm text-gray-600 mt-1'>Budget: {(c.budgetMax || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</p>
                        {c.quartierRecherche && <p className='text-sm text-gray-600'>Quartier: {c.quartierRecherche}</p>}
                        {c.description && <p className='text-sm text-gray-500 mt-2'>{c.description}</p>}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-600'>Demande #{c._id}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Colocation;