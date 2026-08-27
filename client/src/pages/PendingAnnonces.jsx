import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

function PendingAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingAnnonces();
      setAnnonces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.verifyAnnonce(id);
      setAnnonces(annonces.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.deleteAnnonce(id);
      setAnnonces(annonces.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-fade-in-up'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Annonces en attente</h1>
          <p className='text-gray-600'>Validez ou rejetez les annonces soumises par les bailleurs</p>
        </div>

        {annonces.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100 animate-fade-in-up'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-4'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>Tout est en ordre !</h3>
            <p className='text-gray-600'>Aucune annonce en attente de validation.</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {annonces.map((a) => (
              <div key={a._id} className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='md:col-span-1'>
                    {a.images && a.images.length > 0 ? (
                      <img src={a.images[0]} alt={a.titre} className='w-full h-48 md:h-full object-cover' />
                    ) : (
                      <img src='https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600' alt={a.titre} className='w-full h-48 md:h-full object-cover' />
                    )}
                  </div>
                  <div className='md:col-span-2 p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-semibold text-gray-800 mb-1'>{a.titre}</h3>
                        <p className='text-gray-600 text-sm line-clamp-2'>{a.description}</p>
                      </div>
                      <span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-4'>
                        En attente
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-4 mb-4'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {(a.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
                        </svg>
                        {a.quartier}
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600 capitalize'>
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {a.type}
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <button onClick={() => handleApprove(a._id)} className='btn-secondary flex-1 flex items-center justify-center gap-2'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approuver
                      </button>
                      <button onClick={() => handleReject(a._id)} className='bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 flex-1'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingAnnonces;