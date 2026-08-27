import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const HEURES = [
  { value: 'avant-22h', label: 'Avant 22h' },
  { value: '22h-23h', label: '22h - 23h' },
  { value: 'apres-23h', label: 'Après 23h' },
];

const COLLES_SIMULES = [
  {
    id: 1,
    prenom: 'Mariam',
    nom: 'Diallo',
    age: 22,
    fumeur: false,
    silence: true,
    tranquillite: false,
    heureCoucher: 'avant-22h',
    budgetMax: 60000,
    quartierPrefere: 'Plateau',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d21b6a7204?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    prenom: 'Omar',
    nom: 'Sow',
    age: 24,
    fumeur: true,
    silence: false,
    tranquillite: false,
    heureCoucher: 'apres-23h',
    budgetMax: 80000,
    quartierPrefere: 'Mermoz',
    photo: 'https://images.unsplash.com/photo-1507003211167-36376ac2963d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    prenom: 'Aïssatou',
    nom: 'Ndiaye',
    age: 21,
    fumeur: false,
    silence: true,
    tranquillite: true,
    heureCoucher: 'avant-22h',
    budgetMax: 50000,
    quartierPrefere: 'Médina',
    photo: 'https://images.unsplash.com/photo-1542917073-402563813746&w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    prenom: 'Boubacar',
    nom: 'Traoré',
    age: 25,
    fumeur: false,
    silence: true,
    tranquillite: false,
    heureCoucher: '22h-23h',
    budgetMax: 75000,
    quartierPrefere: 'Plateau',
    photo: 'https://images.unsplash.com/photo-1500648767913-a2b592767563&w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 5,
    prenom: 'Fatou',
    nom: 'Coulibaly',
    age: 23,
    fumeur: false,
    silence: false,
    tranquillite: false,
    heureCoucher: '22h-23h',
    budgetMax: 70000,
    quartierPrefere: 'Fann',
    photo: 'https://images.unsplash.com/photo-1519557814289-27292a3a0b9e?w=150&h=150&fit=crop&crop=face',
  },
];

function computeMatch(profil, coloc) {
  let score = 0;
  const prefs = [];

  if (coloc.fumeur === profil.fumeur) score += 20;
  prefs.push({ label: 'Fumeur/Non-fumeur', match: coloc.fumeur === profil.fumeur, max: 20 });

  if (coloc.silence === profil.silence) score += 20;
  prefs.push({ label: 'Étudie dans le silence / Supporte le bruit', match: coloc.silence === profil.silence, max: 20 });

  if (coloc.tranquillite === profil.tranquillite) score += 20;
  prefs.push({ label: 'Accepte les visites / Préfère la tranquillité', match: coloc.tranquillite === profil.tranquillite, max: 20 });

  if (coloc.heureCoucher === profil.heureCoucher) score += 15;
  else {
    const order = ['avant-22h', '22h-23h', 'apres-23h'];
    const diff = Math.abs(order.indexOf(coloc.heureCoucher) - order.indexOf(profil.heureCoucher));
    if (diff === 1) score += 7;
  }
  prefs.push({ label: 'Heure de coucher', match: coloc.heureCoucher === profil.heureCoucher, max: 15 });

  const budgetColoc = coloc.budgetMax || 0;
  const budgetUser = Number(profil.budgetMax) || 0;
  if (budgetUser >= budgetColoc * 0.8 && budgetUser <= budgetColoc * 1.2) score += 15;
  prefs.push({ label: 'Budget compatible', match: budgetUser >= budgetColoc * 0.8 && budgetUser <= budgetColoc * 1.2, max: 15 });

  if (
    profil.quartierPrefere &&
    coloc.quartierPrefere &&
    profil.quartierPrefere.toLowerCase() === coloc.quartierPrefere.toLowerCase()
  ) {
    score += 10;
  }
  prefs.push({ label: 'Quartier préféré', match: profil.quartierPrefere === coloc.quartierPrefere, max: 10 });

  return { score, pct: Math.round((score / 100) * 100), prefs };
}

function ProfilColocataire() {
  const { user } = useAuth();
  const [profil, setProfil] = useState({
    fumeur: false,
    silence: false,
    tranquillite: false,
    heureCoucher: '',
    budgetMax: '',
    quartierPrefere: '',
  });
  const [resultats, setResultats] = useState([]);
  const [recherche, setRecherche] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfil((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRecherche = () => {
    setRecherche(true);
    const results = COLLES_SIMULES.map((coloc) => {
      const { score, pct, prefs } = computeMatch(profil, coloc);
      return { ...coloc, score, pct, prefs };
    }).sort((a, b) => b.pct - a.pct);
    setResultats(results);
  };

  useEffect(() => {
    if (user) {
      setProfil((prev) => ({ ...prev, nom: user.nom, prenom: user.prenom }));
    }
  }, [user]);

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12 animate-fade-in-up'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>Trouver un colocataire</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Répondez au questionnaire de style de vie et trouvez des colocataires compatibles
          </p>
        </div>

        {!recherche ? (
          <div className='max-w-3xl mx-auto animate-fade-in-up animation-delay-200'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
              <div className='p-6 border-b border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className='text-xl font-bold text-gray-800'>Questionnaire de style de vie</h2>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleRecherche(); }} className='p-6 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='border border-gray-200 rounded-xl p-4'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='fumeur'
                        checked={profil.fumeur}
                        onChange={handleChange}
                        className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>Je suis fumeur</span>
                    </label>
                  </div>
                  <div className='border border-gray-200 rounded-xl p-4'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='silence'
                        checked={profil.silence}
                        onChange={handleChange}
                        className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>J'aime étudier dans le silence</span>
                    </label>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='border border-gray-200 rounded-xl p-4'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='tranquillite'
                        checked={profil.tranquillite}
                        onChange={handleChange}
                        className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>J'accepte les visites</span>
                    </label>
                  </div>
                  <div className='border border-gray-200 rounded-xl p-4'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='tranquillite'
                        checked={!profil.tranquillite && profil.tranquillite === false}
                        onChange={() => setProfil((prev) => ({ ...prev, tranquillite: false }))}
                        className='w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>Je préfère la tranquillité</span>
                    </label>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Heure de coucher</label>
                    <select name='heureCoucher' value={profil.heureCoucher} onChange={handleChange} className='input-field'>
                      <option value=''>Sélectionner</option>
                      {HEURES.map((h) => (
                        <option key={h.value} value={h.value}>{h.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-gray-700 text-sm font-medium mb-2'>Budget max (FCFA/mois)</label>
                    <input
                      type='number'
                      name='budgetMax'
                      value={profil.budgetMax}
                      onChange={handleChange}
                      min='0'
                      className='input-field'
                      placeholder='Ex: 60000'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>Quartier préféré</label>
                  <input
                    type='text'
                    name='quartierPrefere'
                    value={profil.quartierPrefere}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='Ex: Plateau, Mermoz...'
                  />
                </div>

                <button
                  type='submit'
                  disabled={!profil.budgetMax || !profil.heureCoucher || !profil.quartierPrefere}
                  className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Trouver des colocataires
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className='animate-fade-in-up animation-delay-200'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Résultats de la recherche</h2>
              <button onClick={() => setRecherche(false)} className='text-primary font-medium text-sm hover:underline flex items-center gap-1'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                </svg>
                Nouveau critique
              </button>
            </div>

            {resultats.filter((r) => r.pct >= 40).length === 0 ? (
              <div className='bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className='text-gray-500'>Aucun colocataire compatible trouvé</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {resultats.filter((r) => r.pct >= 40).map((coloc) => (
                  <div key={coloc.id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                    <div className='p-6'>
                      <div className='flex items-start gap-5'>
                        <img src={coloc.photo} alt={coloc.prenom} className='w-20 h-20 rounded-full object-cover border-2 border-gray-100' />
                        <div className='flex-1'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h3 className='text-xl font-semibold text-gray-800'>{coloc.prenom} {coloc.nom}</h3>
                              <p className='text-sm text-gray-600 mb-2'>{coloc.age} ans</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              coloc.pct >= 80
                                ? 'bg-green-100 text-green-800'
                                : coloc.pct >= 60
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {coloc.pct}% compatible
                            </span>
                          </div>

                          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm'>
                            <span className={`px-3 py-1 rounded-full ${coloc.fumeur ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
                              {coloc.fumeur ? 'Fumeur' : 'Non-fumeur'}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${coloc.silence ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'}`}>
                              {coloc.silence ? 'Silence' : 'Supporte le bruit'}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${!coloc.tranquillite ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                              {coloc.tranquillite ? 'Tranquillité' : 'Accepte les visites'}
                            </span>
                            <span className='px-3 py-1 rounded-full bg-gray-50 text-gray-700'>
                              Coucher : {HEURES.find((h) => h.value === coloc.heureCoucher)?.label}
                            </span>
                            <span className='px-3 py-1 rounded-full bg-green-50 text-green-700'>
                              {(coloc.budgetMax || 0).toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA/mois
                            </span>
                            <span className='px-3 py-1 rounded-full bg-purple-50 text-purple-700'>
                              {coloc.quartierPrefere}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilColocataire;
