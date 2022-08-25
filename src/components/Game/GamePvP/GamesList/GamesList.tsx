import { User } from 'firebase/auth';
import { collection, doc, DocumentData, getDocs, limitToLast, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, db } from '../../../../configs/firebase.config';
import { withRouter } from '../../../../hoc/withRouter';
import Spinner from '../../../common/Spinner/Spinner';
import styles from './GamesList.module.css';

interface IState {
	openGames: DocumentData[],
	loading: boolean,
	user: null | User,
	navigateTo: string,
}

class GamesList extends Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			openGames: [],
			loading: false,
			user: auth.currentUser,
			navigateTo: '',
		}
	}

	componentDidMount() {
		if (this.state.user) {
			const ref = collection(db, 'activeGames');
			const q = query(ref,
				where("mode", "==", "pvp"),
				where("open", "==", true),
				orderBy("createdAt"),
			);

			getDocs(q)
				.then((doc) => {
					const result: DocumentData[] = []
					doc.forEach(x => {
						const data = x.data();
						data.id = x.id;
						result.unshift(data);
					});

					this.setState({
						openGames: result,
					})

				})
		}
	}

	handleJoinGame(game: any) {
		// check if its already loading game 
		if (this.state.loading === true) return;

		this.setState({
			loading: true,
		})

		const updatedGame = { ...game };
		updatedGame.open = false;
		updatedGame.playerDisplayNames[1] = this.state.user?.displayName || 'Anonymous';
		updatedGame.playersIds[1] = this.state.user?.uid;

		const ref = doc(db, "activeGames", game.id);
		updateDoc(ref, updatedGame)
			.then(() => {
				this.setState({
					navigateTo: `/game/PvP/${game.id}`,
				})
			})
			.catch(err => {
				// TODO ...
				console.log(err);
			})
			.finally(() => {
				this.setState({
					loading: false,
				})
			})

	}

	render() {
		if (this.state.navigateTo) {
			return (
				<Navigate to={this.state.navigateTo} />
			)
		} else {
			return (
				<div className={styles.wrapper}>
					{this.state.loading
						? <div className='absolute'>
							<Spinner />
						</div>
						: null}
					<h1 className='mb-3'>Open games</h1>
					<table className={styles.table}>
						<thead>
							<tr>
								<td>Date</td>
								<td>Opponent</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{this.state.openGames.map(game => {
								return <tr key={game.id} className={styles.row}>
									<td className={styles.td}>{game.createdAt.toDate().toISOString().split('T').join(', ').slice(0, -5)}</td>
									<td className={styles.td}>{game.playerDisplayNames[0]}</td>
									<td className={`${styles.td} ${styles.join}`} onClick={this.handleJoinGame.bind(this, game)}>Join</td>
								</tr>
							})}
						</tbody>
					</table>
				</div>
			)
		}
	}
}

export const GamesListWithRouter = withRouter(GamesList);
