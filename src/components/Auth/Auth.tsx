import { Component } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsPerson } from 'react-icons/bs';
import styles from './Auth.module.css';
import bgStyles from './background.module.css';

import SigninBtn from './signinBtn/SigninBtn';

import { app } from '../../configs/firebase.config';
import { AuthLib } from '../../utils/AuthLib';
import { Link, Navigate } from 'react-router-dom';

interface IProps {
	authenticated: boolean,
}

const Auth: React.FC<IProps> = ({ authenticated }) => {
	const handleGoogleLogin = () => {
		AuthLib.handleGoogleLogin(app)
			.catch((err) => {
				// TODO
				console.log(err);
			});
	}

	const handleGuestLogin = () => {
		AuthLib.handleGuestLogin(app)
			.catch((err) => {
				// TODO
				console.log(err);
			});
	}

	if (authenticated === false) {
		return (
			<div className={styles.wrapper}>
				<div className={styles.welcome}>
					<h2 className={styles.heading}>Welcome to</h2>
					<h1 className={styles.heading}>Tic-Tac-Toe Online</h1>
				</div>
				<div className={styles.board}>
					<SigninBtn login={handleGoogleLogin.bind(this)} classes={styles['white-bg']} text="Sign in with Google" >
						<FcGoogle size={'25px'} />
					</SigninBtn>
					<SigninBtn login={handleGuestLogin.bind(this)} classes={styles['yellow-bg']} text="Continue as guest" >
						<BsPerson size={'25px'} />
					</SigninBtn>
					<div className={styles.notice}>
						<span>By signing in you agree <br />to our <Link className={styles.privacyLink} to="/privacypolicy">Privacy Policy</Link></span>
					</div>
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

export default Auth;