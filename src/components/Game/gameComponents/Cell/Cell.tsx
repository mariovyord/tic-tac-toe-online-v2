import { TSigns } from '../../../../types/game.types';
import styles from './Cell.module.css';

interface ICell {
	cellId: number,
	current: TSigns[],
	handleClick: Function,
	winningSquares: boolean[],
}

const Cell: React.FC<ICell> = ({ cellId, current, handleClick, winningSquares }) => {
	if (current[cellId] === 'x') {
		return <td className={`${winningSquares[cellId] ? styles['winning-cell'] : ''} ${styles['cell-x']} ${styles['cell']}`} onClick={() => handleClick(cellId)}>
			<span></span>
		</td>
	} else if (current[cellId] === 'o') {
		return <td className={`${winningSquares[cellId] ? styles['winning-cell'] : ''} ${styles['cell-o']} ${styles.cell}`} onClick={() => handleClick(cellId)}>
			<span></span>
		</td>

	} else {
		return <td className={`${winningSquares[cellId] ? styles['winning-cell'] : ''}  ${styles.cell}`} onClick={() => handleClick(cellId)}>
			<span></span>
		</td>
	}
}

export default Cell;