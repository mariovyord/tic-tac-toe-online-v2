import React, { useEffect, useState } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { IParsedGame, TGameArray } from '../../../../types/game.types';

import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from '../../../../configs/firebase.config';
import Spinner from '../../../common/Spinner/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectAuth } from '../../../../app/slices/authSlice';
import { pvpActions, selectPvP } from '../../../../app/slices/pvpSlice';
import { getWinner } from '../../../../utils/getWinner/getWinner';
import { firebaseDateToString } from '../../../../utils/utils';

// TODO Add error handling 

const GamePvP: React.FC = () => {
	const { id: gameId } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const gameData = useAppSelector(selectPvP);
	const user = useAppSelector(selectAuth);

	// on mount 
	useEffect(() => {
		updateGameState()
	}, []);

	function saveGameToDb(winner: 'x' | 'o' | 'draw') {

		const ref = doc(db, "games", gameId as string);

		updateDoc(ref, {
			winner: winner,
			finished: true,
		})
			.then(() => {
				console.log('it works');

			})
			.catch(err => {
				// TODO ...
				console.log(err);
			})
	}

	function updateGameState() {

		onSnapshot(doc(db, "games", gameId as string), (doc) => {
			const data = doc.data();
			if (data && user) {
				const history = JSON.parse(data.history);

				console.log('params.id', gameId);
				dispatch(pvpActions.updateGameState(
					{
						...gameData,
						game: {
							...data as IParsedGame,
							history: history,
							createdAt: firebaseDateToString(data.createdAt)
						},
						gameId: gameId as string,
						xIndex: data.playerSigns.indexOf('x'),
						userIndex: data.playersIds.indexOf(user.uid),
						status: 'idle'
					},
				))

				checkForWinner(history[history.length - 1]);
			}
		});
	}

	function checkForWinner(squares: []) {
		const [winner, pattern] = getWinner(squares);

		if (winner) {
			dispatch(pvpActions.endGame({
				winningSquares: pattern
			}))

			saveGameToDb(winner);
		}
	}

	function handleClick(num: number) {
		if (gameData.game) {
			const current: TGameArray = gameData.game.history[gameData.game.step];

			if (gameData.game.winner) return;
			if (gameData.game.turn !== gameData.game.playerSigns[gameData.userIndex] || current[num]) return;

			const playersSquares = (function () {
				let playersSquares: TGameArray = [...current];
				playersSquares[num] = gameData.game.playerSigns[gameData.userIndex];
				return playersSquares;
			})();

			const newHistory = [...gameData.game.history];

			newHistory.push(playersSquares);
			const ref = doc(db, "games", gameData.gameId);

			updateDoc(ref, {
				history: JSON.stringify(newHistory),
				step: gameData.game.step + 1,
				turn: gameData.game.turn === 'x' ? 'o' : 'x',
			}).catch(err => {
				// TODO ...
				console.log(err);
			})
		}
	}

	function handleRestartGame() {
		dispatch(pvpActions.resetGame());
		navigate('/game/PvP');
	}

	if (gameData.game === null || gameData.status === 'loading' || gameData.game.playersIds.filter((x: any) => x !== '').length < 2) {
		return <div className={`${style.container}`}>
			<div></div>
			<div>
				<h2 className={style.waiting}>Waiting for players</h2>
				<Spinner />
			</div>
			<div></div>
		</div>
	} else {
		return (
			<div className={`${style.container}`}>
				<div className={style.player1}>
					<PlayerCard
						displayName={gameData.game.playerDisplayNames[gameData.xIndex]}
						sign={'x'}
						yourTurn={gameData.game.turn === 'x'} />
				</div>
				<div className={style.player2}>
					<PlayerCard
						displayName={gameData.game.playerDisplayNames[gameData.xIndex === 0 ? 1 : 0]}
						sign={'o'}
						yourTurn={gameData.game.turn === 'o'} />
				</div>
				<div className={style.game}>
					<GameTable
						winningSquares={gameData.winningSquares}
						history={gameData.game.history}
						step={gameData.game.step}
						handleClick={handleClick} />
					{gameData.game.winner && <Winner
						result={(function () {
							if (gameData.game.winner === 'draw') return 'draw';
							if (gameData.game.winner === gameData.game.playerSigns[gameData.userIndex]) return 'win';
							return 'lose';
						})()}
						handleRestartGame={handleRestartGame.bind(this)} />}
				</div>
			</div>
		)
	}
}

export default GamePvP;