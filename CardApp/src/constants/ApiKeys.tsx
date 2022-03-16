// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0TIthr6fvJPIWgFQQnSyWykgcc55-klg",
  authDomain: "cardapp-e705f.firebaseapp.com",
  databaseURL: "https://cardapp-e705f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cardapp-e705f",
  storageBucket: "cardapp-e705f.appspot.com",
  messagingSenderId: "6178434081",
  appId: "1:6178434081:web:cb10178abb36f00c254760",
  measurementId: "G-1SL6EEJPJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);