import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebase.js";

const db = getFirestore(app);

async function getData() {
  const querySnapshot = await getDocs(collection(db, "your-collection-name"));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

async function dataBase() {
  const result = await getData();
  return <p>{result}</p>;
}

export default dataBase;
