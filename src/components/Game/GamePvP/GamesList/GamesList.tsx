import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectAuth } from '../../../../app/slices/authSlice';
import { getList, selectList } from '../../../../app/slices/listSlice';
import { db } from '../../../../configs/firebase.config';
import { IGame } from '../../../../types/game.types';
import Spinner from '../../../common/Spinner/Spinner';
import styles from './GamesList.module.css';

const GamesList: React.FC = () => {
	const list = useAppSelector(selectList);
	const user = useAppSelector(selectAuth);
	const dispatch = useAppDispatch();
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getList());
	}, [dispatch])

	const handleJoinGame = (game: IGame) => {
		if (user) {
			const updatedProperties = {
				open: false,
				playerDisplayNames: [game.playerDisplayNames[0], user.displayName || 'Anonymous'],
				playersIds: [game.playersIds[0], user.uid],
			}

			const ref = doc(db, "activeGames", game.id);
			updateDoc(ref, updatedProperties)
				.then(() => {
					navigate(`/game/PvP/${game.id}`);
				})
		}
	}

	return (
		<div className={styles.wrapper}>
			{list.status !== 'idle'
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
					{list.openGames.length > 0 && list.openGames.map(game => {
						return <tr key={game.id} className={styles.row}>
							<td className={styles.td}>{game.createdAt.split('T').join(', ').slice(0, -5)}</td>
							<td className={styles.td}>{game.playerDisplayNames[0]}</td>
							<td className={`${styles.td} ${styles.join}`} onClick={() => handleJoinGame(game as IGame)}>Join</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>
	)
}

export default GamesList;
