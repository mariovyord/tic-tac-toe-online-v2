import style from './History.module.css';

interface IHistory {
	historyArray: string[][],
	handleHistoryJump: Function,
}

const History: React.FC<IHistory> = ({ historyArray, handleHistoryJump }) => {
	return (
		<div>
			{historyArray.map((x, i) => <button className={style['history-button']} onClick={() => handleHistoryJump(i)} key={i}>Turn {i}</button>)}
		</div>
	)
}

export default History;