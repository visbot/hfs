import { fileExists } from './fs';
import { getStorePath } from './utils';
import { resolve } from 'node:path';
import logger from './log';
import { readFile, writeFile } from 'node:fs/promises';

const DB_FILE = 'db.json';

export class Database {
    dbPath: string;
    force: boolean;
    state: Record<string, unknown>;

    constructor(options) {
        const storePath = getStorePath(options.cwd);

        this.dbPath = resolve(storePath, DB_FILE);
        this.force = options.force;
    }

    /**
     *  Initializes an empty database.
     * @returns {Record<string, unknown>}
     */
    init() {
        return {
            new: true
        }
    }

    /**
     * 
     * @param options 
     * @returns 
     */
    async load() {
        if (!await fileExists(this.dbPath)) {
            logger.warn('Database not found, creating new one.');

            this.state = this.init();
            await writeFile(this.dbPath, JSON.stringify(this.state));
        }

        try {
            this.state = JSON.parse(await readFile(this.dbPath, 'utf-8'));
        } catch (error) {
            if (this.force) {
                this.state = this.init();
                await writeFile(this.dbPath, JSON.stringify(this.state, null, 2));
                
                return;
            }

            logger.fatalError('Failed to read database is corrupted.');
        }
    }

    update(newValue) {
        this.state = {
            ...this.state,
            ...newValue
        }
    }

    async save() {
        try {
            await writeFile(this.dbPath, JSON.stringify(this.state, null, 2));
        } catch (error) {
            logger.fatalError('Failed to write database.');
        }
    }
}