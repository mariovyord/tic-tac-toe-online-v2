import { DocumentData } from 'firebase/firestore'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Row.module.css';

interface IProps {
	game: DocumentData,
	isWinner: boolean
}

export const Row: React.FC<IProps> = ({ game, isWinner }) => {
	const xIndex = game.playerSigns.indexOf('x');
	const navigate = useNavigate()

	const handleClick = (id: string) => {
		navigate(`/game/${id}`);
	}

	return <tr className={styles.row} key={game.id} onClick={() => handleClick(game.id)}>
		<td className={styles.td}>{game.createdAt.toDate().toISOString().split('T').join(', ').slice(0, -5)}</td>
		<td className={styles.td}>{game.playerDisplayNames[xIndex]} vs {game.playerDisplayNames[xIndex === 1 ? 0 : 1]}</td>
		<td className={`${isWinner ? styles.win : styles.loss} ${styles.td}`}>{isWinner ? 'Win' : 'Loss'}</td>
	</tr>
}
