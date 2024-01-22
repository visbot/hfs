import { Database } from 'src/db';
import { fileExists } from '../fs';
import { getFilePath, getStorePath } from '../utils';
import colors from 'picocolors';
import logger from '../log';

export async function remove(fileHashes: string[], options) {
	const storePath = getStorePath(options.cwd);

	if (!await fileExists(storePath) && !options.force) {
		logger.fatalError('Directory not found.');
	}

	const db = new Database(options);
	await db.open();

	fileHashes.map(async (fileHash) => {
		const targetPath = getFilePath(fileHash);

		if (!await fileExists(targetPath)) {
			logger.warn(`File ${colors.cyan(fileHash)} not found.`);
			return
		}

		const message = `Deleting ${colors.cyan(fileHash)}.`;

		logger.time(message);
		await db.remove(fileHash);
		logger.timeEnd(message);
	})

	await db.close();
}
