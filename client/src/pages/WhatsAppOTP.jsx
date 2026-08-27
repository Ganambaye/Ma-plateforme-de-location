import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function WhatsAppOTP() {
  const [telephone, setTelephone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/whatsapp-otp', { telephone });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur envoi OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-whatsapp-otp', { telephone, code });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Code OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full opacity-0 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]'>
        <div className='bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-900/5 border border-white/60 overflow-hidden'>
          <div className='text-center pt-10 pb-6 px-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl mb-4 shadow-lg shadow-green-200'>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Connexion WhatsApp</h2>
            <p className='text-gray-500 text-sm'>Recevez un code OTP sur WhatsApp</p>
          </div>

          {error && (
            <div className='bg-red-50/80 backdrop-blur text-red-600 p-4 mx-8 mb-6 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-scale-in'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={sendOTP} className='px-8 pb-8 space-y-5'>
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Numéro WhatsApp</label>
              <input
                type='tel'
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className='input-field'
                placeholder='+221 77 000 00 00'
                required
              />
            </div>

            {!sent ? (
              <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'>
                {loading ? (
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Envoyer le code OTP
                  </>
                )}
              </button>
            ) : (
              <>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Code OTP</label>
                  <input
                    type='text'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className='input-field'
                    placeholder='Entrez le code reçu'
                    required
                    maxLength={4}
                  />
                </div>
                <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="none" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Valider le code
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          <div className='px-8 pb-6 text-center'>
            <Link to='/connexion' className='text-primary font-medium hover:underline text-sm inline-flex items-center gap-1 transition-colors'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppOTP;
