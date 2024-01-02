import { cyan } from 'picocolors';
import { Database } from 'src/db';
import { fileExists } from '../fs';
import { getFilePath, getStorePath } from '../utils';
import logger from '../log';

export async function remove(fileHashes: string[], options) {
	const storePath = getStorePath(options.cwd);

	if (!await fileExists(storePath) && !options.force) {
		logger.fatalError('Directory not found.');
	}

	const db = new Database(options);
	await db.load();

	fileHashes.map(async (fileHash) => {
		const targetPath = getFilePath(fileHash);

		if (!await fileExists(targetPath)) {
			logger.warn(`File ${cyan(fileHash)} not found.`);
			return
		}

		const message = `Deleting ${cyan(fileHash)}.`;

		logger.time(message);
		await db.remove(fileHash);
		logger.timeEnd(message);
	})

	await db.save();
}
