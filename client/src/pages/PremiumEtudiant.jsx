import { useState } from 'react';
import api from '../services/api';

const ABONNEMENT_PRICE = 2000;

const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave', color: 'bg-blue-500', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  { id: 'orange_money', label: 'Orange Money', color: 'bg-orange-500', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'espece', label: 'Espèce', color: 'bg-green-500', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
];

function PremiumEtudiant() {
  const [methode, setMethode] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!methode) {
      setError('Veuillez choisir une méthode de paiement');
      return;
    }
    if (!reference) {
      setError('Veuillez entrer une référence de transaction');
      return;
    }
    setLoading(true);
    try {
      await api.post('/paiements/abonnement', { methode, reference });
      setSuccess('Abonnement premium activé pour 30 jours !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Premium Étudiant</h1>
          <p className='text-xl text-gray-600'>Débloquez tous les avantages pour trouver votre logement idéal</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-4'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Alertes personnalisées</h3>
            <p className='text-sm text-gray-600'>Recevez une notification dès qu\'un logement correspond à vos critères</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-green-50 text-secondary rounded-xl flex items-center justify-center mx-auto mb-4'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Contact prioritaire</h3>
            <p className='text-sm text-gray-600'>Appelez les bailleurs directement sans délai</p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Filtres avancés</h3>
            <p className='text-sm text-gray-600'>Accédez à des critères de recherche exclusifs</p>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto'>
          <div className='bg-primary px-8 py-6 text-center'>
            <h2 className='text-2xl font-bold text-white'>Abonnement Mensuel</h2>
            <p className='text-blue-100 mt-1'>Accès illimité à tous les avantages</p>
            <div className='mt-4'>
              <span className='text-4xl font-bold text-white'>{ABONNEMENT_PRICE.toLocaleString('fr-FR').replace(/\s/g, '.')}</span>
              <span className='text-blue-100 ml-2'>FCFA/mois</span>
            </div>
          </div>

          <div className='p-8'>
            {error && (
              <div className='bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 mb-6'>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className='bg-green-50 text-green-600 p-4 rounded-xl text-sm flex items-center gap-2 mb-6'>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-3'>Méthode de paiement</label>
                <div className='grid grid-cols-3 gap-3'>
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type='button'
                      onClick={() => setMethode(m.id)}
                      className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                        methode === m.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d={m.icon} />
                      </svg>
                      <span className='text-xs font-medium text-gray-700'>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Référence de transaction</label>
                <input
                  type='text'
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className='input-field'
                  placeholder='Ex: TXN123456'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading || success}
                className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50'
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : success ? (
                  'Actif !'
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    S\'abonner maintenant
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumEtudiant;
