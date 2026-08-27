const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const diagnose = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'Ganambaye2002@gmail.com' });
  if (!user) {
    console.log('Utilisateur introuvable');
    return;
  }
  console.log('User found:', user.email);
  console.log('Role:', user.role);
  console.log('Password length:', user.password?.length);
  console.log('Password looks hashed:', user.password?.startsWith('$2a$') || user.password?.startsWith('$2b$'));

  const match = await bcrypt.compare('Gana@2002', user.password);
  console.log('Password match:', match);

  if (!match) {
    console.log('Rehashing password correctly...');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('Gana@2002', salt);
    await user.save();
    console.log('Password rehashed and saved');

    const match2 = await bcrypt.compare('Gana@2002', user.password);
    console.log('New password match:', match2);
  }

  process.exit(0);
};

diagnose().catch((err) => {
  console.error('Erreur diagnostic:', err);
  process.exit(1);
});
