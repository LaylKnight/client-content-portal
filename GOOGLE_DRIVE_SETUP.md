# Google Drive Integration Guide (OAuth2)

This guide explains how to connect a personal Google Drive account to the Media Upload Application. This method uses OAuth2, which allows for **free storage** (using your personal 15GB limit) and avoids the "Service Account Quota" errors.

## 1. Google Cloud Console Setup

1.  **Create a Project:**
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project named `Media-Upload-Demo`.

2.  **Enable the API:**
    - Go to **Enabled APIs & Services**.
    - Click **+ ENABLE APIS AND SERVICES**.
    - Search for **Google Drive API** and click **Enable**.

3.  **Configure OAuth Consent Screen:**
    - Go to **APIs & Services > OAuth consent screen**.
    - User Type: **External**.
    - App Name: `Social Media Upload App`.
    - User Support Email: Your Gmail.
    - **Test Users:** (CRITICAL) Scroll down to "Test users" and add your own Gmail address. The app will not work without this.

4.  **Create Credentials:**
    - Go to **APIs & Services > Credentials**.
    - Click **Create Credentials > OAuth client ID**.
    - Application Type: **Web application**.
    - Name: `Media Upload Web Client`.
    - **Authorized redirect URIs:** Add `https://developers.google.com/oauthplayground`.
    - Click **Create**.
    - **Save your Client ID and Client Secret.**

---

## 2. Generate the Refresh Token

Since this is a backend-to-backend integration for a demo, we use a "Refresh Token" to keep the app logged in forever.

1.  Open the [Google OAuth Playground](https://developers.google.com/oauthplayground/).
2.  Click the **Gear Icon (Settings)** in the top right.
3.  Check **"Use your own OAuth credentials"**.
4.  Enter your **Client ID** and **Client Secret**.
5.  **Step 1 (Select Scopes):** Paste `https://www.googleapis.com/auth/drive.file` into the input box and click **Authorize APIs**.
6.  Log in with your Google Account and click **Allow** (You may need to click "Advanced > Go to App (unsafe)").
7.  **Step 2 (Exchange Code):** Click **Exchange authorization code for tokens**.
8.  **Step 3 (Result):** Copy the **Refresh Token** from the JSON response.

---

## 3. Finding your Target Folder ID (Optional)

If you want all uploads to go into a specific folder instead of your main Drive:
1.  Open Google Drive in your browser.
2.  Open the folder you want to use as the destination.
3.  Look at the URL in your browser. The ID is the long string of letters and numbers after `/folders/`.
    *   Example: `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J...`
    *   The ID is: `1A2B3C4D5E6F7G8H9I0J...`
4.  Copy this ID for the next step.

---

## 4. Environment Configuration (.env)

Update your `backend/.env` file with the values obtained above:

```env
PORT=3000
GOOGLE_DRIVE_FOLDER_ID=your_target_folder_id_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

---

## 5. Why use this instead of Service Accounts?

| Feature | Service Account | OAuth2 (This Guide) |
| :--- | :--- | :--- |
| **Cost** | Free | Free |
| **Storage Quota** | **0MB** (on personal accounts) | **15GB+** (Your personal limit) |
| **Visibility** | Files are "hidden" in the robot's drive | Files appear in your personal Drive |
| **Setup** | Easy (JSON file) | Moderate (Consent screen + Token) |

## 5. Security for Clients
- **In Production:** You should never share the `Client Secret` or `Refresh Token`.
- **Client Ownership:** If you build this for a client, they should follow these steps using *their* Google account so they own the data and the storage quota.
