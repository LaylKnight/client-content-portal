const path = require('path');
const fs = require('fs');
const driveHelper = require('../utils/driveHelper');
require('dotenv').config();

const sanitizeText = (str, maxLength) =>
  str.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);

const sanitizeFilename = (name) =>
  name.replace(/[^\w\s.\-()]/g, '_').trim().slice(0, 200) || 'unnamed';

const handleUpload = async (req, res) => {
  try {
    const { token, projectTitle, projectLocation, uploadTypes, notes } = req.body;
    const files = req.files || [];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!projectTitle) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Built-in portfolio demo mode: validate & simulate upload without writing to Google Drive
    if (token.trim().toLowerCase() === 'demo-1234') {
      return res.status(200).json({
        message: 'Demo upload complete! (Simulated — no files written to Google Drive)',
        fileCount: files.length + 1,
        isDemo: true,
      });
    }

    const clientsPath = path.join(__dirname, '../clients.json');
    if (!fs.existsSync(clientsPath)) {
      console.error('Missing backend/clients.json. Copy clients.example.json to clients.json to configure client tokens.');
      return res.status(500).json({ error: 'Server configuration missing (clients.json).' });
    }
    const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf-8'));
    const client = clients[token];

    if (!client) {
      return res.status(401).json({ error: 'Invalid access code.' });
    }

    const { name: clientName, folderId: mainFolderId } = client;

    const safeProjectTitle = sanitizeText(projectTitle, 100);
    const safeProjectLocation = projectLocation ? sanitizeText(projectLocation, 100) : '';
    const safeNotes = notes ? sanitizeText(notes, 1000) : 'None';
    const parsedUploadTypes = uploadTypes ? JSON.parse(uploadTypes).join(', ') : 'Not specified';

    files.forEach(file => {
      file.originalname = sanitizeFilename(file.originalname);
    });

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const folderName = `new_${dateStr}_${safeProjectTitle}`;

    console.log(`Creating folder: ${folderName} in ${mainFolderId}`);

    const folderId = await driveHelper.createFolder(folderName, mainFolderId);
    console.log(`Folder created: ${folderId}`);

    console.log(`Uploading ${files.length} files...`);
    const uploadPromises = files.map(file => driveHelper.uploadToDrive(file, folderId));

    const detailsContent = `Client: ${clientName}
Project Title: ${safeProjectTitle}
Project Location: ${safeProjectLocation}
Upload Type: ${parsedUploadTypes}
Date: ${new Date().toLocaleString()}
Notes: ${safeNotes}`;
    uploadPromises.push(driveHelper.uploadTextFile('project-details.txt', detailsContent, folderId));

    const results = await Promise.all(uploadPromises);
    console.log('All files uploaded successfully');

    res.status(200).json({ message: 'Upload successful', fileCount: results.length });
  } catch (error) {
    console.error('Upload process failed:');
    if (error.response && error.response.data) {
      console.error('Google API Error:', JSON.stringify(error.response.data, null, 2));

      const googleError = error.response.data.error;
      if (googleError && googleError.message.includes('storage quota')) {
        return res.status(403).json({
          error: 'Google Drive storage quota exceeded. Please contact support.',
        });
      }
    } else {
      console.error('Error message:', error.message);
    }

    res.status(500).json({ error: 'Failed to upload files.' });
  }
};

module.exports = {
  handleUpload,
};
