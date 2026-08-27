const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  await connectDB();
  const email = 'Ganambaye2002@gmail.com';
  const password = 'Gana@2002';

  let user = await User.findOne({ email });
  if (user) {
    console.log('Utilisateur existe deja, mise a jour du role en admin...');
    user.role = 'admin';
    user.password = password;
    await user.save();
    console.log('Role admin applique a', email);
  } else {
    user = new User({
      nom: 'Admin',
      prenom: 'Teranga',
      email,
      telephone: '+221771234567',
      password,
      role: 'admin',
    });
    await user.save();
    console.log('Admin cree avec succes:', email);
  }

  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Erreur seed admin:', err);
  process.exit(1);
});
