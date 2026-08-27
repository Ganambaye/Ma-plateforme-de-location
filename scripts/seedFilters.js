const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Quartier = require('../models/Quartier');
const Prix = require('../models/Prix');

const seedFilters = async () => {
  await connectDB();
  const quartiers = ['Plateau', 'Médina', 'Fann', 'Mermoz', 'Sacré-Cœur', 'Ottangel', 'Yoff', 'Ngor', 'Soumbédia', 'Bokobaru'];
  for (const q of quartiers) {
    await Quartier.updateOne({ nom: q }, { nom: q, active: true }, { upsert: true });
  }
  const prixs = [
    { label: 'Moins de 150 000 FCFA', min: 0, max: 150000 },
    { label: '150 000 - 250 000 FCFA', min: 150000, max: 250000 },
    { label: '250 000 - 400 000 FCFA', min: 250000, max: 400000 },
    { label: '400 000 - 600 000 FCFA', min: 400000, max: 600000 },
    { label: 'Plus de 600 000 FCFA', min: 600000, max: 10000000 },
  ];
  for (const p of prixs) {
    await Prix.updateOne({ max: p.max, label: p.label }, { ...p, active: true }, { upsert: true });
  }
  console.log('✓ Quartiers et prix initialisés');
  process.exit();
};

seedFilters().catch((err) => { console.error(err); process.exit(1); });
