import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
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
const db = getFirestore(app);

export async function updateData(id, newData, name) {
  const docRef = doc(db, name, id);
  await updateDoc(docRef, newData);
}
export async function cleanAll(name) {
  try {
    const fetch = await getDocs(collection(db, name));
    await Promise.all(fetch.docs.map((doc) => deleteDoc(doc.ref)));
  } catch (error) {
    console.error("Error cleaning all documents:", error);
    throw error;
  }
}
export async function clean(name, id) {
  await deleteDoc(doc(db, name, id));
}
export async function getData(name) {
  const fetch = await getDocs(collection(db, name));
  const data = [];
  fetch.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}
export async function addData(name, id, data) {
  const docRef = doc(db, name, id);
  await setDoc(docRef, data);
}
