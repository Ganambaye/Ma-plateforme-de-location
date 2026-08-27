const mongoose = require('mongoose');

const ambassadeurSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  codeParrainage: { type: String, required: true, unique: true },
  nombreContrats: { type: Number, default: 0 },
  commissionBDE: { type: Number, default: 2000 },
  paiementEffectue: { type: Boolean, default: false },
  datePaiement: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Ambassadeur', ambassadeurSchema);
