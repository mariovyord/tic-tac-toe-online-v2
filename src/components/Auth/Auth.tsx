import { Component } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsPerson } from 'react-icons/bs';
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import styles from './Auth.module.css';
import bgStyles from './background.module.css';

import SigninBtn from './signinBtn/SigninBtn';

export default class Auth extends Component {

	handleLogin() {
	}

	handleLogout() {

	}

	render() {
		return (
			<div className={styles.wrapper}>
				<div className={styles.welcome}>
					<h2 className={styles.heading}>Welcome to</h2>
					<h1 className={styles.heading}>Tic-Tac-Toe Online</h1>
				</div>
				<div className={styles.board}>
					<SigninBtn login={this.handleLogin} classes={styles['white-bg']} text="Sign in with Google" >
						<FcGoogle size={'25px'} />
					</SigninBtn>
					<SigninBtn login={this.handleLogin} classes={styles['yellow-bg']} text="Continue as guest" >
						<BsPerson size={'25px'} />
					</SigninBtn>
				</div>
				<ul className={bgStyles.circles}>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		)
	}
}
