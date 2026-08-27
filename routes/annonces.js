const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Annonce = require('../models/Annonce');
const Quartier = require('../models/Quartier');

router.get('/', async (req, res) => {
  try {
    const { quartier, type, prixMin, prixMax, available } = req.query;
    const filter = { isVerified: true };
    if (quartier) filter.quartier = quartier;
    if (type) filter.type = type;
    if (prixMin || prixMax) {
      filter.prix = {};
      if (prixMin) filter.prix.$gte = Number(prixMin);
      if (prixMax) filter.prix.$lte = Number(prixMax);
    }
    if (available !== undefined) filter.isAvailable = available === 'true';
    const now = new Date();
    filter.$or = [
      { boostUntil: { $exists: false } },
      { boostUntil: null },
      { boostUntil: { $gt: now } },
    ];
    const annonces = await Annonce.find(filter).populate('bailleur', 'nom prenom email telephone').sort({ premium: -1, createdAt: -1 });
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id).populate('bailleur', 'nom prenom email telephone');
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titre, description, type, prix, quartier, images, isAvailable, proprietaire } = req.body;
    if (!req.body.bailleur) {
      req.body.bailleur = req.user.id;
    }
    if (quartier && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(quartier)) {
      return res.status(400).json({ message: 'Nom de quartier invalide' });
    }
    let quartierDoc = await Quartier.findOne({ nom: new RegExp('^' + quartier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (!quartierDoc && quartier) {
      quartierDoc = new Quartier({ nom: quartier.trim(), active: true });
      await quartierDoc.save();
    }
    const annonce = new Annonce({
      titre,
      description,
      type,
      prix,
      quartier: quartier ? quartier.trim() : quartier,
      images: images || [],
      bailleur: req.body.bailleur,
      proprietaire,
      isVerified: req.user.role === 'admin',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });
    await annonce.save();
    res.status(201).json(annonce);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titre, description, type, prix, quartier, images, isAvailable, proprietaire } = req.body;
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    annonce.titre = titre ?? annonce.titre;
    annonce.description = description ?? annonce.description;
    annonce.type = type ?? annonce.type;
    annonce.prix = prix ?? annonce.prix;
    annonce.quartier = quartier ?? annonce.quartier;
    annonce.images = images ?? annonce.images;
    annonce.isAvailable = isAvailable ?? annonce.isAvailable;
    annonce.proprietaire = proprietaire ?? annonce.proprietaire;
    await annonce.save();
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

