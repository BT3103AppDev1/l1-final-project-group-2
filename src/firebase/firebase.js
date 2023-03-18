//import './assets/main.css'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ56Dc6lkHOcHa1bgjb0cQvFAsgF_cgas",
  authDomain: "workwise-5e049.firebaseapp.com",
  projectId: "workwise-5e049",
  storageBucket: "workwise-5e049.appspot.com",
  messagingSenderId: "21430156356",
  appId: "1:21430156356:web:800e3e02a87e6efb7c1011",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // add this line to initialize Firestore

export default firebaseApp;
export { auth, db }; // add db to the exported values
