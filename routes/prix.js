const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Prix = require('../models/Prix');

router.get('/', async (req, res) => {
  try {
    const prixs = await Prix.find({ active: true }).sort({ max: 1 });
    res.json(prixs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const prixs = await Prix.find().sort({ createdAt: -1 });
    res.json(prixs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { label, min, max } = req.body;
    const prix = new Prix({ label, min: Number(min) || 0, max: Number(max) });
    await prix.save();
    res.status(201).json(prix);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const prix = await Prix.findById(req.params.id);
    if (!prix) return res.status(404).json({ message: 'Prix non trouvé' });
    prix.label = req.body.label ?? prix.label;
    prix.min = req.body.min ?? prix.min;
    prix.max = req.body.max ?? prix.max;
    await prix.save();
    res.json(prix);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const prix = await Prix.findById(req.params.id);
    if (!prix) return res.status(404).json({ message: 'Prix non trouvé' });
    prix.active = !prix.active;
    await prix.save();
    res.json(prix);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const prix = await Prix.findById(req.params.id);
    if (!prix) return res.status(404).json({ message: 'Prix non trouvé' });
    await prix.deleteOne();
    res.json({ message: 'Prix supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
