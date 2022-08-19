interface IHistory {
	historyArray: [],
	handleHistoryJump: Function,
}

const History: React.FC<IHistory> = ({ historyArray, handleHistoryJump }) => {
	return (
		<div>
			{historyArray.map((x, i) => <button className="history-button" onClick={() => handleHistoryJump(i)} key={i}>Turn {i}</button>)}
		</div>
	)
}

export default History;