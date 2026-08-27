require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const annonceRoutes = require('./routes/annonces');
const adminRoutes = require('./routes/admin');
const colocationRoutes = require('./routes/colocation');
const visiteRoutes = require('./routes/visite');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notification');
const avisRoutes = require('./routes/avis');
const paiementRoutes = require('./routes/paiement');
const messageRoutes = require('./routes/message');
const whatsappRoutes = require('./routes/whatsapp');
const dossierRoutes = require('./routes/dossier');
const ambassadeurRoutes = require('./routes/ambassadeur');
const quartierRoutes = require('./routes/quartier');
const prixRoutes = require('./routes/prix');
const aiRoutes = require('./routes/ai');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/colocations', colocationRoutes);
app.use('/api/visites', visiteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/ambassadeurs', ambassadeurRoutes);
app.use('/api/quartiers', quartierRoutes);
app.use('/api/prix', prixRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur TANAL SA LOGEMENT API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Serveur SAMA Logement demarre sur le port ' + PORT);
});

module.exports = app;
