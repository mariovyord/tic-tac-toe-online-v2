import React, { Component } from 'react'
import { Link as div, Link, Navigate } from 'react-router-dom';
import { IoIosLogIn } from 'react-icons/io';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { auth, db } from '../../../../configs/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Spinner from '../../../common/Spinner/Spinner';

interface IState {
	gameId: string,
	loading: boolean,
}

export class PvPMenu extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			gameId: '',
			loading: false,
		}
	}


	handleCreateGame() {
		this.setState({
			loading: true,
		})

		const user = auth.currentUser

		const sign1 = Math.floor((Math.random() * 2)) >= 0.5 ? 'x' : 'o';
		const sign2 = sign1 === 'x' ? 'o' : 'x';

		if (user) {
			const data = {
				owner: user.uid,
				mode: 'pvp',
				open: true,
				step: 0,
				turn: 'x',
				history: JSON.stringify([Array(9).fill(undefined)]),
				playersIds: [user.uid, ''],
				playerDisplayNames: [user.displayName || 'Anonymous', ''],
				playerSigns: [sign1, sign2],
				createdAt: serverTimestamp(),
			}

			const ref = collection(db, "activeGames");
			addDoc(ref, data)
				.then((doc) => {
					this.setState({
						gameId: doc.id,
					})
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					this.setState({
						loading: false,
					})
				})
		}

	}

	render() {
		if (this.state.gameId === '') {
			return (
				<div className={'games-wrapper'}>
					{this.state.loading
						? <div className='absolute'>
							<Spinner />
						</div>
						: null}
					<div className={'games'}>
						<button className={'game-link'} onClick={this.handleCreateGame.bind(this)}>
							<div><IoIosCheckboxOutline size={'100px'} /></div>
							<div>Create game</div>
						</button>
						<Link className={'game-link'} to="/game/PvP/list">
							<IoIosLogIn size={'100px'} />
							<div></div>
							<div>
								Join game
							</div>
						</Link>
					</div>
				</div>
			)
		} else {
			return <Navigate to={`/game/PvP/${this.state.gameId}`} />
		}
	}
}

export default PvPMenu;