const driveHelper = require('./utils/driveHelper');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testOAuth2() {
  console.log('Testing Google Drive OAuth2 connection...');
  console.log('Target Folder ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);
  
  try {
    const testFolderName = `OAuth2 Test Folder - ${new Date().toISOString()}`;
    console.log(`Attempting to create folder: ${testFolderName}`);
    
    const folderId = await driveHelper.createFolder(testFolderName, process.env.GOOGLE_DRIVE_FOLDER_ID);
    console.log('Successfully created folder with ID:', folderId);
    
    console.log('Attempting to upload a test file...');
    const testFile = {
      originalname: 'oauth2-test.txt',
      buffer: Buffer.from('Hello from OAuth2!'),
      mimetype: 'text/plain'
    };
    const fileId = await driveHelper.uploadToDrive(testFile, folderId);
    console.log('Successfully uploaded file with ID:', fileId);
    
    console.log('Test successful! Your OAuth2 setup is working perfectly.');
  } catch (error) {
    console.error('Test failed!');
    console.error('Error details:', error.message);
    if (error.response && error.response.data) {
      console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOAuth2();
