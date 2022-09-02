// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, User } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import "firebase/firestore";
import "firebase/analytics";
import ReactObserver from 'react-event-observer';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig: any = {
	apiKey: "AIzaSyBHHuQgOYr7xTGktiGjq4ApJnIs5EQdv0Q",
	authDomain: "tic-tac-toe-online-11df9.firebaseapp.com",
	projectId: "tic-tac-toe-online-11df9",
	storageBucket: "tic-tac-toe-online-11df9.appspot.com",
	messagingSenderId: "845943795550",
	appId: "1:845943795550:web:1e5f76fd1a3af4a069e9cf",
	measurementId: "G-8MLGRV81JN"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseObserver = ReactObserver();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

auth.onAuthStateChanged(function (user) {
	firebaseObserver.publish("authStateChanged", sendUser(user))
});

export function sendUser(user: null | User) {
	if (user) {
		return user;
	} else {
		return null;
	}
}

// Activate emulators
if (window.location.hostname === "localhost") {
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectAuthEmulator(auth, "http://localhost:9099");
}