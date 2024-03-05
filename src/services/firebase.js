import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDCHcLqRh3sBDhypr1lOWJxdiq3cbu7P4E",
    authDomain: "react-firestore-app-1bcb1.firebaseapp.com",
    projectId: "react-firestore-app-1bcb1",
    storageBucket: "react-firestore-app-1bcb1.appspot.com",
    messagingSenderId: "333317858407",
    appId: "1:333317858407:web:f255d715f4b54b748ca0c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// const logInWithEmailAndPassword = async (email, password) => {
//     try {
//         console.log(email, password);
//         await signInWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//         console.error(err);
//         alert("The username and Password don't match");
//         // alert(err.message);
//     }
// };

// const logout = () => {
//     signOut(auth);
// };

export {
    auth,
    db,
    storage,
    // logInWithEmailAndPassword,
    // logout
};