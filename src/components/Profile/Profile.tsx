import { collection, getDocs, orderBy, query, where, DocumentData, limitToLast } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../configs/firebase.config';
import styles from './Profile.module.css';
import Table from './table/Table';
import Spinner from '../common/Spinner/Spinner';
import { useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../app/slices/authSlice';

interface IState {
	pveGames: DocumentData[],
	pvpGames: DocumentData[],
}

const Profile: React.FC = () => {
	const [state, setState] = useState<IState>({
		pveGames: [],
		pvpGames: [],
	})

	const user = useAppSelector(selectAuth);

	useEffect(() => {
		// GET all PvE games
		if (user && user.isAnonymous === false) {
			const refPvE = collection(db, 'games');
			const queryPvE = query(refPvE,
				where("playersIds", "array-contains", user.uid),
				where("mode", "==", "pve"),
				orderBy("createdAt"),
				limitToLast(10),
			);

			getDocs(queryPvE)
				.then((doc) => {
					const result: DocumentData[] = []
					doc.forEach(x => {
						const data = x.data();
						data.id = x.id;
						result.unshift(data);
					});

					setState((state) => {
						return {
							...state,
							pveGames: result,
						}
					})

				})

			const refPvP = collection(db, 'games');
			const queryPvP = query(refPvP,
				where("playersIds", "array-contains", user.uid),
				where("mode", "==", "pvp"),
				orderBy("createdAt"),
				limitToLast(10),
			);

			getDocs(queryPvP)
				.then((doc) => {
					const result: DocumentData[] = []
					doc.forEach(x => {
						const data = x.data();
						data.id = x.id;
						result.unshift(data);
					});
					setState((state) => {
						return {
							...state,
							pvpGames: result,
						}
					})

				})
		}
	})

	const UserProfile = () => <div className={styles.wrapper}>
		<div className={styles.profile}>
			<div className={styles.section}>
				<div className={styles['profile-img-wrapper']}>
					<img className={styles['profile-img']} src={user?.photoURL || 'https://i.imgur.com/73kg6yl.png'} alt={user?.displayName || 'Anonymous'} referrerPolicy="no-referrer" />
				</div>
				<h1 className={styles.name}>{user?.displayName}</h1>
			</div>
			<div className={styles.section}>
				<h2>Your last 10 games vs other players</h2>
				<Table games={state.pvpGames} uid={user?.uid || ''} />
			</div>
			<div className={styles.section}>
				<h2>Your last 10 games vs Super AI:</h2>
				<Table games={state.pveGames} uid={user?.uid || ''} />
			</div>
		</div>
	</div>

	const AnonymousProfile = () => <div className={styles.wrapper}>
		<div className={styles.profile}>
			<div className={styles.section}>
				<div className={styles['profile-img-wrapper']}>
					<img className={styles['profile-img']} src={'https://i.imgur.com/73kg6yl.png'} alt={'Anonymous'} referrerPolicy="no-referrer" />
				</div>
				<h1 className={styles.name}>Anonymous</h1>
			</div>
			<div className={styles.section}>
				<h2>To view and review your games history, you should login with your Google account.</h2>
			</div>
		</div>
	</div>

	const Loading = () => <div className={styles.wrapper}>
		<div className={styles.profile}>
			<Spinner />
		</div>
	</div >

	if (state && user?.isAnonymous === false) {
		return <UserProfile />
	} else if (user && user.isAnonymous === true) {
		return <AnonymousProfile />
	} else {
		return <Loading />
	}
}

export default Profile;