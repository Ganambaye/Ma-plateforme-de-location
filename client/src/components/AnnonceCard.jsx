import { Link } from 'react-router-dom';
const defaultImage = 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600';

function AnnonceCard({ annonce }) {
  return (
    <div className='group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col'>
      <div className='relative overflow-hidden'>
        {annonce.images && annonce.images.length > 0 ? (
          <img src={annonce.images[0]} alt={annonce.titre} className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300' />
        ) : (
          <img src={defaultImage} alt={annonce.titre} className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300' />
        )}
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='bg-primary text-white px-3 py-1 rounded-full text-xs capitalize font-medium'>{annonce.type}</span>
          {annonce.premium && (
            <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Premium
            </span>
          )}
        </div>
        <div className='absolute top-3 right-3'>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${annonce.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {annonce.isAvailable ? 'Disponible' : 'Non disponible'}
          </span>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-1'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary transition'>{annonce.titre}</h3>
        <p className='text-gray-600 text-sm mb-3 line-clamp-2 flex-1'>{annonce.description}</p>

        <div className='flex items-center justify-between mb-3'>
           <span className='text-green-600 font-bold text-lg'>{(annonce.prix || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois</span>
          <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium'>{annonce.quartier}</span>
        </div>

        <div className='flex gap-2 mb-4'>
          {annonce.isVerified && (
            <span className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Vérifié
            </span>
          )}
          <span className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium capitalize'>{annonce.type}</span>
        </div>

        <Link
          to={`/annonces/${annonce._id}`}
          className='btn-primary w-full text-center flex items-center justify-center gap-2'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Voir détails
        </Link>
      </div>
    </div>
  );
}

export default AnnonceCard;