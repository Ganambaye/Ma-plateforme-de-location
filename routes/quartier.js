const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Quartier = require('../models/Quartier');

router.get('/', async (req, res) => {
  try {
    const quartiers = await Quartier.find({ active: true }).sort({ nom: 1 });
    res.json(quartiers);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const quartiers = await Quartier.find().sort({ createdAt: -1 });
    res.json(quartiers);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { nom } = req.body;
    const quartier = new Quartier({ nom });
    await quartier.save();
    res.status(201).json(quartier);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ce quartier existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const quartier = await Quartier.findById(req.params.id);
    if (!quartier) return res.status(404).json({ message: 'Quartier non trouvé' });
    quartier.active = !quartier.active;
    await quartier.save();
    res.json(quartier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const quartier = await Quartier.findById(req.params.id);
    if (!quartier) return res.status(404).json({ message: 'Quartier non trouvé' });
    await quartier.deleteOne();
    res.json({ message: 'Quartier supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
