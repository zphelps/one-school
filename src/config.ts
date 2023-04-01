import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFunctions} from "firebase/functions";

// export const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
// }

export const firebaseConfig = {
  apiKey: "AIzaSyBF0yzE_hDLjFPIA6LjRJkIqVz9SK24GXE",
  authDomain: "one-school-3b699.firebaseapp.com",
  projectId: "one-school-3b699",
  storageBucket: "one-school-3b699.appspot.com",
  messagingSenderId: "90624457256",
  appId: "1:90624457256:web:12b4943725660d4071531d",
  measurementId: "G-9W33TLT12S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, storage, functions };



// export const gtmConfig = {
//   containerId: process.env.REACT_APP_GTM_CONTAINER_ID
// };
//
// export const mapboxConfig = {
//   apiKey: process.env.REACT_APP_MAPBOX_API_KEY
// };
