// @ts-nocheck
import { doc, getDoc } from 'firebase/firestore';
import React, { Component } from 'react'
import { db } from '../../../configs/firebase.config';
import { withRouter } from '../../../hoc/withRouter';
import Spinner from '../../common/Spinner/Spinner';
import GameTable from '../gameComponents/GameTable';
import History from '../gameComponents/History/History';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';

import style from './ReviewGame.module.css';

interface IState {
	game: null,
	step: number,
	winningSquares: boolean[],
}

// TODO Rewrite for Review Game
class ReviewGame extends Component<any, IState> {
	constructor(props) {
		super(props);
		this.state = {
			game: null,
			step: 1,
			winningSquares: Array(9).fill(false),
		}
	}

	componentDidMount() {
		const gameId = this.props.router.params.id;
		const docRef = doc(db, "games", gameId);
		getDoc(docRef)
			.then((docs) => {
				this.setState({
					game: docs.data(),
				})
			})
			.catch(err => {
				// TODO...
				console.log(err);
			});
	}

	checkForWinner = (squares: []) => {
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
				const win = [...this.state.winningSquares];
				win[combo[0]] = true;
				win[combo[1]] = true;
				win[combo[2]] = true;

				return this.setState({
					winningSquares: win,
				});
			}
		}
		return this.setState({
			winningSquares: Array(9).fill(false),
		});
	}

	handleHistoryJump = (step: number) => {

		this.setState({
			step: step,
		});

		this.checkForWinner(JSON.parse(this.state.game.history)[step]);
	}

	handleClick = (num: number) => {
		return undefined;
	}

	render() {
		if (this.state.game) {
			return (
				<div className={`${style.container}`}>
					<div className={style.player1}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[0]}
							sign={'x'}
							yourTurn={this.state.step % 2 === 1 ? true : false}
						/>
					</div>
					<div className={style.player2}>
						<PlayerCard
							displayName={this.state.game.playerDisplayNames[1]}
							sign={'o'}
							yourTurn={this.state.step % 2 === 0 ? true : false}
						/>
					</div>
					<div className={style.game}>
						<GameTable winningSquares={this.state.winningSquares} history={JSON.parse(this.state.game.history)} step={this.state.step} handleClick={this.handleClick} />
						<h2 className='m-2'>History:</h2>
						<History historyArray={JSON.parse(this.state.game.history)} handleHistoryJump={this.handleHistoryJump} />
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
}

export const ReviewGameWithRouter = withRouter(ReviewGame);