const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ambassadeur = require('../models/Ambassadeur');

router.get('/contrats', auth, async (req, res) => {
  try {
    const ambassadeurs = await Ambassadeur.find()
      .populate('utilisateur', 'nom prenom email telephone')
      .sort({ createdAt: -1 });
    res.json(ambassadeurs);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/paiements', auth, async (req, res) => {
  try {
    const { contratId } = req.body;
    const ambassadeur = await Ambassadeur.findById(contratId);
    if (!ambassadeur) return res.status(404).json({ message: 'Contrat introuvable' });
    ambassadeur.paiementEffectue = true;
    ambassadeur.datePaiement = new Date();
    await ambassadeur.save();
    await ambassadeur.populate('utilisateur', 'nom prenom email telephone');
    res.json({ message: 'Paiement déclenché', ambassadeur });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { utilisateurId, codeParrainage } = req.body;
    let ambassadeur = await Ambassadeur.findOne({ codeParrainage });
    if (ambassadeur) return res.status(400).json({ message: 'Code parrainage déjà utilisé' });
    ambassadeur = new Ambassadeur({ utilisateur: utilisateurId, codeParrainage });
    await ambassadeur.save();
    res.status(201).json(ambassadeur);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
