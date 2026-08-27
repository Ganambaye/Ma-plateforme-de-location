const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce' },
  cibleType: { type: String, enum: ['logement', 'plateforme'], required: true },
  note: { type: Number, required: true, min: 1, max: 5 },
  commentaire: { type: String, required: true },
  estApprouve: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Avis', avisSchema);
