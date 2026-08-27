import { useState } from 'react';
import api from '../services/api';

function Contact() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', objet: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      setForm({ nom: '', prenom: '', email: '', telephone: '', objet: '', message: '' });
    } catch {
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    }
  };

  const faqs = [
    { q: 'Comment obtenir le label "Logement Vérifié" ?', a: 'Nos équipes visitent physiquement chaque logement et vérifient les documents du propriétaire. Le label est attribué après validation.' },
    { q: 'À quel moment dois-je payer les 20 000 FCFA ?', a: 'Les frais de 20 000 FCFA sont prélevés seulement après acceptation de votre dossier par le propriétaire, avant signature du bail.' },
    { q: 'Puis-je annuler une réservation ?', a: 'Oui, vous pouvez annuler jusqu\'à 48h avant la date de visite. Passé ce délai, des frais peuvent s\'appliquer.' },
    { q: 'Comment contacter un propriétaire ?', a: 'Utilisez le bouton "Contacter" sur la fiche du logement. Vous pouvez également envoyer une demande de visite directement depuis votre tableau de bord.' },
    { q: 'Quels sont les frais de la plateforme ?', a: 'TANAL SA LOGEMENT ne prélève aucun frais pour la recherche. Seuls 20 000 FCFA sont facturés une fois votre dossier accepté, pour couvrir les vérifications.' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <section className='bg-dark text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Contact & Aide</h1>
          <p className='text-xl text-gray-300'>Nous sommes là pour vous accompagner</p>
        </div>
      </section>

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Nos coordonnées</h2>
            <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100 space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>Adresse</p>
                  <p className='text-gray-600'>Liberté 6, Dakar, Sénégal</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-secondary flex-shrink-0'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' /></svg>
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>Téléphone / WhatsApp</p>
                  <a href='tel:+221771234567' className='text-primary hover:underline'>+221 77 123 45 67</a>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg>
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>Email</p>
                  <a href='mailto:contact@tanal-sa-logement.sn' className='text-primary hover:underline'>contact@tanal-sa-logement.sn</a>
                </div>
              </div>
            </div>
            <div className='mt-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100'>
              <iframe
                title='Map'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.123456789!2d-17.444!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQ0JzAwLjAiTiAxN8KwMjgnMDAuMCJF!5e0!3m2!1sfr!2ssn!4v1700000000000'
                width='100%'
                height='300'
                style={{ border: 0 }}
                allowFullScreen=''
                loading='lazy'
              ></iframe>
            </div>
          </div>

          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Envoyez-nous un message</h2>
            <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
              {submitted ? (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-8 h-8 text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                  </div>
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>Message envoyé !</h3>
                  <p className='text-gray-600'>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type='text' placeholder='Nom *' required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className='input-field' />
                    <input type='text' placeholder='Prénom *' required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className='input-field' />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type='email' placeholder='Email *' required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className='input-field' />
                    <input type='tel' placeholder='Téléphone' value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className='input-field' />
                  </div>
                  <select required value={form.objet} onChange={(e) => setForm({ ...form, objet: e.target.value })} className='input-field'>
                    <option value=''>Objet de la demande *</option>
                    <option value='etudiant'>Je suis étudiant et j'ai une question</option>
                    <option value='proprietaire'>Je suis propriétaire et je veux un partenariat</option>
                    <option value='bde'>Je représente un BDE / Une école</option>
                    <option value='bug'>Signalement d'un problème technique (Bug)</option>
                  </select>
                  <textarea placeholder='Votre message *' required rows='5' value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className='input-field resize-none'></textarea>
                  <button type='submit' className='btn-primary w-full'>Envoyer le message</button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Questions fréquentes</h2>
          <div className='max-w-3xl mx-auto space-y-3'>
            {faqs.map((faq, i) => (
              <div key={i} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className='w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition'>
                  <span className='font-medium text-gray-800'>{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' /></svg>
                </button>
                {openFaq === i && (
                  <div className='px-6 pb-4 text-gray-600 border-t border-gray-50 pt-3'>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-center text-white'>
          <h3 className='text-2xl font-bold mb-3'>Besoin d'une réponse en moins de 2 minutes ?</h3>
          <p className='mb-6 text-green-50'>Discutez avec notre assistant virtuel sur WhatsApp !</p>
          <a href='https://wa.me/221771234567' target='_blank' rel='noreferrer' className='inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105'>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/></svg>
            Ouvrir WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;


