import styles from './Cell.module.css';

interface ICell {
	cellId: number,
	current: string[],
	handleClick: Function,
	winningSquares: boolean[],
}

const Cell: React.FC<ICell> = ({ cellId, current, handleClick, winningSquares }) => {
	return <td className={winningSquares[cellId] ? styles['winning-cell'] : ''} onClick={() => handleClick(cellId)}>
		<span>{current[cellId]}</span>
	</td>
}

export default Cell;