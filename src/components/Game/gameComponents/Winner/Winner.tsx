import NewGameButton from '../NewGamebutton/NewGameButton';
import style from './Winner.module.css';

interface IWinner {
	result: 'win' | 'lose' | 'draw';
	handleRestartGame: Function,
}

const Winner: React.FC<IWinner> = ({ result, handleRestartGame }) => {
	return (
		<div className={style['win-modal']}>
			{result === 'win' && <h2 className={`${style.win} ${style.heading}`}>You win!</h2>}
			{result === 'lose' && <h2 className={`${style.lose} ${style.heading}`}>You lose!</h2>}
			{result === 'draw' && <h2 className={`${style.draw} ${style.heading}`}>Draw!</h2>}
			<NewGameButton handleRestartGame={handleRestartGame} />
		</div>
	)
}

export default Winner;