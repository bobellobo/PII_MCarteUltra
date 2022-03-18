import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0TIthr6fvJPIWgFQQnSyWykgcc55-klg",
  authDomain: "cardapp-e705f.firebaseapp.com",
  databaseURL: "https://cardapp-e705f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cardapp-e705f",
  storageBucket: "cardapp-e705f.appspot.com",
  messagingSenderId: "6178434081",
  appId: "1:6178434081:web:49940c9bb754a551254760",
  measurementId: "G-MDXM0E4VD6"
};

if (!firebase.default.apps.length) {
    firebase.default.initializeApp(firebaseConfig);
}

export { firebase };