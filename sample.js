import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJ56Dc6lkHOcHa1bgjb0cQvFAsgF_cgas",
    authDomain: "workwise-5e049.firebaseapp.com",
    projectId: "workwise-5e049",
    storageBucket: "workwise-5e049.appspot.com",
    messagingSenderId: "21430156356",
    appId: "1:21430156356:web:800e3e02a87e6efb7c1011",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createUsers() {
  const users = [
    { id: "user1", displayName: "User One", email: "user1@example.com" },
    { id: "user2", displayName: "User Two", email: "user2@example.com" },
  ];

  for (const user of users) {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, { displayName: user.displayName, email: user.email });
  }

  console.log("Users created successfully!");
}

createUsers();
