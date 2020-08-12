import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCgA-RgJ1ifzC4V4GRLZzEkxkNWAOLi4lY",
    authDomain: "project-5-test-120f1.firebaseapp.com",
    databaseURL: "https://project-5-test-120f1.firebaseio.com",
    projectId: "project-5-test-120f1",
    storageBucket: "project-5-test-120f1.appspot.com",
    messagingSenderId: "120232366961",
    appId: "1:120232366961:web:3409e30e67044ea2aedcd0"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
