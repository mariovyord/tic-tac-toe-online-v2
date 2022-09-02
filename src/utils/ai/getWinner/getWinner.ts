export const getWinner = (squares: []): [null | 'x' | 'o', boolean[]] => {
	const winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let combo of winningCombos) {
		if (!squares[combo[0]] || !squares[combo[1]] || !squares[combo[2]]) {
		} else if (squares[combo[0]] === squares[combo[1]] && squares[combo[1]] === squares[combo[2]]) {
			const winnerPattern = Array(9).fill(false);
			winnerPattern[combo[0]] = true;
			winnerPattern[combo[1]] = true;
			winnerPattern[combo[2]] = true;

			return [squares[combo[0]], winnerPattern];
		}
	}
	return [null, Array(9).fill(false)];
}