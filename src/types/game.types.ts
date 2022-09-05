import { Timestamp } from "firebase/firestore";

export type TSigns = 'x' | 'o' | undefined | null;
export type TGameArray = TSigns[];
export type THistoryArray = TSigns[][];

interface IGame {
	owner: string,
	mode: 'pvp' | 'pve',
	open: boolean,
	finished: boolean,
	playersIds: [string, string],
	playerDisplayNames: [string, string],
	playerSigns: ['x' | 'o', 'x' | 'o'],
	winner: 'x' | 'o' | 'draw' | null,
	step: number,
	turn: 'x' | 'o',
}

export interface IParsedGame extends IGame {
	id?: string,
	history: THistoryArray,
	createdAt: string,
}

export interface IGameToSend extends IGame {
	history: string,
	createdAt: Timestamp,
}