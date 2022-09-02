import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGameAsync, reviewActions, selectReview } from '../../../app/slices/reviewSlice';
import { getWinner } from '../../../utils/ai/getWinner/getWinner';
import Spinner from '../../common/Spinner/Spinner';
import GameTable from '../gameComponents/GameTable';
import History from '../gameComponents/History/History';
import PlayerCard from '../gameComponents/PlayerCard/PlayerCard';

import style from './ReviewGame.module.css';

const ReviewGame = () => {
	const params = useParams();
	const gameId = params.id;

	const dispatch = useAppDispatch();
	const review = useAppSelector(selectReview);

	useEffect(() => {
		dispatch(fetchGameAsync(gameId!));
	}, [gameId, dispatch])

	const checkForWinner = (arr: []) => {
		const [, pattern] = getWinner(arr);
		dispatch(reviewActions.setWinnner(pattern));
	}

	const handleHistoryJump = (step: number) => {
		dispatch(reviewActions.jumpToStep(step));
		checkForWinner(JSON.parse(review.game.history)[step]);
	}

	const handleClick = (num: number) => {
		return undefined;
	}

	if (review.status === 'idle') {
		return (
			<div className={`${style.container}`}>
				<div className={style.player1}>
					<PlayerCard
						displayName={review.game.playerDisplayNames[0]}
						sign={'x'}
						yourTurn={review.step % 2 === 1 ? true : false}
					/>
				</div>
				<div className={style.player2}>
					<PlayerCard
						displayName={review.game.playerDisplayNames[1]}
						sign={'o'}
						yourTurn={review.step % 2 === 0 ? true : false}
					/>
				</div>
				<div className={style.game}>
					<GameTable winningSquares={review.winningSquares} history={JSON.parse(review.game.history)} step={review.step} handleClick={handleClick} />
					<h2 className='m-2'>History:</h2>
					<History historyArray={JSON.parse(review.game.history)} handleHistoryJump={handleHistoryJump} />
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