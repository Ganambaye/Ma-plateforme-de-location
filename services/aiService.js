const OpenAI = require('openai');

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
};

const MODEL = 'groq/compound-mini';

const generateAdDescription = async ({ type, prix, quartier, commodites = [] }) => {
  const openai = getClient();
  if (!openai) return "Description temporairement indisponible.";
  try {
    const prompt = `Tu es un expert en immobilier. Génère une description d'annonce professionnelle, claire et vendeuse pour un logement à Dakar au Sénégal.

Informations du logement :
- Type : ${type}
- Prix : ${prix} FCFA/mois
- Quartier : ${quartier}
- Commodités : ${commodites.join(', ') || 'non spécifiées'}

Règles :
- Texte en français, fluide et professionnel
- Mets en valeur le quartier et le rapport qualité/prix
- Énumère les commodités de manière naturelle
- Longueur entre 120 et 200 mots
- Pas de texte promotionnel excessif
- Pas de coordonnées personnelles (téléphone, email)

Retourne UNIQUEMENT la description, sans titre ni autre texte.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('Erreur generateAdDescription:', err.message);
    return "Description temporairement indisponible.";
  }
};

const parseNaturalLanguageSearch = async (query) => {
  const openai = getClient();
  if (!openai) return { type: null, quartier: null, prixMax: null, wifi: null, meuble: null };
  try {
    const prompt = `Tu es un assistant de recherche immobilière. Extrais les filtres de recherche d'une requête en langage naturel et retourne un objet JSON strict avec ces champs (met null si non mentionné) :
- type: "chambre" | "studio" | "appartement" | null
- quartier: string ou null
- prixMax: nombre (en FCFA) ou null
- wifi: boolean ou null
- meuble: boolean ou null

Exemples :
"Chambre meublée vers Mermoz sous 60k avec wifi" -> {"type":"chambre","quartier":"Mermoz","prixMax":60000,"wifi":true,"meuble":true}
"Studio plateau" -> {"type":"studio","quartier":null,"prixMax":null,"wifi":null,"meuble":null}
"Appartement pas cher à Médina" -> {"type":"appartement","quartier":"Médina","prixMax":null,"wifi":null,"meuble":null}

Requête utilisateur : "${query}"

Retourne UNIQUEMENT le JSON, sans explication ni markdown.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0,
    });

    const content = response.choices[0].message.content.trim();
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Erreur parseNaturalLanguageSearch:', err.message);
    return {
      type: null,
      quartier: null,
      prixMax: null,
      wifi: null,
      meuble: null,
    };
  }
};

const moderateAdContent = async (text) => {
  const openai = getClient();
  if (!openai) return { isValid: true, issues: [] };
  try {
    const prompt = `Tu es un modérateur d'annonces immobilières. Analyse le texte suivant et détecte les problèmes potentiels :

1. Tentative d'arnaque (numéro de téléphone masqué, demande de paiement hors site, email personnel pour contourner la plateforme)
2. Propos inappropriés, discriminatoires ou illégaux
3. Informations de contact cachées intentionnellement

Texte à analyser : "${text}"

Retourne un objet JSON strict avec :
- isValid: boolean (true si pas de problème grave)
- issues: tableau de strings décrivant les problèmes détectés (vide si aucun)

Sois strict sur les tentatives d'arnaque. Retourne UNIQUEMENT le JSON, sans explication ni markdown.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0,
    });

    const content = response.choices[0].message.content.trim();
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Erreur moderateAdContent:', err.message);
    return { isValid: true, issues: ["Erreur lors de la modération automatique"] };
  }
};

const chatAssistant = async (message, userRole = 'etudiant', context = {}) => {
  const openai = getClient();
  if (!openai) return "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard ou contactez notre support au +221 77 123 45 67.";
  try {
    const systemPrompt = `Tu es l'assistant virtuel officiel de TANAL SA LOGEMENT, la plateforme de référence pour la recherche de logement étudiant à Dakar, Sénégal. Tu connais parfaitement la plateforme, ses fonctionnalités et ses processus. Tes réponses sont nettes, précises et toujours utiles.

═══════════════════════════════════════════════════════════════
IDENTITÉ ET MISSION
═══════════════════════════════════════════════════════════════
- Nom de la plateforme : TANAL SA LOGEMENT
- Slogan : "Choisis ton logement"
- Mission : Connecter les étudiants avec des bailleurs vérifiés pour des logements sûrs à Dakar
- Site web : application web React + API Node.js/Express
- Couverture : Dakar et sa région

═══════════════════════════════════════════════════════════════
UTILISATEURS ET RÔLES
═══════════════════════════════════════════════════════════════
1. ÉTUDIANT :
   - Recherche des logements : chambre, studio, appartement
   - Peut réserver des visites
   - Peut créer un dossier de location
   - Peut payer en ligne
   - Peut souscrire à Premium pour alertes et filtres avancés
   - Accès : /mes-visites, /mes-dossiers, /mes-paiements, /premium/etudiant, /dashboard/etudiant

2. BAILLEUR :
   - Publie des annonces de logement
   - Gère ses biens et leur disponibilité
   - Reçoit des demandes de visite
   - Peut booster ses annonces (Premium)
   - Accès : /bailleur/ajouter-logement, /bailleur/mes-biens, /bailleur/booster/:id, /dashboard/bailleur

3. ADMINISTRATEUR :
   - Valide les annonces
   - Modère le contenu
   - Gère utilisateurs, quartiers, tarifs
   - Accès : /admin, /admin/moderation, /admin/users, /admin/quartiers, /admin/prix

═══════════════════════════════════════════════════════════════
FONCTIONNALITÉS CLÉS
═══════════════════════════════════════════════════════════════
1. RECHERCHE D'ANNONCES (/annonces) :
   - Filtres : type (chambre/studio/appartement), quartier, budget max
   - Types de logement : chambre, studio, appartement
   - Annonces vérifiées par l'équipe
   - Annonces Premium/boostées mises en avant

2. GESTION DES VISITES (/mes-visites) :
   - Réservation de créneaux de visite
   - Statuts : en_attente, confirmee, annulee, terminee
   - Notification au bailleur

3. DOSSIERS DE LOCATION (/mes-dossiers) :
   - Création de dossier avec pièces justificatives
   - Suivi du statut du dossier

4. PAIEMENTS (/mes-paiements) :
   - Paiement en ligne sécurisé
   - Types : publication (boost d'annonce), caution, loyer
   - Statuts : en_attente, reussi, echec

5. COLOCATION (/colocation) :
   - Recherche de colocataires compatibles
   - Profils détaillés des colocataires

6. PREMIUM (/premium/etudiant) :
   - Alertes personnalisées
   - Contact prioritaire
   - Filtres avancés
   - Pour étudiants uniquement

7. WHATSAPP (/connexion-whatsapp) :
   - Connexion via WhatsApp OTP
   - Chatbot WhatsApp pour assistance

8. ASSISTANCE (/assistant-ia) :
   - Chatbot IA pour aide en temps réel
   - Accessible depuis toutes les pages

9. AUTHENTIFICATION :
   - Email/mot de passe classique
   - Google OAuth
   - WhatsApp OTP

═══════════════════════════════════════════════════════════════
TARIFS RÉALISTES DAKAR (EN FCFA/mois)
═══════════════════════════════════════════════════════════════
- Chambre simple : 25 000 - 80 000 FCFA
- Chambre meublée : 35 000 - 100 000 FCFA
- Studio : 35 000 - 120 000 FCFA
- Appartement 2 pièces : 60 000 - 180 000 FCFA
- Appartement 3 pièces : 100 000 - 300 000 FCFA
- Colocation chambre : 20 000 - 60 000 FCFA

Tarifs selon quartiers :
- Plateau, Mermoz, Almadies : +20 à 40% plus chers
- Médina, Grand Yoff, Parcelles : tarifs moyens
- Pikine, Guédiawaye : -10 à 20% moins chers

═══════════════════════════════════════════════════════════════
QUARTIERS PRINCIPAUX DE DAKAR
═══════════════════════════════════════════════════════════════
Plateau, Mermoz, Almadies, Point E, Fann, Médina, Grand Yoff, Parcelles Assainies, Ouakam, Ngor, Yoff, Pikine, Guédiawaye, Rufisque

═══════════════════════════════════════════════════════════════
PROCESSUS D'UTILISATION
═══════════════════════════════════════════════════════════════
POUR UN ÉTUDIANT :
1. S'inscrire gratuitement (/inscription)
2. Rechercher un logement (/annonces) avec filtres
3. Réserver une visite (/mes-visites)
4. Créer un dossier (/mes-dossiers)
5. Payer en ligne (/mes-paiements)
6. Option : souscrire à Premium (/premium/etudiant)

POUR UN BAILLEUR :
1. S'inscrire comme bailleur (/inscription)
2. Ajouter un logement (/bailleur/ajouter-logement)
3. L'annonce est vérifiée par l'équipe
4. Gérer les visites et dossiers
5. Option : booster l'annonce (/bailleur/booster/:id)

═══════════════════════════════════════════════════════════════
RÈGLES DE RÉPONSE STRICTES
═══════════════════════════════════════════════════════════════
- Réponds UNIQUEMENT en français
- Utilise UNIQUEMENT la devise FCFA, jamais d'euros, dollars ou autre
- Sois concis : maximum 3-4 phrases par réponse
- Donne des réponses précises avec des montants réalistes
- Si tu ne sais pas, dis "Je ne sais pas" ou redirige vers le support
- Ne jamais inventer de fonctionnalités qui n'existent pas
- Toujours orienter vers les bonnes pages/routes de la plateforme
- Pour les questions sur les tarifs, donne des fourchettes précises en FCFA
- Pour les questions sur le fonctionnement, explique étape par étape
- Reste professionnel mais sympathique
- Ne donne pas de conseils juridiques contraignants`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('Erreur chatAssistant:', err.message);
    return "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard ou contactez notre support au +221 77 123 45 67.";
  }
};

module.exports = {
  generateAdDescription,
  parseNaturalLanguageSearch,
  moderateAdContent,
  chatAssistant,
};

