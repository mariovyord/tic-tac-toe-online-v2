import { User } from 'firebase/auth';
import { collection, doc, DocumentData, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../../../../configs/firebase.config';
import Spinner from '../../../common/Spinner/Spinner';
import styles from './GamesList.module.css';

interface IState {
	openGames: DocumentData[],
	loading: boolean,
	user: null | User,
	navigateTo: string,
}

const GamesList: React.FC = () => {
	const [state, setState] = useState<IState>({
		openGames: [],
		loading: false,
		user: auth.currentUser,
		navigateTo: '',
	})

	useEffect(() => {
		if (state.user) {
			const ref = collection(db, 'activeGames');
			const q = query(ref,
				where("mode", "==", "pvp"),
				where("open", "==", true),
				orderBy("createdAt"),
			);

			getDocs(q)
				.then((doc) => {
					const result: DocumentData[] = []
					doc.forEach(x => {
						const data = x.data();
						data.id = x.id;
						result.unshift(data);
					});

					setState((st) => ({
						...st,
						openGames: result,
					}))

				})
		}
	}, [])

	const handleJoinGame = (game: any) => {
		// check if its already loading game 
		if (state.loading === true) return;

		setState((st) => ({
			...st,
			loading: true,
		}))

		const updatedGame = { ...game };
		updatedGame.open = false;
		updatedGame.playerDisplayNames[1] = state.user?.displayName || 'Anonymous';
		updatedGame.playersIds[1] = state.user?.uid;

		const ref = doc(db, "activeGames", game.id);
		updateDoc(ref, updatedGame)
			.then(() => {
				setState((st) => ({
					...st,
					navigateTo: `/game/PvP/${game.id}`,
				}))
			})
			.catch(err => {
				// TODO ...
				console.log(err);
			})
			.finally(() => {
				setState((st) => ({
					...st,
					loading: false,
				}))
			})

	}

	if (state.navigateTo) {
		return (
			<Navigate to={state.navigateTo} />
		)
	} else {
		return (
			<div className={styles.wrapper}>
				{state.loading
					? <div className='absolute'>
						<Spinner />
					</div>
					: null}
				<h1 className='mb-3'>Open games</h1>
				<table className={styles.table}>
					<thead>
						<tr>
							<td>Date</td>
							<td>Opponent</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{state.openGames.map(game => {
							return <tr key={game.id} className={styles.row}>
								<td className={styles.td}>{game.createdAt.toDate().toISOString().split('T').join(', ').slice(0, -5)}</td>
								<td className={styles.td}>{game.playerDisplayNames[0]}</td>
								<td className={`${styles.td} ${styles.join}`} onClick={handleJoinGame.bind(this, game)}>Join</td>
							</tr>
						})}
					</tbody>
				</table>
			</div>
		)
	}
}

export default GamesList;
