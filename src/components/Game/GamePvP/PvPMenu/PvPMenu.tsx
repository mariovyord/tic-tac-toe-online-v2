import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { IoIosLogIn } from 'react-icons/io';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { db } from '../../../../configs/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Spinner from '../../../common/Spinner/Spinner';
import { useAppSelector } from '../../../../app/hooks';
import { selectAuth } from '../../../../app/slices/authSlice';

interface IState {
	gameId: string,
	loading: boolean,
}

export const PvPMenu: React.FC = () => {
	const [state, setState] = useState<IState>({
		gameId: '',
		loading: false,
	})

	const user = useAppSelector(selectAuth);

	const handleCreateGame = () => {
		setState((st) => ({
			...st,
			loading: true,
		}))


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
					setState((st) => ({
						...st,
						gameId: doc.id,
					}))
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setState((st) => ({
						...st,
						loading: false,
					}))
				})
		}

	}

	if (state.gameId === '') {
		return (
			<div className={'games-wrapper'}>
				{state.loading
					? <div className='absolute'>
						<Spinner />
					</div>
					: null}
				<div className={'games'}>
					<button className={'game-link'} onClick={handleCreateGame.bind(this)}>
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
		return <Navigate to={`/game/PvP/${state.gameId}`} />
	}
}

export default PvPMenu;