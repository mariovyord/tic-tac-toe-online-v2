import React, { useEffect, useState } from 'react'

import GameTable from '../../gameComponents/GameTable';
import PlayerCard from '../../gameComponents/PlayerCard/PlayerCard';
import Winner from '../../gameComponents/Winner/Winner';

import style from './GamePvP.module.css';
import { TGameArray } from '../../../../types/game.types';

import { serverTimestamp, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { User } from 'firebase/auth';
import { auth, db } from '../../../../configs/firebase.config';
import Spinner from '../../../common/Spinner/Spinner';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

interface IState {
	user: null | User,
	userIndex: 0 | 1,
	game: null | any,
	gameId: string,
	xIndex: 0 | 1,
	winner: undefined | 'win' | 'lose' | 'draw',
	winningSquares: boolean[],
	loading: boolean,
	redirect: string,
}

const GamePvP: React.FC = () => {
	const params = useParams();
	const navigate = useNavigate();

	const [state, setState] = useState<IState>({
		user: auth.currentUser,
		userIndex: 0,
		game: null,
		gameId: params.id!,
		xIndex: 0,
		winner: undefined,
		winningSquares: Array(9).fill(false),
		loading: true,
		redirect: '',
	})

	// on mount 
	useEffect(() => {
		handleUpdateGame()
	}, [])

	// check game state for draw
	useEffect(() => {
		if (state.game) {
			// check if the game is draw
			const isFull = state.game.history[state.game.step].filter((x: any) => !x);

			if (isFull.length === 0 && state.winner === undefined) {
				if (state.user?.uid === state.game.owner) {
					const data = {
						owner: state.user?.uid,
						mode: 'pvp',
						history: JSON.stringify([...state.game.history]),
						playersIds: state.game.playersIds,
						playerDisplayNames: state.game.playerDisplayNames,
						playerSigns: state.game.playerSigns,
						winner: 'draw',
						createdAt: serverTimestamp(),
					}

					const ref = collection(db, "games")
					addDoc(ref, data);
					deleteGameSession();
				}
				setState((st) => ({
					...st,
					winner: 'draw',
				}))
			}
		}
	}, [state.game])


	function deleteGameSession() {
		deleteDoc(doc(db, "activeGames", state.gameId));
	}

	function handleUpdateGame() {
		onSnapshot(doc(db, "activeGames", state.gameId), (doc) => {
			const data = doc.data();
			console.log(data)
			if (data) {
				const history = JSON.parse(data.history);
				setState((st) => ({
					...st,
					game: { ...data, history: history },
					loading: false,
					xIndex: data.playerSigns.indexOf('x'),
					userIndex: data.playersIds.indexOf(state.user?.uid),
				}))
				checkForWinner(history[history.length - 1]);
			}
		});
	}

	// TODO doesnt end the game for some reason
	function checkForWinner(squares: []) {
		const combos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let combo of combos) {
			if (!squares[combo[0]] || !squares[combo[1]] || !squares[combo[2]]) {
			} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
				const win = [...state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				// check if user is not anonymous and save game db
				if (state.user?.uid === state.game.owner) {
					const data = {
						owner: state.user?.uid,
						mode: 'pvp',
						history: JSON.stringify([...state.game.history, squares]),
						playersIds: state.game.playersIds,
						playerDisplayNames: state.game.playerDisplayNames,
						playerSigns: state.game.playerSigns,
						winner: squares[combo[0]],
						createdAt: serverTimestamp(),
					}

					const ref = collection(db, "games")
					addDoc(ref, data)
					deleteGameSession();
				}

				// end the game
				return setState((st) => ({
					...st,
					winningSquares: win,
					winner: state.game.playerSigns[state.userIndex] === squares[combo[0]] ? 'win' : 'lose',
				}));
			}
		}
	}

	function handleClick(num: number) {
		const current: TGameArray = state.game.history[state.game.step];

		// TODO check if its user turn
		if (state.winner !== undefined) return;
		if (state.game.turn !== state.game.playerSigns[state.userIndex] && current[num] !== undefined) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares: TGameArray = [...current];
			playersSquares[num] = state.game.playerSigns[state.userIndex];
			return [playersSquares];
		}

		const [playersSquares] = handleTurn();

		// Player makes a move after little delay
		const newHistory = [...state.game.history];

		newHistory.push(playersSquares);
		const ref = doc(db, "activeGames", state.game.id);
		updateDoc(ref, {
			history: JSON.stringify(newHistory),
			step: state.game.step + 1,
			turn: state.game.turn === 'x' ? 'o' : 'x',
		})
			.catch(err => {
				// TODO ...
				console.log(err);
			})
			.finally(() => {
				setState((st) => ({
					...st,
					loading: false,
				}))
			})
	}

	function handleRestartGame() {
		navigate('/game/PvP');
	}

	if (state.loading || state.game.playersIds.filter((x: any) => x !== '').length < 2) {
		return <div className={`${style.container}`}>
			<div></div>
			<div>
				<h2 className={style.waiting}>Waiting for players</h2>
				<Spinner />
			</div>
			<div></div>
		</div>
	} else if (state.redirect !== '') {
		return <Navigate to={state.redirect} />
	} else {
		return (
			<div className={`${style.container}`}>
				<div className={style.player1}>
					<PlayerCard
						displayName={state.game.playerDisplayNames[state.xIndex]}
						sign={'x'}
						yourTurn={state.game.turn === 'x'} />
				</div>
				<div className={style.player2}>
					<PlayerCard
						displayName={state.game.playerDisplayNames[state.xIndex === 0 ? 1 : 0]}
						sign={'o'}
						yourTurn={state.game.turn === 'o'} />
				</div>
				<div className={style.game}>
					<GameTable
						winningSquares={state.winningSquares}
						history={state.game.history}
						step={state.game.step}
						handleClick={handleClick} />
					{state.winner && <Winner
						result={state.winner}
						handleRestartGame={handleRestartGame.bind(this)} />}
				</div>
			</div>
		)
	}
}

export default GamePvP;