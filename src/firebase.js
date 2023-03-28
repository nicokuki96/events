// import  initializeApp  from "firebase/compat/app";
import { getAuth } from "../node_modules/firebase/auth"
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC2H_5BHwEa7WNZYHYKYn9tQGIASoBSPbA",
    authDomain: "events-73859.firebaseapp.com",
    projectId: "events-73859",
    storageBucket: "events-73859.appspot.com",
    messagingSenderId: "787500719709",
    appId: "1:787500719709:web:d38dc0431f03181708f7b4",
    measurementId: "G-LGWBKW0GQH"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = firebase.firestore();
export const storage = firebase.storage();