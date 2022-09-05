// give sign and tic tac toe array to ai and it will play a move
import { TSigns, TGameArray } from '../../types/game.types'

const ai = (sign: TSigns, gameArray: any[]): TGameArray => {
	const arr = [...gameArray];

	const getRandom = (x: any[]): number => x[Math.floor((Math.random() * x.length))];

	const randomFreeIndex = getRandom(arr
		.map((sq, i) => {
			if (sq === null) {
				return i
			} else {
				return sq
			}
		})
		.filter(x => typeof x === "number")
	);

	return arr.map((sq, i) => {
		if (i === randomFreeIndex) {
			return sign;
		} else {
			return sq;
		}
	});
}

export default ai;

