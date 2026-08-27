const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce' },
  dossier: { type: mongoose.Schema.Types.ObjectId, ref: 'Dossier' },
  montant: { type: Number, required: true },
  methode: { type: String, enum: ['wave', 'orange_money', 'espece'], required: true },
  reference: { type: String, required: true, unique: true },
  type: { type: String, enum: ['dossier', 'publication', 'abonnement'], default: 'dossier' },
  statut: { type: String, enum: ['en_attente', 'reussi', 'echoue', 'rembourse'], default: 'en_attente' },
  commissionBDE: { type: Number, default: 0 },
  ambassadeurBDE: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTransaction: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Paiement', paiementSchema);
