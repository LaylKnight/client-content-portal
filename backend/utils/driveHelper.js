const { google } = require('googleapis');
require('dotenv').config();

let driveInstance = null;

const getDrive = () => {
  if (driveInstance) return driveInstance;

  let auth;
  // Check specifically for the refresh token
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_REFRESH_TOKEN.trim() !== '') {
    console.log('Initializing Google Drive with OAuth2...');
    auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  } else {
    console.log('Initializing Google Drive with Service Account...');
    const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: SCOPES,
    });
  }

  driveInstance = google.drive({ version: 'v3', auth });
  return driveInstance;
};

const uploadToDrive = async (fileObject, folderId) => {
  try {
    const drive = getDrive();
    const { originalname, buffer, mimetype } = fileObject;
    const { Readable } = require('stream');
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: originalname,
        parents: [folderId],
      },
      media: {
        mimeType: mimetype,
        body: bufferStream,
      },
      fields: 'id',
      supportsAllDrives: true,
    });

    return response.data.id;
  } catch (error) {
    console.error('Drive Helper Error:', error);
    throw error;
  }
};

const createFolder = async (folderName, parentId) => {
  try {
    const drive = getDrive();
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentId && parentId !== 'undefined') {
      fileMetadata.parents = [parentId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
      supportsAllDrives: true,
    });

    return response.data.id;
  } catch (error) {
    console.error('Create Folder Error:', error);
    throw error;
  }
};

const uploadTextFile = async (fileName, content, folderId) => {
  try {
    const drive = getDrive();
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(content);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: 'text/plain',
        body: stream,
      },
      fields: 'id',
      supportsAllDrives: true,
    });

    return response.data.id;
  } catch (error) {
    console.error('Upload Text File Error:', error);
    throw error;
  }
};

module.exports = {
  uploadToDrive,
  createFolder,
  uploadTextFile,
};
