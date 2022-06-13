import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// import "firebase/storage";
// import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA-2zQSfR7ytNKalD3q1ABJlnrx1PUwsfU",
  authDomain: "fir-test-f5cf2.firebaseapp.com",
  databaseURL: "https://fir-test-f5cf2-default-rtdb.firebaseio.com",
  projectId: "fir-test-f5cf2",
  storageBucket: "fir-test-f5cf2.appspot.com",
  messagingSenderId: "257529662221",
  appId: "1:257529662221:web:1335bd8cd110aa9d4c3e44",
};
const app = initializeApp(firebaseConfig);
// Initialize Firebase
// let auth = firebase.auth();
export const db = getFirestore(app);
// let storage = firebase.storage();
