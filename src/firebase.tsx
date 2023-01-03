import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCJ2uLxOCRV5itbp3nm9i1W_LL0SSYFPVY",
  authDomain: "detection-system-database.firebaseapp.com",
  projectId: "detection-system-database",
  storageBucket: "detection-system-database.appspot.com",
  messagingSenderId: "881848746254",
  appId: "1:881848746254:web:8748aabecc3949ecf3975f",
  measurementId: "G-3JZEXDX14K"
};


const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
