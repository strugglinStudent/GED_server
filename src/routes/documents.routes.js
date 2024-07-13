const express = require('express');
const { upload, uploadLogo, uploadContract } = require('../shared/warped-multer'); // Adjust the path as needed
const Document = require('../models/Document');

const documentRoute = express.Router();

// Example: Using upload function for general document upload
documentRoute.post('/upload', upload('public/documents').single('file'), async (req, res) => {
  try {
    const document = new Document({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    await document.save();

    res.status(201).json(req.file);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error });
  }
});

// Example: Using uploadLogo function for logo upload
documentRoute.post('/uploadLogo', uploadLogo('public').single('file'), async (req, res) => {
  try {
    const file = new File({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    await file.save();

    res.status(201).json({ message: 'Logo uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload logo', error });
  }
});

// Example: Using uploadContract function for contract upload
documentRoute.post('/uploadContract/:id', uploadContract().single('file'), async (req, res) => {
  try {
    const file = new File({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    await file.save();

    res.status(201).json({ message: 'Contract uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload contract', error });
  }
});

module.exports = documentRoute;

