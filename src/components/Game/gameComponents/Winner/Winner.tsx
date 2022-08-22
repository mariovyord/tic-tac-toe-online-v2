import NewGameButton from '../NewGamebutton/NewGameButton';
import style from './Winner.module.css';

interface IWinner {
	winner: string,
	handleRestartGame: Function,
}

const Winner: React.FC<IWinner> = ({ winner, handleRestartGame }) => {
	return (
		<div className={style['win-modal']}>
			<h2 className={style.win}>{winner} is the winner!</h2>
			<NewGameButton handleRestartGame={handleRestartGame} />
		</div>
	)
}

export default Winner;