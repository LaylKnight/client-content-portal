const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const uploadController = require('../controllers/uploadController');

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  // Videos
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/mpeg',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/webm',
  'audio/x-m4a',
  // Documents
  'application/pdf',
]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many uploads. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/upload', uploadLimiter, upload.array('files'), (req, res, next) => {
  next();
}, uploadController.handleUpload);

// Handle multer file type errors
router.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('File type not allowed')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
