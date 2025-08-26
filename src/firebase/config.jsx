// config.jsx (nebo firebase.js)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIue0U4jUkcrl4HXj1z6hsQxOSP5ZWtn4",
  authDomain: "pokus-a43ee.firebaseapp.com",
  projectId: "pokus-a43ee",
  storageBucket: "pokus-a43ee.firebasestorage.app",
  messagingSenderId: "1012122145032",
  appId: "1:1012122145032:web:5ee020ba0cfb9035421cbd",
};

// Inicializuj Firebase
const app = initializeApp(firebaseConfig);

// Připoj Firestore
const db = getFirestore(app);

export { db };
