const mongoose = require('mongoose');

const prixSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prix', prixSchema);
