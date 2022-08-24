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
					pveGames.map(game => <Row
						key={game.id}
						game={game}
						ending={game.winner === 'draw'
							? 'draw'
							: (game.playerSigns[game.playersIds.indexOf(uid)] === game.winner
								? 'win'
								: 'loss')
						} />)
				}
			</tbody>
		</table>
	)
}

Table.propTypes = {}

export default Table