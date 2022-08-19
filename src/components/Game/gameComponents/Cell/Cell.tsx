interface ICell {
	cellId: number,
	current: string,
	handleClick: Function,
	isWinning: boolean[],
}

const Cell: React.FC<ICell> = ({ cellId, current, handleClick, isWinning }) => {
	return <td className={isWinning[cellId] ? 'winning-cell' : ''} onClick={() => handleClick(cellId)}>
		<span>{current[cellId]}</span>
	</td>
}

export default Cell;