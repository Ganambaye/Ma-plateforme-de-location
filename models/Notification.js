const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titre: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['visite', 'paiement', 'annonce', 'colocation', 'admin', 'systeme'], default: 'systeme' },
  lu: { type: Boolean, default: false },
  lien: { type: String },
  donnees: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
