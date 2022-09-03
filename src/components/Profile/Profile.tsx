import React, { useEffect } from 'react'
import styles from './Profile.module.css';
import Table from './table/Table';
import Spinner from '../common/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../app/slices/authSlice';
import { fetchUserHistory, selectProfile } from '../../app/slices/profileSlice';

const Profile: React.FC = () => {
	const user = useAppSelector(selectAuth);
	const gamesHistory = useAppSelector(selectProfile);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user && user.isAnonymous === false) {
			// fetch user history to profile
			dispatch(fetchUserHistory(user.uid));
		}
	}, [user, dispatch]);

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
				<Table games={gamesHistory.pvpGames} uid={user?.uid || ''} />
			</div>
			<div className={styles.section}>
				<h2>Your last 10 games vs Super AI:</h2>
				<Table games={gamesHistory.pveGames} uid={user?.uid || ''} />
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

	if (gamesHistory.status === 'idle' && user && user.isAnonymous === false) {
		return <UserProfile />
	} else if (gamesHistory.status === 'idle' && user && user.isAnonymous === true) {
		return <AnonymousProfile />
	} else {
		return <Loading />
	}
}

export default Profile;