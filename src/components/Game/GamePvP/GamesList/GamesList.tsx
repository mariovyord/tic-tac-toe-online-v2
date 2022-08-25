import React, { Component } from 'react';
import { withRouter } from '../../../../hoc/withRouter';
import styles from './GamesList.module.css';

class GamesList extends Component {
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
						<tr className={styles.row}>
							<td className={styles.td}>12.12.12</td>
							<td className={styles.td}>Mario Yordanov</td>
							<td className={`${styles.td} ${styles.join}`}>Join</td>
						</tr>
						<tr className={styles.row}>
							<td className={styles.td}>12.12.12</td>
							<td className={styles.td}>Mario Yordanov</td>
							<td className={`${styles.td} ${styles.join}`}>Join</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}

export const GamesListWithRouter = withRouter(GamesList);
