const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Notification = require('../models/Notification');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ destinataire: req.user.id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { titre, message, type } = req.body;
    const users = await User.find({});
    const notifications = await Notification.insertMany(users.map(u => ({
      destinataire: u._id,
      titre,
      message,
      type: type || 'systeme',
      lien: '/',
    })));
    res.status(201).json({ message: 'Notification envoyée à ' + notifications.length + ' utilisateurs', count: notifications.length });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.put('/:id/lu', auth, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    notif.lu = true;
    await notif.save();
    res.json(notif);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/marquer-tout-lu', auth, async (req, res) => {
  try {
    await Notification.updateMany({ destinataire: req.user.id, lu: false }, { lu: true });
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification supprimée' });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
