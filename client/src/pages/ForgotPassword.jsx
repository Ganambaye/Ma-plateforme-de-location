import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message + ' (token: ' + res.data.resetToken + ')');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full animate-fade-in-up'>
        <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden'>
          <div className='text-center pt-10 pb-2 px-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200'>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Mot de passe oublié ?</h2>
            <p className='text-gray-500 text-sm'>Entrez votre email pour réinitialiser votre mot de passe</p>
          </div>

          {error && (
            <div className='bg-red-50/80 backdrop-blur text-red-600 p-4 mx-8 mb-6 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-scale-in'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className='bg-green-50/80 backdrop-blur text-green-600 p-4 mx-8 mb-6 rounded-xl text-sm flex items-center gap-2 border border-green-100 animate-scale-in'>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='p-8'>
            <div className='mb-6'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='input-field' required placeholder='votre@email.com' />
            </div>
            <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50'>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi...
                </>
              ) : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <div className='bg-gray-50/80 backdrop-blur px-8 py-5 text-center border-t border-gray-100'>
            <p className='text-gray-600 text-sm'>
              <Link to='/connexion' className='text-primary font-semibold hover:underline inline-flex items-center gap-1 transition-colors'>
                ← Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
