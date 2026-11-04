// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHdLUM1pjbbpRAOFzS58zUXaDUtsJZ2F0",
  authDomain: "hemmo-dce21.firebaseapp.com",
  databaseURL: "https://hemmo-dce21-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hemmo-dce21",
  storageBucket: "hemmo-dce21.firebasestorage.app",
  messagingSenderId: "1052324572337",
  appId: "1:1052324572337:web:e7f24da94f3d71dd930690"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);