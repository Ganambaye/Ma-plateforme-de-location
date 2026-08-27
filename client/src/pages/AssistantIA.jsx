import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AssistantIA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: 'Trouver un logement', message: "Je cherche un logement à Dakar. Peux-tu m'aider ?", icon: '🏠' },
    { label: 'Comment publier une annonce', message: "Comment puis-je publier une annonce en tant que bailleur ?", icon: '📝' },
    { label: 'Quartiers recommandés', message: "Quels sont les meilleurs quartiers pour étudiants à Dakar ?", icon: '📍' },
    { label: 'Tarifs et budget', message: "Quels sont les tarifs moyens pour une chambre à Dakar ?", icon: '💰' },
  ];

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: text,
        role: user?.role || 'etudiant',
        context: { page: 'assistant' },
      });
      const botMessage = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, je rencontre un problème technique. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (message) => {
    sendMessage(message);
  };

  const isFirstMessage = messages.length === 0;

  return (
    <div className='min-h-screen bg-light flex flex-col'>
      <div className='flex-1 max-w-3xl mx-auto w-full px-4 py-8'>
        <div className='mb-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl mb-4 shadow-lg'>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Assistant TANAL SA LOGEMENT</h1>
          <p className='text-gray-600'>Votre compagnon pour trouver le logement idéal à Dakar</p>
        </div>

        {isFirstMessage && (
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>Comment puis-je vous aider ?</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.message)}
                  className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-primary border border-transparent transition-all duration-200 text-left'
                >
                  <span className='text-2xl'>{action.icon}</span>
                  <span className='text-sm font-medium text-gray-700'>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='space-y-4'>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
              }`}>
                <p className='text-sm leading-relaxed whitespace-pre-wrap'>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className='flex justify-start'>
              <div className='bg-white border border-gray-100 rounded-2xl rounded-bl-md px-5 py-3 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-4'>
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) sendMessage(input.trim()); }}>
            <div className='flex gap-3'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Tapez votre message...'
                className='flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
                disabled={loading}
              />
              <button
                type='submit'
                disabled={loading || !input.trim()}
                className='bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssistantIA;

