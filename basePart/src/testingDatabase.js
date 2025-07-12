import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
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
export async function updateDataCall(name) {
  const fetch = await getDocs(collection(db, name));
  fetch.forEach((doc) => {
    if (doc.data().age === 30) {
      updateData(doc.id, { name: "Changed again" });
    }
  });
  await updateData(doc.id, { age: 35 });
}
export async function cleanAll(name) {
  const fetch = await getDocs(collection(db, name));
  fetch.forEach((doc) => {
    clean(doc.id);
  });
}
export async function clean(name, id) {
  await deleteDoc(doc(db, name, id));
}
export async function getData(name, id) {
  const docRef = doc(db, name, id);
  const fetch = await getDoc(docRef);
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
/*
getData().catch((error) => console.error("Error fetching data:", error));
return (
  <div>
    <button
      type="button"
      onClick={() =>
        addData().catch((error) => console.error("Error adding data:", error))
      }
    >
      Add
    </button>
    <button
      type="button"
      onClick={() =>
        getData().catch((error) =>
          console.error("Error fetching data:", error),
        )
      }
    >
      Get
    </button>
    <button
      type="button"
      onClick={() =>
        cleanAll().catch((error) =>
          console.error("Error clearing data:", error),
        )
      }
    >
      Complete Clear
    </button>
    <button
      type="button"
      onClick={() =>
        updateDataCall().catch((error) =>
          console.error("Error updating data:", error),
        )
      }
    >
      Update
    </button>
    <h2>Fetched Data</h2>
    <ul>
      {data.map((item) => (
        <li key={item.id}>{JSON.stringify(item)}</li>
      ))}
    </ul>
  </div>
);

*/
