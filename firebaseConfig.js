import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBSa1n9DZ514wVHni0LMuKnlj9r3WLfW-E",
  authDomain: "serene-fit-4b705.firebaseapp.com",
  projectId: "serene-fit-4b705",
  storageBucket: "serene-fit-4b705.firebasestorage.app",
  messagingSenderId: "852777863148",
  appId: "1:852777863148:web:e121b2e6358143ccb3a2c9"
};

// Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const firestore = getFirestore(app); // Initialize Firestore with the app

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
