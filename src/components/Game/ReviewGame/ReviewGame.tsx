import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../../configs/firebase.config';
import Spinner from '../../common/Spinner/Spinner';
import GameTable from '../gameComponents/GameTable';
import History from '../gameComponents/History/History';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';

import style from './ReviewGame.module.css';

interface IState {
	// add game data type or null
	game: any,
	step: number,
	winningSquares: boolean[],
}

const ReviewGame = () => {
	const [state, setState] = useState<IState>({
		game: null,
		step: 1,
		winningSquares: Array(9).fill(false),
	})

	const params = useParams();

	useEffect(() => {
		// Get game data from DB
		const gameId = params.id;
		const docRef = doc(db, "games", gameId!);

		getDoc(docRef)
			.then((docs) => {
				setState((st) => ({
					...st,
					game: docs.data(),
				}))
			})
			.catch(err => {
				// TODO...
				console.log(err);
			});
	}, [params])

	const checkForWinner = (squares: []) => {
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
			if (squares[combo[0]] === null || squares[combo[1]] === null || squares[combo[2]] === null) {
			} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
				const win = [...state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				return setState((st) => ({
					...st,
					winningSquares: win,
				}));
			}
		}
		return setState((st) => ({
			...st,
			winningSquares: Array(9).fill(false),
		}));
	}

	const handleHistoryJump = (step: number) => {

		setState((st) => ({
			...st,
			step: step,
		}));

		checkForWinner(JSON.parse(state.game.history)[step]);
	}

	const handleClick = (num: number) => {
		return undefined;
	}

	if (state.game) {
		return (
			<div className={`${style.container}`}>
				<div className={style.player1}>
					<PlayerCard
						displayName={state.game.playerDisplayNames[0]}
						sign={'x'}
						yourTurn={state.step % 2 === 1 ? true : false}
					/>
				</div>
				<div className={style.player2}>
					<PlayerCard
						displayName={state.game.playerDisplayNames[1]}
						sign={'o'}
						yourTurn={state.step % 2 === 0 ? true : false}
					/>
				</div>
				<div className={style.game}>
					<GameTable winningSquares={state.winningSquares} history={JSON.parse(state.game.history)} step={state.step} handleClick={handleClick} />
					<h2 className='m-2'>History:</h2>
					<History historyArray={JSON.parse(state.game.history)} handleHistoryJump={handleHistoryJump} />
				</div>
			</div>
		)
	} else {
		return (
			<div className={`${style.container}`}>
				<div></div>
				<Spinner />
				<div></div>
			</div>
		)
	}
}

export default ReviewGame;