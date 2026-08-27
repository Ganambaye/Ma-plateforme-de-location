const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Visite = require('../models/Visite');
const Annonce = require('../models/Annonce');

router.post('/', auth, async (req, res) => {
  try {
    const { annonceId, dateVisite } = req.body;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    if (!annonce.isVerified || !annonce.isAvailable) return res.status(400).json({ message: 'Annonce non disponible pour une visite' });
    const visite = new Visite({ annonce: annonceId, etudiant: req.user.id, dateVisite, statut: 'en_attente' });
    await visite.save();
    res.status(201).json(visite);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/mes-visites', auth, async (req, res) => {
  try {
    const visites = await Visite.find({ etudiant: req.user.id }).populate('annonce', 'titre description type prix quartier isAvailable').populate('etudiant', 'nom prenom email telephone').sort({ dateVisite: -1 });
    res.json(visites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

  router.get('/mes-annonces', auth, async (req, res) => {
    try {
      const Annonce = require('../models/Annonce');
      const mesAnnonces = await Annonce.find({ bailleur: req.user.id }).select('_id');
      const annonceIds = mesAnnonces.map(a => a._id);
      const visites = await Visite.find({ annonce: { $in: annonceIds } })
        .populate('annonce', 'titre description type prix quartier isAvailable')
        .populate('etudiant', 'nom prenom email telephone etablissement adresse pays')
        .sort({ createdAt: -1 });
      res.json(visites);
    } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
  });

  router.get('/admin/visites', auth, isAdmin, async (req, res) => {
    try {
      const visites = await Visite.find().populate('annonce', 'titre description type prix quartier isAvailable').populate('etudiant', 'nom prenom email telephone etablissement adresse pays').sort({ createdAt: -1 });
      res.json(visites);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const visite = await Visite.findById(req.params.id);
    if (!visite) return res.status(404).json({ message: 'Visite non trouvée' });
    if (visite.etudiant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    if (visite.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Seules les visites en attente peuvent être annulées' });
    }
    visite.statut = 'rejetee';
    await visite.save();
    res.json(visite);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/admin/visites/:id/statut', auth, isAdmin, async (req, res) => {
  try {
    const { statut } = req.body;
    const visite = await Visite.findById(req.params.id);
    if (!visite) return res.status(404).json({ message: 'Visite non trouvée' });
    visite.statut = statut;
    await visite.save();
    if (statut === 'confirmee') {
      await Annonce.findByIdAndUpdate(visite.annonce, { isAvailable: false });
    }
    res.json(visite);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
