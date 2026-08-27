const mongoose = require('mongoose');

const dossierSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce', required: true },
  statut: { type: String, enum: ['en_attente', 'valide', 'contrat_signe', 'rejete'], default: 'en_attente' },
  documents: { type: [String], default: [] },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Dossier', dossierSchema);
