import firebase from "firebase";
import "firebase/database";

let config = {
  apiKey: "AIzaSyAgCbaQo2eAqMLuTFAfposHFXljuVeXLsg",
  authDomain: "bd-system.firebaseapp.com",
  databaseURL: "https://bd-system.firebaseio.com",
  projectId: "bd-system",
  storageBucket: "bd-system.appspot.com",
  messagingSenderId: "844842404210",
  appId: "1:844842404210:web:1521fdd0fec61a119db5eb",
  measurementId: "G-GE6RXNXMKG"
};

firebase.initializeApp(config);

export default firebase.database();
