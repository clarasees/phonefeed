# Firebase Setup Instructions

Follow these steps to connect your Phone Feed app to Firebase.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "phonefeed")
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this project)
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Phone Feed Web")
3. **Do NOT** check "Set up Firebase Hosting" (you'll host it yourself)
4. Click **Register app**
5. You'll see your Firebase configuration code - **keep this page open!**

## Step 3: Copy Your Firebase Configuration

1. From the Firebase Console setup page, copy the configuration values
2. Open `firebase-config.js` in your project
3. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIza...",              // Copy from Firebase Console
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## Step 4: Set Up Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Click **Next**
5. Select your Cloud Firestore location (choose closest to your users)
6. Click **Enable**

## Step 5: Configure Firestore Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read and write to the counters collection
    match /counters/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

**Note:** These rules allow anyone to read/write the counter. For production, you should:
- Add authentication
- Restrict write access to server-side functions
- Add rate limiting

## Step 6: Test Your Setup

1. Open `index.html` in a web browser
2. Open the browser console (F12 or Cmd+Option+I)
3. Check for any Firebase errors
4. You should see logs like:
   ```
   New user assigned from Firebase: {userId: "user-1", userNumber: 1}
   ```

5. Open `admin.html` to see the Firebase user count

## Step 7: Deploy Your App

Since this is now a multi-user system, you need to deploy it online:

### Option A: Firebase Hosting (Easiest)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option B: Netlify
1. Drag and drop your folder to [Netlify Drop](https://app.netlify.com/drop)

### Option C: GitHub Pages
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings

## Troubleshooting

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"
- You're loading Firebase twice. Check that you only have one `firebase-config.js` script tag.

### Error: "Missing or insufficient permissions"
- Your Firestore rules are too restrictive. Follow Step 5 again.

### Error: "Network request failed"
- Check your internet connection
- Verify your Firebase config values are correct
- Check browser console for CORS errors

### Counter not incrementing
- Open browser console and check for errors
- Verify Firestore rules allow writes
- Check that your Firebase config is correct

## How It Works

1. **First visit**: User gets assigned from Firebase counter (globally synchronized)
2. **Return visits**: User ID stored in localStorage (no Firebase call needed)
3. **Admin page**: Shows real-time Firebase counter across all users
4. **Reset**: Clears both Firebase counter and localStorage

## Security Notes (For Production)

For a production app, you should:
1. Add Firebase Authentication
2. Use Firestore Security Rules to protect writes
3. Implement rate limiting
4. Use Cloud Functions for counter increments (more secure)
5. Add user tracking/analytics

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs/web/setup)
