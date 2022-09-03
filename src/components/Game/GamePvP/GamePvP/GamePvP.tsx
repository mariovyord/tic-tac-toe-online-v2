import React, { useEffect, useState } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { IGame, TGameArray } from '../../../../types/game.types';

import { serverTimestamp, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../../../configs/firebase.config';
import Spinner from '../../../common/Spinner/Spinner';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectAuth } from '../../../../app/slices/authSlice';
import { pvpActions, selectPvP } from '../../../../app/slices/pvpSlice';
import { getWinner } from '../../../../utils/getWinner/getWinner';
import { firebaseDateToString } from '../../../../utils/utils';



const GamePvP: React.FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const gameData = useAppSelector(selectPvP);
	const user = useAppSelector(selectAuth);

	// on mount 
	useEffect(() => {
		updateGameState()
	}, [])

	// check game state for draw
	useEffect(() => {
		// if (state.game) {
		// 	// check if the game is draw
		// 	const isFull = state.game.history[state.game.step].filter((x: any) => !x);

		// 	if (isFull.length === 0 && state.winner === undefined) {
		// 		if (user?.uid === state.game.owner) {
		// 			const data = {
		// 				owner: user?.uid,
		// 				mode: 'pvp',
		// 				history: JSON.stringify([...state.game.history]),
		// 				playersIds: state.game.playersIds,
		// 				playerDisplayNames: state.game.playerDisplayNames,
		// 				playerSigns: state.game.playerSigns,
		// 				winner: 'draw',
		// 				createdAt: serverTimestamp(),
		// 			}

		// 			const ref = collection(db, "games")
		// 			addDoc(ref, data);
		// 			deleteGameSession();
		// 		}
		// 		setState((st) => ({
		// 			...st,
		// 			winner: 'draw',
		// 		}))
		// 	}
		// }
	}, [])


	function deleteGameSession() {
		// deleteDoc(doc(db, "activeGames", state.gameId));
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
						userIndex: data.playersIds.indexOf(user.uid)
					},
				))

				checkForWinner(history[history.length - 1]);
			}
		});
	}

	function checkForWinner(squares: []) {
		const [winner, pattern] = getWinner(squares);
		if (winner) {
			console.log('WINNER', winner);
		}
		// TODO	

		// check if user is not anonymous and save game db
		// if (user?.uid === state.game.owner) {
		// 	const data = {
		// 		owner: user?.uid,
		// 		mode: 'pvp',
		// 		history: JSON.stringify([...state.game.history, squares]),
		// 		playersIds: state.game.playersIds,
		// 		playerDisplayNames: state.game.playerDisplayNames,
		// 		playerSigns: state.game.playerSigns,
		// 		winner: squares[combo[0]],
		// 		createdAt: serverTimestamp(),
		// 	}

		// 	const ref = collection(db, "games")
		// 	addDoc(ref, data)
		// 	deleteGameSession();
		// }

		// end the game
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
		// TODO move delete active game here
		// navigate('/game/PvP');
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
						result={gameData.winner}
						handleRestartGame={handleRestartGame.bind(this)} />}
				</div>
			</div>
		)
	}
}

export default GamePvP;