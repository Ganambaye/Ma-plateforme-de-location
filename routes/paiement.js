const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Paiement = require('../models/Paiement');
const Annonce = require('../models/Annonce');
const User = require('../models/User');
const Notification = require('../models/Notification');

const PUBLICATION_PRICE = 5000;
const ABONNEMENT_PRICE = 2000;

router.post('/', auth, async (req, res) => {
  try {
    const { annonceId, montant, methode, reference, ambassadeurBDE, dossierId } = req.body;
    const annonce = annonceId ? await Annonce.findById(annonceId) : null;
    if (annonceId && !annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    let commission = 0;
    if (ambassadeurBDE) {
      commission = 2000;
      const ambassadeur = await User.findById(ambassadeurBDE);
      if (!ambassadeur || ambassadeur.role !== 'bailleur') {
        return res.status(400).json({ message: 'Code parrainage invalide' });
      }
    }
    const paiement = new Paiement({
      utilisateur: req.user.id,
      annonce: annonceId || null,
      dossier: dossierId || null,
      montant,
      methode,
      reference,
      type: 'dossier',
      commissionBDE: commission,
      ambassadeurBDE: ambassadeurBDE || null,
      statut: 'reussi',
      dateTransaction: new Date(),
    });
    await paiement.save();
    if (annonce) {
      annonce.isAvailable = false;
      await annonce.save();
    }
    await new Notification({
      destinataire: req.user.id,
      titre: 'Paiement confirmé',
      message: `Votre paiement de ${montant} FCFA a été confirmé.`,
      type: 'paiement',
      lien: '/mes-dossiers',
    }).save();
    res.status(201).json(paiement);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/publication', auth, async (req, res) => {
  try {
    const { annonceId, methode, reference } = req.body;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    if (annonce.bailleur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const paiement = new Paiement({
      utilisateur: req.user.id,
      annonce: annonceId,
      montant: PUBLICATION_PRICE,
      methode,
      reference,
      type: 'publication',
      statut: 'reussi',
      dateTransaction: new Date(),
    });
    await paiement.save();
    annonce.isVerified = true;
    annonce.premium = true;
    annonce.boostUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await annonce.save();
    await new Notification({
      destinataire: req.user.id,
      titre: 'Annonce boostée',
      message: `Votre annonce "${annonce.titre}" est maintenant en ligne et en tête de liste pour 7 jours.`,
      type: 'annonce',
      lien: '/bailleur/mes-biens',
    }).save();
    res.status(201).json(paiement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/abonnement', auth, async (req, res) => {
  try {
    const { methode, reference } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const paiement = new Paiement({
      utilisateur: req.user.id,
      montant: ABONNEMENT_PRICE,
      methode,
      reference,
      type: 'abonnement',
      statut: 'reussi',
      dateTransaction: new Date(),
    });
    await paiement.save();
    user.isPremium = true;
    user.premiumExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    await new Notification({
      destinataire: req.user.id,
      titre: 'Abonnement Premium activé',
      message: 'Votre abonnement étudiant premium est actif pour 30 jours.',
      type: 'systeme',
      lien: '/dashboard/etudiant',
    }).save();
    res.status(201).json(paiement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/mes-paiements', auth, async (req, res) => {
  try {
    const paiements = await Paiement.find({ utilisateur: req.user.id }).populate('annonce', 'titre quartier').sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const paiements = await Paiement.find().populate('utilisateur', 'nom prenom email').populate('annonce', 'titre quartier').populate('ambassadeurBDE', 'nom prenom email').sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/admin/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalRevenus = await Paiement.aggregate([{ $match: { statut: 'reussi' } }, { $group: { _id: null, total: { $sum: '$montant' } } }]);
    const totalCommissions = await Paiement.aggregate([{ $match: { statut: 'reussi' } }, { $group: { _id: null, total: { $sum: '$commissionBDE' } } }]);
    const totalPublications = await Paiement.countDocuments({ statut: 'reussi', type: 'publication' });
    const totalAbonnements = await Paiement.countDocuments({ statut: 'reussi', type: 'abonnement' });
    const countPaiements = await Paiement.countDocuments({ statut: 'reussi' });
    res.json({
      totalRevenus: totalRevenus[0]?.total || 0,
      totalCommissions: totalCommissions[0]?.total || 0,
      countPaiements,
      totalPublications,
      totalAbonnements,
    });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
