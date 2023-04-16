import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// User Document
export const createUserDocument = async (user) => {
  if (!user) return;
  const {
    uid,
    displayName,
    firstName,
    lastName,
    email,
    photoURL,
    birthDate,
    address,
  } = user;
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, {
        displayName,
        firstName,
        lastName,
        email,
        photoURL,
        birthDate,
        address,
        createdAt: new Date(),
      });
    }
    return getUserDocument(uid);
  } catch (error) {
    console.error(error);
  }
};

export const getUserDocument = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, updates);
    return getUserDocument(uid);
  } catch (error) {
    switch (error.code) {
      case 'permission-denied':
        throw new Error(
          'You do not have permission to update this user profile'
        );
      case 'not-found':
        throw new Error('User profile not found');
      default:
        throw new Error('An error occurred while updating the user profile');
    }
  }
};

// Error messages for auth
const authErrorMessages = {
  'auth/user-not-found': 'This email address is not registered. Please sign up',
  'auth/wrong-password': 'Incorrect password. Please try again',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/email-already-in-use':
    'This email address is already in use. Please use a different email',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/too-many-requests': 'Too many login attempts. Please try again later',
  'auth/network-request-failed':
    'Network request failed. Please check your internet connection',
};

export const handleAuthError = (errorCode, inputField, setError) => {
  if (authErrorMessages[errorCode]) {
    setError(
      inputField,
      { type: 'custom', message: authErrorMessages[errorCode] },
      { shouldFocus: true }
    );
  } else {
    console.log(errorCode);
  }
};
