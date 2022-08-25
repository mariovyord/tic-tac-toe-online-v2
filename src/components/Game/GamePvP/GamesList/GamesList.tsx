import { collection, DocumentData, getDocs, limitToLast, orderBy, query, where } from 'firebase/firestore';
import React, { Component } from 'react';
import { auth, db } from '../../../../configs/firebase.config';
import { withRouter } from '../../../../hoc/withRouter';
import styles from './GamesList.module.css';

interface IState {
	openGames: DocumentData[],
}

class GamesList extends Component<any, IState> {
	constructor({ }) {
		super({});
		this.state = {
			openGames: [],
		}
	}

	componentDidMount() {
		const user = auth.currentUser;

		if (user) {
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

	render() {
		return (
			<div className={styles.wrapper}>
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
							return <tr className={styles.row}>
								<td className={styles.td}>{game.createdAt.toDate().toISOString().split('T').join(', ').slice(0, -5)}</td>
								<td className={styles.td}>{game.playerDisplayNames[0]}</td>
								<td className={`${styles.td} ${styles.join}`}>Join</td>
							</tr>
						})}
					</tbody>
				</table>
			</div>
		)
	}
}

export const GamesListWithRouter = withRouter(GamesList);
