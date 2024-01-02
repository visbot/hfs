import { mkdir } from 'node:fs/promises';
import { getStorePath } from '../utils';
import { fileExists } from '../fs';
import logger from '../log';

export async function init(pathName: string = process.cwd(), options) {
	const storePath = getStorePath(pathName);

	if (await fileExists(storePath) && !options.force) {
		logger.fatalError('Directory already exists. Use --force to overwrite.');
	}

	const successMessage = `Initialized at "${storePath}"`;

	try {
		logger.time(successMessage)
		await mkdir(storePath, { recursive: true });
		logger.timeEnd(successMessage)
	} catch (err) {
		logger.warn('Path already exists.');
	}
}
