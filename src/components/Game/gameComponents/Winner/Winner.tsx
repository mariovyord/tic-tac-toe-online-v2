import style from './Winner.module.css';

interface IWinner {
	winner: string,
}

const Winner: React.FC<IWinner> = ({ winner }) => {
	return (
		<>
			<h2 className={style.win}>{winner} is the winner!</h2>
		</>
	)
}

export default Winner;