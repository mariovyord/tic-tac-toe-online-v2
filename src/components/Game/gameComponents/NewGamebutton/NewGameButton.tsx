import style from './NewGameButton.module.css';

interface IBtn {
	handleRestartGame: Function,
}

const NewGameButton: React.FC<IBtn> = ({ handleRestartGame }) => {
	return <button className={style['new-game-button']} onClick={() => handleRestartGame()}>New Game</button>
}

export default NewGameButton;