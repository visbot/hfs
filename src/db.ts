import { fileExists } from './fs';
import { getFilePath, getStorePath } from './utils';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import logger from './log';

const DB_FILE = 'db.json';

export class Database {
	dbPath: string;
	debug: boolean;
	force: boolean;
	state: Data;

	constructor(options) {
		const storePath = getStorePath(options.cwd);

		this.dbPath = resolve(storePath, DB_FILE);
		this.debug = options.debug;
		this.force = options.force;
	}

	/**
	 *  Initializes an empty database.
	 * @returns {Data}
	 */
	init() {
		this.state = {
			version: 0,
			created: new Date().toISOString(),
			modified: null
		}
	}

	/**
	 * Returns the current snapshot of the database.
	 * @returns {Data}
	 */
	get(): FileProps {
		return this.state.files;
	}

	/**
	 *
	 * @param options
	 * @returns
	 */
	async open() {
		if (!await fileExists(this.dbPath)) {
			logger.warn('Database not found, creating new one.');

			this.init();
			await writeFile(this.dbPath, JSON.stringify(this.state));
		}

		try {
			this.state = JSON.parse(await readFile(this.dbPath, 'utf-8'));
		} catch (error) {
			if (this.force) {
				this.init();
				await writeFile(this.dbPath, JSON.stringify(this.state, null, 2));

				return;
			}

			if (this.debug) {
				console.error(error);
			}

			logger.fatalError('Failed to read database is corrupted.');
		}
	}

	update(newValue) {
		this.state.files = {
				...(this.state.files || {}),
				...newValue
		}
	}

	async close() {
		const data = {
			...this.state,
			modified: new Date().toISOString()
		}
		try {
			await writeFile(this.dbPath, JSON.stringify(data, null, 2));
		} catch (error) {
			if (this.debug) {
				console.error(error);
			}

			logger.fatalError('Failed to write database.');
		}
	}

	async remove(removeHash) {
		const targetPath = getFilePath(removeHash);

		try {
			await rm(targetPath);
		} catch (error) {
			if (this.debug) {
				console.error(error);
			}

			logger.fatalError('Failed to delete file.');
		}

		this.state = {
			...this.state,
			[removeHash]: undefined
		}
	}
}
