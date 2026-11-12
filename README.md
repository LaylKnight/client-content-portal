# Client Content Portal (Media Upload PWA)

A full-stack Progressive Web Application (PWA) designed for agencies and content teams to collect photos, videos, voice notes, and project details directly from clients—automatically organized into client-specific Google Drive folders.

---

## ✨ Key Features

- **Per-Client Access Code Authentication:** Each client receives a unique access code mapped server-side to their dedicated Google Drive folder. Google Drive Folder IDs and credentials are never exposed to the browser.
- **Built-In Portfolio Demo Mode (`DEMO-1234`):** Allows recruiters and portfolio visitors to sign in with `DEMO-1234` and test the full 4-step wizard, voice waveform recorder, and upload progress bar without needing Google Drive credentials or writing files to cloud storage.
- **4-Step Guided Upload Wizard:**
  1. **Media Selection:** Upload multiple photos and videos with instant image thumbnail previews and file size indicators.
  2. **Project Details:** Categorize submissions (*Project Pictures & Videos*, *Customer Video Testimonials*) and tag the project title and location.
  3. **In-Browser Voice Recorder:** Built-in `MediaRecorder` & `Web Audio API` voice note recorder featuring a real-time canvas waveform visualizer, pause/resume controls, and redo support.
  4. **Additional Notes & Live Progress:** Add written context and track real-time upload progress via an interactive progress bar.
- **Automated Google Drive Organization:** Every submission automatically generates a timestamped subfolder (`new_YYYYMMDD_ProjectTitle`) inside the client's root Drive folder, complete with all media files, voice recordings, and a generated `project-details.txt` summary file.
- **Installable Mobile & Desktop PWA:** Configured with `vite-plugin-pwa` and Workbox so clients can install the portal onto their phone's home screen with persistent login via `localStorage`.
- **Security Hardened:** Includes `helmet` Content Security Policy headers, `express-rate-limit` brute-force protection on authentication and upload endpoints, strict MIME-type whitelisting, and filename/HTML sanitization.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **PWA / Service Worker:** `vite-plugin-pwa` (Workbox)
- **HTTP Client:** Axios (with upload progress tracking)
- **Browser APIs:** MediaRecorder API & Web Audio API (`AnalyserNode` canvas waveform)

### Backend
- **Runtime & Server:** Node.js + Express
- **Cloud Storage:** Google Drive API v3 (`googleapis`) with OAuth2 Refresh Token & Service Account support
- **File Handling:** Multer (in-memory stream buffers directly to Google Drive—no local disk residue)
- **Security:** Helmet, CORS, Express Rate Limit

---

## 📁 Project Structure

```text
medias-socmed/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Validates client access codes
│   │   └── uploadController.js   # Sanitizes inputs, creates Drive subfolders & uploads files
│   ├── routes/
│   │   ├── authRoutes.js         # GET /api/auth (rate-limited)
│   │   └── uploadRoutes.js       # POST /api/upload (MIME-filtered & rate-limited)
│   ├── utils/
│   │   └── driveHelper.js        # Google Drive API v3 wrapper (OAuth2 / Service Account)
│   ├── .env.example              # Template for backend environment variables
│   ├── clients.example.json      # Template for per-client access tokens & Drive folder IDs
│   └── server.js                 # Express app & static frontend host
├── frontend/
│   ├── public/icons/             # PWA & Apple Touch icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClientAuth.jsx    # Access code login screen
│   │   │   ├── UploadForm.jsx    # Multi-step wizard container
│   │   │   ├── Step1Files.jsx    # Step 1: Image & video picker with previews
│   │   │   ├── Step2Details.jsx  # Step 2: Upload type, project title & location
│   │   │   ├── Step3Voice.jsx    # Step 3: Live waveform audio recorder
│   │   │   ├── Step4Notes.jsx    # Step 4: Additional notes & upload submission
│   │   │   ├── StepIndicator.jsx # Progress step indicator
│   │   │   ├── ProgressBar.jsx   # Upload percentage bar
│   │   │   └── Toast.jsx         # Status notifications
│   │   └── App.jsx               # Root layout & session state
│   ├── .env.example              # Template for frontend environment variables
│   └── vite.config.js            # Vite + Tailwind v4 + PWA configuration
├── GOOGLE_DRIVE_SETUP.md         # Detailed guide for Google OAuth2 credentials
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js** v18+ and `npm`
- A **Google Cloud Console** project with the **Google Drive API** enabled (see [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md) for step-by-step OAuth2 credential instructions)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd medias-socmed
```

### 3. Configure the Backend
```bash
cd backend
npm install
```

1. Create your `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Google OAuth2 credentials in `backend/.env`:
   ```env
   PORT=3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_refresh_token
   ```
3. Create your `clients.json` configuration from the example template:
   ```bash
   cp clients.example.json clients.json
   ```
4. Edit `backend/clients.json` to define each client's unique access code, display name, and target Google Drive Folder ID:
   ```json
   {
     "demo-client-1234": {
       "name": "Demo Studio",
       "folderId": "1A2B3C4D5E6F7G8H9I0J_YOUR_FOLDER_ID"
     }
   }
   ```

### 4. Configure the Frontend
```bash
cd ../frontend
npm install
```

1. Create your `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
2. Ensure `VITE_API_URL` points to your local backend server during development:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### 5. Run the Application
Open two terminal windows:

**Terminal 1 — Start the Backend (`http://localhost:3000`):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Start the Frontend (`http://localhost:5173`):**
```bash
cd frontend
npm run dev
```

---

## 📖 How to Use the Web App

### 1. Sign In with Your Access Code
- Open the web app in your browser (or launch the installed PWA from your mobile home screen).
- Enter the **Access Code** provided to you and click **Continue**:
  - **For Portfolio Reviewers / Quick Testing:** Enter **`DEMO-1234`** to explore the full 4-step workflow in sandboxed Demo Mode (simulates uploads without requiring Google Drive setup).
  - **For Configured Clients:** Enter a client token defined in `backend/clients.json`.
- Your session is saved automatically on your device so you won't need to re-enter the code on future visits. You can switch accounts anytime by clicking **Sign out** in the top-right corner.

### 2. Step 1 — Upload Media Files
- Click **Choose Files** to select one or more photos (`JPG`, `PNG`, `WEBP`, `GIF`, `HEIC`) or videos (`MP4`, `MOV`, `WEBM`, `AVI`) from your device or camera roll.
- Review your selected files in the preview grid. Click the **✕** button on any card to remove an item before continuing.
- Click **Next** once at least one file is selected.

### 3. Step 2 — Enter Project Details
- Select one or both **Types of Upload**:
  - *Project Pictures and Videos*
  - *Customer Video Testimonials*
- Enter the **Project Title** (used to name the subfolder in Google Drive) and **Project Location**.
- Click **Next**.

### 4. Step 3 — Record a Voice Note (Optional)
- Click **Start Recording** and grant microphone permission when prompted by your browser.
- Speak for 1–2 minutes describing the project. A live audio waveform and timer will display your recording progress.
- Use **Pause** / **Resume** to take breaks, **Redo** to start over, or **Stop** when finished.
- Click **Next** to attach the voice note, or click **Skip** if no voice note is needed.

### 5. Step 4 — Add Notes & Submit
- Type any additional written instructions, captions, or context in the **Additional Notes** field.
- Click **Upload** and watch the real-time percentage bar as your files stream to Google Drive.
- Once complete, a confirmation toast appears and your submission is neatly stored in Google Drive under:
  ```text
  📁 [Client Root Folder]
   └── 📁 new_YYYYMMDD_<Project Title>/
        ├── 🖼️ uploaded-media-files...
        ├── 🎙️ voice-note-<timestamp>.webm (if recorded)
        └── 📄 project-details.txt
  ```

---

## 🔒 Security & Privacy Notes

- **Never commit `.env` or `clients.json`:** Both files are listed in `.gitignore` to ensure OAuth secrets, client access codes, and Google Drive folder IDs remain private.
- **Rate Limiting:** Authentication is limited to 10 attempts per 15 minutes per IP, and uploads are limited to 20 submissions per 15 minutes per IP.
- **In-Memory Streaming:** Uploaded files are buffered in memory via Multer and streamed directly to Google Drive without being written to the server's local disk.
