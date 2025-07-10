import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import app from "./firebase.js";
import { useState, useEffect } from "react";
const db = getFirestore(app);

function Database() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      const querySnapshot = await getDocs(collection(db, "test"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setData(data);
      });
    }
    getData().catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div>
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
