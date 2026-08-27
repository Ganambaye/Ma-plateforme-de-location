const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Dossier = require('../models/Dossier');

router.get('/mes-dossiers', auth, async (req, res) => {
  try {
    const dossiers = await Dossier.find({ etudiant: req.user.id })
      .populate('annonce', 'titre description type prix quartier images isAvailable')
      .sort({ createdAt: -1 });
    res.json(dossiers);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { annonceId } = req.body;
    const dossier = new Dossier({ etudiant: req.user.id, annonce: annonceId, statut: 'en_attente' });
    await dossier.save();
    await dossier.populate('annonce', 'titre description type prix quartier images isAvailable');
    res.status(201).json(dossier);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.put('/:id/statut', auth, async (req, res) => {
  try {
    const { statut } = req.body;
    const dossier = await Dossier.findById(req.params.id);
    if (!dossier) return res.status(404).json({ message: 'Dossier non trouvé' });
    dossier.statut = statut;
    await dossier.save();
    await dossier.populate('annonce', 'titre description type prix quartier images isAvailable');
    res.json(dossier);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const dossiers = await Dossier.find()
      .populate('etudiant', 'nom prenom email telephone etablissement')
      .populate('annonce', 'titre description type prix quartier')
      .sort({ createdAt: -1 });
    res.json(dossiers);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
