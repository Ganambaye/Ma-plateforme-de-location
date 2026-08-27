const mongoose = require('mongoose');

const colocationSchema = new mongoose.Schema(
  {
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    budgetMax: { type: Number, required: [true, 'Le budget maximum est obligatoire'], min: [0, 'Le budget doit être positif'] },
    quartierRecherche: { type: String, required: true },
    description: { type: String },
    statut: { type: String, enum: ['cherche', 'propose'], default: 'cherche' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Colocation', colocationSchema);
