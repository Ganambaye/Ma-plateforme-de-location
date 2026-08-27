const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { generateAdDescription, parseNaturalLanguageSearch, moderateAdContent, chatAssistant } = require('../services/aiService');
const Annonce = require('../models/Annonce');

router.post('/generate-description', auth, async (req, res) => {
  try {
    if (req.user.role !== 'bailleur' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : bailleurs uniquement' });
    }
    const { type, prix, quartier, commodites } = req.body;
    if (!type || !prix || !quartier) {
      return res.status(400).json({ message: 'Le type, le prix et le quartier sont obligatoires' });
    }
    const description = await generateAdDescription({
      type,
      prix: Number(prix),
      quartier,
      commodites: Array.isArray(commodites) ? commodites : [],
    });
    res.json({ description });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération de la description' });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'La requête de recherche est obligatoire' });
    }
    const filters = await parseNaturalLanguageSearch(query);

    const mongoFilter = { isVerified: true };
    if (filters.type) mongoFilter.type = filters.type;
    if (filters.quartier) mongoFilter.quartier = new RegExp(filters.quartier, 'i');
    if (filters.prixMax) mongoFilter.prix = { ...(mongoFilter.prix || {}), $lte: Number(filters.prixMax) };

    const now = new Date();
    mongoFilter.$or = [
      { boostUntil: { $exists: false } },
      { boostUntil: null },
      { boostUntil: { $gt: now } },
    ];

    let annonces = await Annonce.find(mongoFilter).populate('bailleur', 'nom prenom email telephone').sort({ premium: -1, createdAt: -1 });

    if (filters.wifi || filters.meuble) {
      annonces = annonces.filter(a => {
        const desc = (a.description || '').toLowerCase();
        if (filters.wifi && !desc.includes('wifi') && !desc.includes('internet') && !desc.includes('wi-fi')) return false;
        if (filters.meuble && !desc.includes('meubl')) return false;
        return true;
      });
    }

    res.json({ filters, annonces });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche intelligente' });
  }
});

router.post('/moderate', auth, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Le texte à modérer est obligatoire' });
    }
    const result = await moderateAdContent(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modération' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, role = 'etudiant', context = {} } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Le message est obligatoire' });
    }
    const reply = await chatAssistant(message, role, context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chat', reply: 'Désolé, je rencontre un problème technique.' });
  }
});

module.exports = router;
