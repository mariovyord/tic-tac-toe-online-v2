import React, { useEffect, useState } from 'react'
import ai from '../../../utils/ai/ai';

import GameTable from '../gameComponents/GameTable';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';
import Winner from '../gameComponents/Winner/Winner';

import style from './GamePvE.module.css';
import { TGameArray, THistoryArray } from '../../../types/game.types';

import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from '../../../configs/firebase.config';
import { useAppSelector } from '../../../app/hooks';
import { selectAuth } from '../../../app/slices/authSlice';


interface IState {
	userSign: 'x' | 'o',
	computerData: {
		displayName: string,
	},
	computerSign: 'x' | 'o',
	turn: string,
	winner: undefined | 'win' | 'lose' | 'draw',
	history: THistoryArray,
	step: number,
	winningSquares: boolean[],
}

const GamePvE: React.FC = () => {
	const [state, setState] = useState<IState>({
		userSign: 'x',
		computerData: {
			displayName: 'AI',
		},
		computerSign: 'o',
		turn: 'x',
		winner: undefined,
		history: [Array(9).fill(undefined)],
		step: 0,
		winningSquares: Array(9).fill(false),
	})

	const user = useAppSelector(selectAuth);

	// on first mount
	useEffect(() => {
		const userSign = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const computerSign = userSign === 'x' ? 'o' : 'x';
		// TODO check how it works  for guest users
		setState((st) => ({
			...st,
			userSign: userSign,
			computerSign: computerSign,
		}));

		// check if AI is first and make a move if it is
		setTimeout(() => {
			if (state.turn === computerSign && state.history.length === 1) {
				const newHistory = [...state.history];
				const computerMove = ai(computerSign, newHistory[0]);
				computerMoveFunc(newHistory, computerMove);
			}
		}, 500)
	}, [])

	useEffect(() => {
		// check if the game is draw
		const isFull = state.history[state.step].filter(x => x === undefined);
		if (isFull.length === 0 && state.winner === undefined) {

			if (user && user.isAnonymous === false) {
				const data = {
					owner: user.uid,
					mode: 'pve',
					history: JSON.stringify([...state.history]),
					playersIds: [user.uid, ''],
					playerDisplayNames: [user.displayName, 'AI'],
					playerSigns: [state.userSign, state.computerSign],
					winner: 'draw',
					createdAt: serverTimestamp(),
				}

				const ref = collection(db, "games")
				addDoc(ref, data)
			}

			return setState((st) => ({
				...st,
				winner: 'draw',
			}))
		}
	}, [state.history])

	function computerMoveFunc(history: any[][], computerSquares: any) {
		if (state.winner !== undefined) return;

		const newHistory = [...history];
		newHistory.push(computerSquares);
		console.log('here')
		setState((state) => ({
			...state,
			turn: state.userSign,
			history: newHistory,
			step: state.step + 1,
		}))

		checkForWinner(computerSquares);
	}

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
			if (squares[combo[0]] === undefined || squares[combo[1]] === undefined || squares[combo[2]] === undefined) {
			} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
				const win = [...state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				// check if user is not anonymous and save game db
				if (user && user.isAnonymous === false) {
					const data = {
						owner: user.uid,
						mode: 'pve',
						history: JSON.stringify([...state.history, squares]),
						playersIds: [user.uid, ''],
						playerDisplayNames: [user.displayName, 'AI'],
						playerSigns: [state.userSign, state.computerSign],
						winner: state.userSign === squares[combo[0]] ? state.userSign : state.computerSign,
						createdAt: serverTimestamp(),
					}

					const ref = collection(db, "games")
					addDoc(ref, data)
				}

				// end the game
				return setState((st) => ({
					...st,
					winningSquares: win,
					winner: state.userSign === squares[combo[0]] ? 'win' : 'lose',
				}));
			}
		}
	}

	const handleClick = (num: number) => {
		const current: TGameArray = state.history[state.step];

		if (state.step !== (state.history.length - 1) || state.step < 0) return;
		if (state.winner !== undefined) return;
		if (state.turn === state.userSign && current[num] !== undefined) return;
		if (state.turn === state.computerSign) return;

		const handleTurn = (): any => {
			// add user move to array
			let playersSquares: TGameArray = [...current];
			playersSquares[num] = state.userSign;
			// add computer move to second array
			const computerSquares = ai(state.computerSign, playersSquares);

			return [playersSquares, computerSquares];
		}

		const [playersSquares, computerSquares] = handleTurn();

		// Player makes a move after little delay
		const newHistory = [...state.history];

		newHistory.push(playersSquares);

		setState((st) => ({
			...st,
			turn: st.computerSign,
			history: newHistory,
			step: st.step + 1,
		}))

		checkForWinner(playersSquares);

		// AI makes a move after little delay
		setTimeout(() => {
			computerMoveFunc(newHistory, computerSquares);
		}, 500)
	}

	const handleRestartGame = () => {
		// reset state
		const sign1 = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const sign2 = sign1 === 'x' ? 'o' : 'x';

		setState((st) => ({
			...st,
			turn: 'x',
			winner: undefined,
			userSign: sign1,
			computerSign: sign2,
			history: [Array(9).fill(undefined)],
			step: 0,
			winningSquares: Array(9).fill(false),
		}))

		// check if AI is first and make a move if it is
		setTimeout(() => {
			if (state.turn === state.computerSign && state.history.length === 1) {
				const newHistory = [...state.history];
				const computerMove = ai(state.computerSign, newHistory[0]);
				computerMoveFunc(newHistory, computerMove);
			}
		}, 500)

	}

	return (
		<div className={`${style.container}`}>
			<div className={style.player1}>
				<PlayerCard displayName={state.userSign === 'x' ? user?.displayName : state.computerData.displayName} sign={'x'} yourTurn={state.turn === 'x'} />
			</div>
			<div className={style.player2}>
				<PlayerCard displayName={state.userSign === 'o' ? user?.displayName : state.computerData.displayName} sign={'o'} yourTurn={state.turn === 'o'} />
			</div>
			<div className={style.game}>
				<GameTable winningSquares={state.winningSquares} history={state.history} step={state.step} handleClick={handleClick} />
				{state.winner && <Winner result={state.winner} handleRestartGame={handleRestartGame} />}
			</div>
		</div>
	)
}

export default GamePvE;