import React, { useEffect, useState } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { IGame, TGameArray } from '../../../../types/game.types';

import { serverTimestamp, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const gameData = useAppSelector(selectPvP);
	const user = useAppSelector(selectAuth);

	// on mount 
	useEffect(() => {
		updateGameState()
	}, []);

	// check game state for draw
	useEffect(() => {
		// check if the game is draw
		if (gameData.game) {
			const isFull = gameData.game.history[gameData.game.step].filter((x: any) => !x);

			if (isFull.length === 0 && gameData.winner === undefined) {
				if (user?.uid === gameData.game.owner) {
					dispatch(pvpActions.endGame({
						winner: 'draw',
						winningSquares: Array(9).fill(false)
					}))
					saveGameToDb('draw');
				}
			}
		}
	}, [])

	function saveGameToDb(winner: 'x' | 'o' | 'draw') {
		if (gameData.game) {
			const data = {
				owner: user?.uid,
				mode: 'pvp',
				history: JSON.stringify([...gameData.game.history]),
				playersIds: gameData.game.playersIds,
				playerDisplayNames: gameData.game.playerDisplayNames,
				playerSigns: gameData.game.playerSigns,
				winner: winner,
				createdAt: serverTimestamp(),
			}

			const ref = collection(db, "games")
			addDoc(ref, data);
			deleteGameSession();

			// TODO Clear redux game state
		}
	}

	function deleteGameSession() {
		deleteDoc(doc(db, "activeGames", gameData.gameId));
	}

	function updateGameState() {
		onSnapshot(doc(db, "activeGames", params.id as string), (doc) => {
			const data = doc.data();
			if (data && user) {
				const history = JSON.parse(data.history);

				dispatch(pvpActions.updateGameState(
					{
						...gameData,
						game: {
							...data as IGame,
							history: history,
							createdAt: firebaseDateToString(data.createdAt)
						},
						gameId: params.id as string,
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
				winner: winner,
				winningSquares: pattern
			}))
			saveGameToDb(winner);
		}
	}

	function handleClick(num: number) {
		if (gameData.game) {
			const current: TGameArray = gameData.game.history[gameData.game.step];

			if (gameData.winner !== undefined) return;
			if (gameData.game.turn !== gameData.game.playerSigns[gameData.userIndex] || current[num] !== null) return;

			const playersSquares = (function () {
				let playersSquares: TGameArray = [...current];
				playersSquares[num] = gameData.game.playerSigns[gameData.userIndex];
				return playersSquares;
			})();

			const newHistory = [...gameData.game.history];

			newHistory.push(playersSquares);
			const ref = doc(db, "activeGames", gameData.gameId);

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
					{gameData.winner && <Winner
						result={(function () {
							if (gameData.winner === 'draw') return 'draw';
							if (gameData.winner === gameData.game.playerSigns[gameData.userIndex]) return 'win';
							return 'lose';
						})()}
						handleRestartGame={handleRestartGame.bind(this)} />}
				</div>
			</div>
		)
	}
}

export default GamePvP;