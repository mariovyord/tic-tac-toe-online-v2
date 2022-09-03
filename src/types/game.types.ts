export type TSigns = 'x' | 'o' | undefined | null;
export type TGameArray = TSigns[];
export type THistoryArray = TSigns[][];
export interface IGame {
	id: string,
	owner: string,
	mode: 'pvp' | 'pve',
	open: boolean,
	history: THistoryArray,
	playersIds: [string, string],
	playerDisplayNames: [string, string],
	playerSigns: ['x' | 'o', 'x' | 'o'],
	winner: 'x' | 'o' | 'draw',
	createdAt: string,
}