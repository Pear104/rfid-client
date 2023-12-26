// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0KXzWCGKwrr2eb-dcE1m-8oS6k5hiZ3g",
  authDomain: "rfid-23e43.firebaseapp.com",
  projectId: "rfid-23e43",
  storageBucket: "rfid-23e43.appspot.com",
  messagingSenderId: "290776495920",
  appId: "1:290776495920:web:180a284deaa3cdc6647af5",
  measurementId: "G-LW0PPPZVW0",
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
