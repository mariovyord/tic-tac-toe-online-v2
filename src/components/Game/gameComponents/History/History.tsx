import style from './History.module.css';

interface IHistory {
	historyArray: string[][],
	handleHistoryJump: Function,
}

const History: React.FC<IHistory> = ({ historyArray, handleHistoryJump }) => {
	return (
		<div>
			{historyArray
				.slice(1)
				.map((x, i) => <button className={style['history-button']} onClick={() => handleHistoryJump(i + 1)} key={i}>Turn {i + 1}</button>)}
		</div>
	)
}

export default History;