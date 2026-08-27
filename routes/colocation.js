const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Colocation = require('../models/Colocation');

router.get('/', auth, async (req, res) => {
  try {
    const colocations = await Colocation.find().populate('etudiant', 'nom prenom email telephone etablissement');
    res.json(colocations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { budgetMax, quartierRecherche, description, statut } = req.body;
    const colocation = new Colocation({ etudiant: req.user.id, budgetMax, quartierRecherche, description, statut: statut || 'cherche' });
    await colocation.save();
    res.status(201).json(colocation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
