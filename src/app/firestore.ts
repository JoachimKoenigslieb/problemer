
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcEmbzv1gyJ0Y7WCH4FNE2qbTAeuTmvUw",
  authDomain: "problemer-179e6.firebaseapp.com",
  projectId: "problemer-179e6",
  storageBucket: "problemer-179e6.appspot.com",
  messagingSenderId: "500864335217",
  appId: "1:500864335217:web:f189d0d378e354d1878ad0",
  measurementId: "G-H78B3WRKSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)