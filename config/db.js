const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connecte : ' + mongoose.connection.host);
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB deconnecte, tentative de reconnexion...');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnecte : ' + mongoose.connection.host);
    });
  } catch (error) {
    console.error('Erreur MongoDB : ' + error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
