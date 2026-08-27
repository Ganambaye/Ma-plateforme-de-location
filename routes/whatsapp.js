const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Annonce = require('../models/Annonce');

const whatsappLogs = [];

router.get('/annonces-verifiees', async (req, res) => {
  try {
    const annonces = await Annonce.find({ isVerified: true, isAvailable: true }).populate('bailleur', 'nom prenom telephone').sort({ createdAt: -1 }).limit(50);
    const totalAnnonces = await Annonce.countDocuments({ isVerified: true });
    const annoncesDisponibles = await Annonce.countDocuments({ isVerified: true, isAvailable: true });
    const catalogue = annonces.map(a => ({
      id: a._id,
      titre: a.titre,
      prix: a.prix,
      quartier: a.quartier,
      type: a.type,
      images: a.images.slice(0, 3),
      description: a.description.substring(0, 200) + '...',
      telephone: a.bailleur?.telephone,
    }));
    res.json({
      stats: { disponibles: annoncesDisponibles, reservees: totalAnnonces - annoncesDisponibles, total: totalAnnonces },
      annonces: catalogue,
      derniereMiseAJour: new Date(),
    });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/sync-catalogue', auth, async (req, res) => {
  try {
    const annonces = await Annonce.find({ isVerified: true, isAvailable: true }).sort({ createdAt: -1 }).limit(50);
    whatsappLogs.push({ date: new Date(), niveau: 'info', message: 'Catalogue synchronisé: ' + annonces.length + ' annonces publiées' });
    res.json({ message: 'Catalogue synchronisé avec succès', count: annonces.length });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/logs', auth, async (req, res) => {
  try {
    res.json(whatsappLogs);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const totalAnnonces = await Annonce.countDocuments({ isVerified: true });
    const annoncesDisponibles = await Annonce.countDocuments({ isVerified: true, isAvailable: true });
    const annoncesReservees = totalAnnonces - annoncesDisponibles;
    res.json({ totalAnnonces, annoncesDisponibles, annoncesReservees });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
