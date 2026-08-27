const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Avis = require('../models/Avis');

router.get('/logement/:annonceId', async (req, res) => {
  try {
    const avis = await Avis.find({ annonce: req.params.annonceId, cibleType: 'logement', estApprouve: true }).populate('auteur', 'nom prenom');
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/plateforme', async (req, res) => {
  try {
    const avis = await Avis.find({ cibleType: 'plateforme', estApprouve: true }).populate('auteur', 'nom prenom').sort({ createdAt: -1 }).limit(20);
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { annonce, cibleType, note, commentaire } = req.body;
    const avis = new Avis({ auteur: req.user.id, annonce, cibleType, note, commentaire });
    await avis.save();
    res.status(201).json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const avis = await Avis.find().populate('auteur', 'nom prenom email').sort({ createdAt: -1 });
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.put('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });
    avis.estApprouve = req.body.estApprouve ?? avis.estApprouve;
    await avis.save();
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/:id/approuver', auth, isAdmin, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });
    avis.estApprouve = true;
    await avis.save();
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/:id/rejeter', auth, isAdmin, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });
    avis.estApprouve = false;
    await avis.save();
    res.json(avis);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
