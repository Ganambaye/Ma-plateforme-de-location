const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcryptjs');
const Annonce = require('../models/Annonce');
const User = require('../models/User');
const Visite = require('../models/Visite');
const Paiement = require('../models/Paiement');

router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) return res.status(400).json({ message: 'Impossible de supprimer le dernier admin' });
    }
    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/users', auth, isAdmin, async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password, role, etablissement } = req.body;
    let user = await User.findOne({ email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
    if (user) return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    user = new User({ nom, prenom, email, telephone, password, role: role || 'etudiant', etablissement });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/pending-annonces', auth, isAdmin, async (req, res) => {
  try {
    const annonces = await Annonce.find({ isVerified: false }).populate('bailleur', 'nom prenom email telephone');
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/verify-annonce/:id', auth, isAdmin, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    annonce.isVerified = true;
    await annonce.save();
    res.json({ message: 'Annonce validée avec succès', annonce });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/annonces', auth, isAdmin, async (req, res) => {
  try {
    const annonces = await Annonce.find().populate('bailleur', 'nom prenom email telephone').sort({ createdAt: -1 });
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/annonces/:id', auth, isAdmin, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    await annonce.deleteOne();
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalEtudiants = await User.countDocuments({ role: 'etudiant' });
    const totalBailleurs = await User.countDocuments({ role: 'bailleur' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalAnnonces = await Annonce.countDocuments({});
    const annoncesActives = await Annonce.countDocuments({ isVerified: true, isAvailable: true });
    const annoncesReservees = await Annonce.countDocuments({ isVerified: true, isAvailable: false });
    const annoncesEnAttente = await Annonce.countDocuments({ isVerified: false });
    const visitesEnAttente = await Visite.countDocuments({ statut: 'en_attente' });
    const totalRevenus = await Paiement.aggregate([{ $match: { statut: 'reussi' } }, { $group: { _id: null, total: { $sum: '$montant' } } }]);
    const totalPublications = await Paiement.countDocuments({ statut: 'reussi', type: 'publication' });
    const revenusPublications = await Paiement.aggregate([{ $match: { statut: 'reussi', type: 'publication' } }, { $group: { _id: null, total: { $sum: '$montant' } } }]);
    res.json({
      totalEtudiants,
      totalBailleurs,
      totalAdmins,
      totalAnnonces,
      annoncesActives,
      annoncesReservees,
      annoncesEnAttente,
      visitesEnAttente,
      totalRevenus: totalRevenus[0]?.total || 0,
      totalPublications,
      revenusPublications: revenusPublications[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
