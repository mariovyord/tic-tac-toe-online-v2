import ai, { TGameArray } from './ai';

const arrayWithSixEmpty: TGameArray = [
	'x', // 0
	undefined, // 1
	undefined, // 2
	undefined, // 3
	'o', // 4
	undefined, // 5
	undefined, // 6
	undefined, // 7
	undefined // 8
]

const arrayWithTwoEmpty: TGameArray = [
	'x', // 0
	'o', // 1
	'x', // 2
	'o', // 3
	'o', // 4
	'x', // 5
	undefined, // 6
	'x', // 7
	undefined // 8
]

const arrayWithOneEmpty: TGameArray = [
	'x', // 0
	'o', // 1
	'x', // 2
	'o', // 3
	'o', // 4
	'x', // 5
	'o', // 6
	'x', // 7
	undefined // 8
]

const arrayFullyEmpty: TGameArray = new Array(9).fill(undefined);

describe('ai moves function', () => {
	test('ai func should make any move with x', () => {
		const resArray = ai('x', arrayWithSixEmpty);
		const Xs: number = resArray.filter(x => x === 'x').length;
		const Os: number = resArray.filter(x => x === 'o').length;
		const empty: number = resArray.filter(x => x === undefined).length;

		expect(Xs).toBe(2);
		expect(Os).toBe(1);
		expect(empty).toBe(6);
	})

	test('ai func should make any move with o', () => {
		const resArray = ai('o', arrayWithSixEmpty);
		const Xs: number = resArray.filter(x => x === 'x').length;
		const Os: number = resArray.filter(x => x === 'o').length;
		const empty: number = resArray.filter(x => x === undefined).length;

		expect(Xs).toBe(1);
		expect(Os).toBe(2);
		expect(empty).toBe(6);
	})

	test('ai func should fill the only remaining with x', () => {
		const resArray = ai('x', arrayWithOneEmpty);
		const Xs: number = resArray.filter(x => x === 'x').length;
		const Os: number = resArray.filter(x => x === 'o').length;
		const empty: number = resArray.filter(x => x === undefined).length;

		expect(Xs).toBe(5);
		expect(Os).toBe(4);
		expect(empty).toBe(0);
	})

	test('ai func should fill the only remaining with with o', () => {
		const resArray = ai('o', arrayWithOneEmpty);
		const Xs: number = resArray.filter(x => x === 'x').length;
		const Os: number = resArray.filter(x => x === 'o').length;
		const empty: number = resArray.filter(x => x === undefined).length;

		expect(Xs).toBe(4);
		expect(Os).toBe(5);
		expect(empty).toBe(0);
	})

	test('ai func should fill the two remaining with one x and one o', () => {
		const firstPhase = ai('o', arrayWithTwoEmpty);
		const secondPhase = ai('x', firstPhase);
		const Xs: number = secondPhase.filter(x => x === 'x').length;
		const Os: number = secondPhase.filter(x => x === 'o').length;
		const empty: number = secondPhase.filter(x => x === undefined).length;

		expect(Xs).toBe(5);
		expect(Os).toBe(4);
		expect(empty).toBe(0);
	})

	test('ai func should play a game by itself', () => {
		let arr = [...arrayFullyEmpty];

		for (let i = 0; i < 9; i++) {
			if (i % 2 === 0) {
				const newArr = ai('x', arr);
				newArr.forEach((a, i) => {
					arr[i] = a;
				})
			} else {
				const newArr = ai('o', arr);
				newArr.forEach((a, i) => {
					arr[i] = a;
				})
			}
		}

		const Xs: number = arr.filter(x => x === 'x').length;
		const Os: number = arr.filter(x => x === 'o').length;
		const empty: number = arr.filter(x => x === undefined).length;

		expect(Xs).toBe(5);
		expect(Os).toBe(4);
		expect(empty).toBe(0);
	})
})