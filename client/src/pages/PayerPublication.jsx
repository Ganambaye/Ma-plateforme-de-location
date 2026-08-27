import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PUBLICATION_PRICE = 5000;

const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave', color: 'bg-blue-500', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  { id: 'orange_money', label: 'Orange Money', color: 'bg-orange-500', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'espece', label: 'Espèce', color: 'bg-green-500', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
];

function PayerPublication() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      await api.post('/paiements/publication', { annonceId: id, methode, reference });
      setSuccess('Paiement effectué avec succès ! Votre annonce est maintenant en tête de liste.');
      setTimeout(() => navigate('/bailleur/mes-biens'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-light flex items-center justify-center py-12 px-4'>
      <div className='max-w-lg w-full'>
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl mb-4'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Booster votre annonce</h2>
            <p className='text-gray-600 text-sm'>Mettez votre annonce en tête de liste pendant 7 jours</p>
          </div>

          <div className='bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-700 font-medium'>Publication premium (7 jours)</span>
              <span className='text-2xl font-bold text-gray-800'>{PUBLICATION_PRICE.toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA</span>
            </div>
          </div>

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
              <p className='text-xs text-gray-500 mt-1'>Entrez la référence de votre transaction Wave/Orange Money</p>
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
                'Payé !'
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payer {PUBLICATION_PRICE.toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA
                </>
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <button onClick={() => navigate(-1)} className='text-sm text-gray-500 hover:text-gray-700'>
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayerPublication;
