import { useState, useEffect } from "react";
import AnnonceCard from "../components/AnnonceCard";
import { annonceService } from "../services/annonceService";

function AnnonceList({ limit }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await annonceService.getAll();
        const data = limit ? res.data.slice(0, limit) : res.data;
        setAnnonces(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(limit || 6)].map((_, i) => (
          <div key={i} className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse'>
            <div className='h-48 bg-gray-200'></div>
            <div className='p-5 space-y-3'>
              <div className='h-6 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-full'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (annonces.length === 0) {
    return (
      <div className='text-center py-16'>
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full mb-6'>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className='text-gray-500 text-lg'>Aucune annonce disponible</p>
        <p className='text-gray-400 text-sm mt-1'>Revenez plus tard pour découvrir de nouveaux logements</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {annonces.map((a) => (
        <AnnonceCard key={a._id} annonce={a} />
      ))}
    </div>
  );
}

export default AnnonceList;