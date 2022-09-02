import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from "firebase/auth";
import { FirebaseApp } from 'firebase/app';

export class AuthLib {
	static handleGoogleLogin(app: FirebaseApp) {
		const provider = new GoogleAuthProvider();
		const auth = getAuth(app);

		return signInWithPopup(auth, provider)
	}

	static handleGuestLogin(app: FirebaseApp) {
		const auth = getAuth(app);

		return signInAnonymously(auth)
	}

	static handleLogout(app: FirebaseApp) {
		const auth = getAuth(app);
		return signOut(auth);
	}
}