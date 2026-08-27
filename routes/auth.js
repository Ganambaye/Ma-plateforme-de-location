
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require("../middleware/auth");
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const normalizePhone = (phone) => String(phone).replace(/[\s-]/g, '');

const isPhone = (value) => /^\+?\d+[\d\s-]*$/.test(String(value));

const findUserByIdentifier = async (identifier) => {
  if (isPhone(identifier)) {
    const digits = normalizePhone(identifier).replace(/^\+/, '');
    const withPlus = '+' + digits;
    const withoutPlus = digits;
    let user = await User.findOne({ telephone: withPlus });
    if (!user) user = await User.findOne({ telephone: withoutPlus });
    if (!user) user = await User.findOne({ telephone: normalizePhone(identifier) });
    return user;
  }
  return await User.findOne({ email: { $regex: new RegExp('^' + identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
};

const whatsappOTPs = {};

const cniStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cni-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const cniUpload = multer({
  storage: cniStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers images sont autorisés'), false);
    }
  }
});

router.post('/register', [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('prenom').notEmpty().withMessage('Le prenom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('telephone').notEmpty().withMessage('Le telephone est requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caracteres'),
  body('role').optional().isIn(['etudiant', 'bailleur', 'admin']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nom, prenom, email, telephone, password, role, etablissement, cni, piecesJustificatives, adresse, pays } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Cet email est deja utilise' });
    }
    user = new User({ nom, prenom, email, telephone, password, role: role || 'etudiant', etablissement, cni, piecesJustificatives, adresse, pays });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', [
  body('email').notEmpty().withMessage('Email ou telephone requis'),
  body('password').exists().withMessage('Le mot de passe est requis'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await findUserByIdentifier(email);
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/forgot-password', [
  body('email').notEmpty().withMessage('Email ou telephone requis'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email } = req.body;
    const user = await findUserByIdentifier(email);
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte avec cet email ou telephone' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    res.json({ message: 'Token de reinitialisation genere', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expire' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Mot de passe reinitialise avec succes' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token Google requis' });
    }
    const user = new User({
      nom: 'Utilisateur Google',
      prenom: '',
      email: 'google_' + Date.now() + '@tanal-sa-logement.sn',
      telephone: '000000000',
      password: crypto.randomBytes(16).toString('hex'),
      role: 'etudiant',
    });
    await user.save();
    const jwtToken = generateToken(user);
    res.status(201).json({ token: jwtToken, user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/whatsapp-otp', async (req, res) => {
  try {
    const { telephone } = req.body;
    if (!telephone) {
      return res.status(400).json({ message: 'Telephone requis' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    whatsappOTPs[telephone] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    res.json({ message: 'OTP envoye', otp });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/verify-whatsapp-otp', async (req, res) => {
  try {
    const { telephone, otp } = req.body;
    const record = whatsappOTPs[telephone];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: 'OTP invalide ou expire' });
    }
    delete whatsappOTPs[telephone];
    let user = await User.findOne({ telephone });
    if (!user) {
      user = new User({
        nom: 'Utilisateur WhatsApp',
        prenom: '',
        email: 'wa_' + Date.now() + '@tanal-sa-logement.sn',
        telephone,
        password: crypto.randomBytes(16).toString('hex'),
        role: 'etudiant',
      });
      await user.save();
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/upload-cni', auth, cniUpload.single('cni'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier CNI fourni' });
    }
    const user = await User.findById(req.user.id);
    user.cni = '/uploads/' + req.file.filename;
    await user.save();
    res.json({ url: user.cni });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

