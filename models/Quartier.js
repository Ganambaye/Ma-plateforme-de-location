const mongoose = require('mongoose');

const quartierSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quartier', quartierSchema);
