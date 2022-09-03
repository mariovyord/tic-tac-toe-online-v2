import { DocumentData } from 'firebase/firestore'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../../../../utils/utils';
import styles from './Row.module.css';

interface IProps {
	game: DocumentData,
	ending: string
}

export const Row: React.FC<IProps> = ({ game, ending }) => {
	const xIndex = game.playerSigns.indexOf('x');
	const navigate = useNavigate()

	const handleClick = (id: string) => {
		navigate(`/game/${id}`);
	}

	return <tr className={styles.row} onClick={() => handleClick(game.id)}>
		<td className={styles.td}>{game.createdAt.split('T').join(', ').slice(0, -5)}</td>
		<td className={styles.td}>{game.playerDisplayNames[xIndex]} vs {game.playerDisplayNames[xIndex === 1 ? 0 : 1]}</td>
		<td className={`${styles[ending]} ${styles.td}`}>{toTitleCase(ending)}</td>
	</tr>
}
