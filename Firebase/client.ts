import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth'// TODO: Add SDKs for Firebase products that you want to use
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCX1JlzokfELi0yJPW5FzuhSMOyHkMVSj8",
    authDomain: "santute.firebaseapp.com",
    projectId: "santute",
    storageBucket: "santute.firebasestorage.app",
    messagingSenderId: "335496461310",
    appId: "1:335496461310:web:0b46980de7ad018988deaf",
    measurementId: "G-PYMCPS2YNE"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);