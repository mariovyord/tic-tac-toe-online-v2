interface IBtn {
	handleRestartGame: Function,
}

const NewGameButton: React.FC<IBtn> = ({ handleRestartGame }) => {
	return <button className="new-game-button" onClick={() => handleRestartGame()}>New Game</button>
}

export default NewGameButton;