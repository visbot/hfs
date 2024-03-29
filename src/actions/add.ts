import { basename } from 'node:path';
import { copy, fileExists, getStats } from '../fs';
import { Database } from 'src/db';
import { getFilePath, getHashFromFile, getStorePath } from '../utils';
import { glob } from 'glob';
import colors from 'picocolors';
import logger from '../log';

export async function add(filePaths: string[], options) {
	const storePath = getStorePath(options.cwd);

	if (!await fileExists(storePath) && !options.force) {
		logger.fatalError('Directory not found.');
	}

	const db = new Database(options);
	await db.open();

	const filePattern = await glob(filePaths, {
		cwd: options.cwd
	});

	await Promise.all(
		filePattern.map(async (filePath) => {
			const fileHash = await getHashFromFile(filePath);
			const targetPath = getFilePath(fileHash);

			if (await fileExists(targetPath) && !options.force) {
				logger.warn(`Skipping ${colors.cyan(basename(filePath))}. Use --force to overwrite.`);
				return;
			}

			const message = `Copying ${colors.cyan(basename(filePath))}.`;

			logger.time(message);
			await copy(filePath, targetPath);
			db.update({
				[fileHash]: await getStats(filePath)
			});
			logger.timeEnd(message);
		})
	);

	await db.close();
}
