import { useState, useEffect } from 'react'
import { database } from './firebase';
import { collection, addDoc, getDoc, doc, where, query, getDocs } from "firebase/firestore"; 
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get('/.netlify/functions/data')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  async function addUser() {
    try {
      const newQ = query(collection(database, "users"), where("first", "==", "Ada"));
      const querySnapshot = await getDocs(newQ)
      if(querySnapshot.empty) {
        const docRef = await addDoc(collection(database, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      }
      else {
        console.log("Data already present in the database");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <>
      <div>
        {data ? <p>{data.name}</p> : <p>Loading....</p>}
      </div>
      <button onClick={addUser}>click me</button>
    </>
  )
}

export default App
