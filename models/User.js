const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: [true, 'Le nom est obligatoire'] },
    prenom: { type: String, required: [true, 'Le prenom est obligatoire'] },
    email: { type: String, required: [true, 'L\'email est obligatoire'], unique: true, lowercase: true, trim: true },
    telephone: { type: String, required: [true, 'Le telephone est obligatoire'] },
    password: { type: String, required: [true, 'Le mot de passe est obligatoire'], minlength: 6 },
    role: { type: String, enum: ['etudiant', 'bailleur', 'admin'], default: 'etudiant' },
    avatar: { type: String },
    etablissement: { type: String },
    cni: { type: String },
    piecesJustificatives: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    premiumExpire: { type: Date },
    adresse: { type: String },
    pays: { type: String, default: 'Sénégal' },
    paysResidence: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
