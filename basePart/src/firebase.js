// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSquv_Q4h-uMn6a8SJ-AnI4KQcNKjk7Og",
  authDomain: "my-react-app-firebase-793b1.firebaseapp.com",
  projectId: "my-react-app-firebase-793b1",
  storageBucket: "my-react-app-firebase-793b1.firebasestorage.app",
  messagingSenderId: "525119036648",
  appId: "1:525119036648:web:2e8484125bf9069d473d5d",
  measurementId: "G-54TSXS7PJK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
