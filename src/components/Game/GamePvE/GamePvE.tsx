import React, { useEffect } from 'react'
import ai from '../../../utils/ai/ai';

import GameTable from '../gameComponents/GameTable';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';
import Winner from '../gameComponents/Winner/Winner';

import style from './GamePvE.module.css';
import { TGameArray } from '../../../types/game.types';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAuth } from '../../../app/slices/authSlice';
import { pveActions, selectPvE } from '../../../app/slices/pveSlice';
import { getWinner } from '../../../utils/getWinner/getWinner';
import Spinner from '../../common/Spinner/Spinner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../configs/firebase.config';


const GamePvE: React.FC = () => {
	const gameState = useAppSelector(selectPvE);
	const user = useAppSelector(selectAuth);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (gameState.game.step === 0) {
			startGame();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function startGame() {
		const userSign = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const computerSign = userSign === 'x' ? 'o' : 'x';

		if (user) {
			dispatch(pveActions.startGame({
				userId: user.uid,
				displayName: user.displayName || 'Anonymous',
				signs: [userSign, computerSign]
			}));

			// check if AI is first and make a move if it is
			setTimeout(() => {
				if (computerSign === 'x') {
					const computerMove = ai(computerSign, gameState.game.history[0]);
					computerMoveFunc(computerMove);
				}
			}, 500)
		}
	}

	function computerMoveFunc(computerSquares: any) {
		dispatch(pveActions.makeAMove(computerSquares))

		checkForWinner(computerSquares);
	}

	function checkForWinner(squares: []) {
		const [winner, pattern] = getWinner(squares);

		if (winner) {
			dispatch(pveActions.endGame({
				winner: winner,
				winningSquares: pattern,
			}))
			saveGameToDb(winner, squares)
			return true;
		}
		return false;
	}

	function saveGameToDb(winner: string, finalSquares: []) {
		const data: any = Object.assign({}, gameState.game);
		data.history = JSON.stringify([...data.history, finalSquares]);
		data.createdAt = serverTimestamp();
		data.finished = true;
		data.winner = winner;

		if (user && user.isAnonymous === false) {
			const ref = collection(db, "games")
			addDoc(ref, data)
		}
	}

	const handleClick = (num: number) => {
		if (gameState.game === null) return;

		const userSign = gameState.game.playerSigns[0];
		const computerSign = gameState.game.playerSigns[1];

		const current: TGameArray = gameState.game.history[gameState.game.step];

		if (gameState.game.step !== (gameState.game.history.length - 1) || gameState.game.step < 0) return;
		if (gameState.game.winner) return;
		if (gameState.game.turn !== userSign || current[num] !== null) return;
		if (gameState.game.turn === computerSign) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares: TGameArray = [...current];
			playersSquares[num] = userSign;
			// add computer move to second array
			const computerSquares = ai(computerSign, playersSquares);
			console.log('player', playersSquares);
			console.log('computerSquares', computerSquares);

			return [playersSquares, computerSquares];
		}

		const [playersSquares, computerSquares] = handleTurn();

		dispatch(pveActions.makeAMove(playersSquares));

		const hasWinner = checkForWinner(playersSquares);
		if (hasWinner) return;
		// AI makes a move after little delay
		setTimeout(() => {
			computerMoveFunc(computerSquares);
		}, 500)
	}

	const handleRestartGame = () => {
		dispatch(pveActions.resetGame());
		startGame();
	}

	if (gameState.status !== 'idle') {
		return <Spinner />
	} else {
		const userSign = gameState.game!.playerSigns[0];
		const userDisplayName = gameState.game!.playerDisplayNames[0];
		const computerDisplayName = gameState.game!.playerDisplayNames[1];

		return <div className={`${style.container}`}>
			<div className={style.player1}>
				<PlayerCard displayName={userSign === 'x' ? userDisplayName : computerDisplayName} sign={'x'} yourTurn={gameState.game!.turn === 'x'} />
			</div>
			<div className={style.player2}>
				<PlayerCard displayName={userSign === 'o' ? userDisplayName : computerDisplayName} sign={'o'} yourTurn={gameState.game!.turn === 'o'} />
			</div>
			<div className={style.game}>
				<GameTable winningSquares={gameState.winningSquares} history={gameState.game!.history} step={gameState.game!.step} handleClick={handleClick} />
				{gameState.game!.winner && <Winner
					result={(function () {
						if (gameState.game!.winner === 'draw') return 'draw';
						if (gameState.game!.winner === userSign) return 'win';
						return 'lose';
					})()}
					handleRestartGame={handleRestartGame} />}
			</div>
		</div>
	}
}

export default GamePvE;