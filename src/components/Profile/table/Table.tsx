import React from 'react'
import { DocumentData } from 'firebase/firestore'
import { Row } from './Row/Row'

interface IProps {
	pveGames: DocumentData[],
	uid: string,
}

const Table: React.FC<IProps> = ({
	pveGames,
	uid
}) => {
	return (
		<table>
			<thead>
				<tr>
					<td>Date</td>
					<td>Opponents</td>
					<td>Outcome</td>
				</tr>
			</thead>
			<tbody>
				{
					pveGames.map(game => <Row game={game} isWinner={game.playerSigns[game.playersIds.indexOf(uid)] === game.winner} />)
				}
			</tbody>
		</table>
	)
}

Table.propTypes = {}

export default Table