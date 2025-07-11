import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import app from "./firebase.js";
import { useState } from "react";
const db = getFirestore(app);

function Database() {
  const [data, setData] = useState([]);

  async function updateData(id, newData) {
    const docRef = doc(db, "test", id);
    await updateDoc(docRef, newData);
  }
  async function updateDataCall() {
    const fetch = await getDocs(collection(db, "test"));
    fetch.forEach((doc) => {
      if (doc.data().age === 30) {
        updateData(doc.id, { name: "Changed again" });
      }
    });
    await updateData(doc.id, { age: 35 });
  }
  async function cleanAll() {
    const fetch = await getDocs(collection(db, "test"));
    fetch.forEach((doc) => {
      clean(doc.id);
    });
  }
  async function clean(id) {
    await deleteDoc(doc(db, "test", id));
  }
  async function getData() {
    const fetch = await getDocs(collection(db, "test"));
    const data = [];
    fetch.forEach((doc) => {
      if (doc.data().age === 54) {
        clean(doc.id);
      } else {
        data.push({ id: doc.id, ...doc.data() });
      }
    });
    setData(data);
  }
  async function addData() {
    await addDoc(collection(db, "test"), {
      name: "Alice",
      age: 30,
    });
    await addDoc(collection(db, "test"), {
      name: "Alice",
      age: 45,
    });
    await addDoc(collection(db, "test"), {
      name: "Alice",
      age: 54,
    });
  }
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
}

export default Database;
