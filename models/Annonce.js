const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema(
  {
    titre: { type: String, required: [true, 'Le titre est obligatoire'] },
    description: { type: String, required: [true, 'La description est obligatoire'] },
    type: { type: String, enum: ['chambre', 'studio', 'appartement'], required: [true, 'Le type est obligatoire'] },
    prix: { type: Number, required: [true, 'Le prix est obligatoire'], min: [0, 'Le prix doit être positif'] },
    quartier: { type: String, required: [true, 'Le quartier est obligatoire'] },
    images: { type: [String], default: [] },
    bailleur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    proprietaire: { type: String },
    premium: { type: Boolean, default: false },
    boostUntil: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Annonce', annonceSchema);
