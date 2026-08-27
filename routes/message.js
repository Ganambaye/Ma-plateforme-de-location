const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { expediteur: req.user.id, destinataire: req.params.userId },
        { expediteur: req.params.userId, destinataire: req.user.id },
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { destinataire, contenu, annonce } = req.body;
    const message = new Message({ expediteur: req.user.id, destinataire, contenu, annonce });
    await message.save();
    res.status(201).json(message);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
