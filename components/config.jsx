// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoWft80Hj2vVELIgSEjPddlkRk8fd1pic",
  authDomain: "mynotebookapp-dd785.firebaseapp.com",
  projectId: "mynotebookapp-dd785",
  storageBucket: "mynotebookapp-dd785.appspot.com",
  messagingSenderId: "947140892663",
  appId: "1:947140892663:web:cee73634a1279f5d7100f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)