const mongoose = require('mongoose');

const visiteSchema = new mongoose.Schema(
  {
    annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce', required: true },
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateVisite: { type: Date, required: [true, 'La date de visite est obligatoire'] },
    statut: { type: String, enum: ['en_attente', 'confirmee', 'effectuee', 'rejetee'], default: 'en_attente' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visite', visiteSchema);
