import { User } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where, DocumentData, limitToLast } from 'firebase/firestore';
import React, { Component } from 'react'
import { auth, db } from '../../configs/firebase.config';
import styles from './Profile.module.css';
import Table from './table/Table';
import Spinner from '../common/Spinner/Spinner';

interface IState {
	user: null | User,
	pveGames: DocumentData[],
	pvpGames: DocumentData[],
}

export default class Profile extends Component<{}, IState> {
	constructor({ }) {
		super({});
		this.state = {
			user: auth.currentUser,
			pveGames: [],
			pvpGames: [],
		}
	}

	componentDidMount() {

		// GET all PvE games
		if (this.state.user && this.state.user.isAnonymous === false) {
			const ref = collection(db, 'games');
			const q = query(ref,
				where("playersIds", "array-contains", this.state.user.uid),
				where("mode", "==", "pve"),
				orderBy("createdAt"),
				limitToLast(10),
			);

			getDocs(q)
				.then((doc) => {
					const result: DocumentData[] = []
					doc.forEach(x => {
						const data = x.data();
						data.id = x.id;
						result.unshift(data);
					});

					this.setState({
						pveGames: result,
					})

				})
		}
	}

	render() {
		// TODO if user is falsy return spinner
		if (this.state.user && this.state.user.isAnonymous === false) {
			return (
				<div className={styles.wrapper}>
					<div className={styles.profile}>
						<div className={styles.section}>
							<div className={styles['profile-img-wrapper']}>
								<img className={styles['profile-img']} src={this.state.user.photoURL || 'https://i.imgur.com/73kg6yl.png'} alt={this.state.user.displayName || 'Anonymous'} referrerPolicy="no-referrer" />
							</div>
							<h1 className={styles.name}>{this.state.user.displayName}</h1>
						</div>
						<div className={styles.section}>
							<h2>Last 10 games vs Super AI:</h2>
							<Table pveGames={this.state.pveGames} uid={this.state.user.uid} />
						</div>
					</div>
				</div>
			)
		} else if (this.state.user && this.state.user.isAnonymous === true) {
			return <div className={styles.wrapper}>
				<div className={styles.profile}>
					<div className={styles.section}>
						<div className={styles['profile-img-wrapper']}>
							<img className={styles['profile-img']} src={'https://i.imgur.com/73kg6yl.png'} alt={'Anonymous'} referrerPolicy="no-referrer" />
						</div>
						<h1 className={styles.name}>Anonymous</h1>
					</div>
					<div className={styles.section}>
						<h2>To build your account and view your games history, you should login with your Google account.</h2>
					</div>
				</div>
			</div>
		} else {
			return (
				<div className={styles.wrapper}>
					<div className={styles.profile}>
						<Spinner />
					</div>
				</div >
			)
		}
	}
}
