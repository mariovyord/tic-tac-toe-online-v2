import { Component } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsPerson } from 'react-icons/bs';
import styles from './Auth.module.css';
import bgStyles from './background.module.css';

import SigninBtn from './signinBtn/SigninBtn';

import { app } from '../../configs/firebase.config';
import { AuthLib } from '../../utils/AuthLib';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default class Auth extends Component {
	static contextType = AuthContext;
	context!: React.ContextType<typeof AuthContext>;

	handleGoogleLogin() {
		AuthLib.handleGoogleLogin(app)
			.catch((err) => {
				// TODO
				console.log(err);
			});
	}

	handleGuestLogin() {
		AuthLib.handleGuestLogin(app)
			.catch((err) => {
				// TODO
				console.log(err);
			});
	}

	render() {
		if (this.context.authenticated === false) {
			return (
				<div className={styles.wrapper}>
					<div className={styles.welcome}>
						<h2 className={styles.heading}>Welcome to</h2>
						<h1 className={styles.heading}>Tic-Tac-Toe Online</h1>
					</div>
					<div className={styles.board}>
						<SigninBtn login={this.handleGoogleLogin.bind(this)} classes={styles['white-bg']} text="Sign in with Google" >
							<FcGoogle size={'25px'} />
						</SigninBtn>
						<SigninBtn login={this.handleGuestLogin.bind(this)} classes={styles['yellow-bg']} text="Continue as guest" >
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
		} else {
			return <Navigate to='/' />
		}
	}
}
