import { DBSchema, IDBPDatabase, openDB } from 'idb';

const dbName = 'tagpro-vcr-db';
const dbVersion = 1;
const dbStore = 'games';

export interface VcrGame {
	timestamp: number,
	start: string,
	map: string,
	group: boolean,
	duration: number,
	team: string,
	name: string,
	winner: boolean,
	data: string
}

interface VcrDB extends DBSchema {
	games: {
		key: number,
		value: VcrGame
	}
}

export class GameStorage {
	private db: IDBPDatabase<VcrDB>;
	maxGames: number;

	constructor(maxGames: number) {
		this.maxGames = maxGames;
		this.init();
	}

	private async init() {
		this.db = await openDB<VcrDB>(dbName, dbVersion, {
			upgrade(db) {
				db.createObjectStore(dbStore);
			}
		})
	}

	async saveGame(key: number, game: VcrGame) {
		await this.db.put(dbStore, game, key);

		const saved = await this.db.getAllKeys(dbStore);
		while (saved.length > this.maxGames) {
			const oldest = saved.shift();
			this.db.delete(dbStore, oldest);
		}
	}

	async listGames() {
		return await this.db.getAll(dbStore);
	}
}
