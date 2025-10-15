// Firebase Configuration
// Replace these values with your own Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyDaE29uprr3eVfSh9y7qCHYkninwELJRXQ",
  authDomain: "phonefeedcc.firebaseapp.com",
  projectId: "phonefeedcc",
  storageBucket: "phonefeedcc.firebasestorage.app",
  messagingSenderId: "153187212139",
  appId: "1:153187212139:web:5a6bd6fe170929784cca2e"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore instance
const db = firebase.firestore();
