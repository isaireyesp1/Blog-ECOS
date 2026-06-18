// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_HBHmx-fVs6jzLkwJ4JIJcQ1PmwP13Mk",
  authDomain: "ecos-233a2.firebaseapp.com",
  projectId: "ecos-233a2",
  storageBucket: "ecos-233a2.firebasestorage.app",
  messagingSenderId: "433864296197",
  appId: "1:433864296197:web:137be5bddaf421ee19996c",
  measurementId: "G-W27X417JGW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);