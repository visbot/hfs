import { basename } from 'node:path';
import { copy, fileExists, getStats } from '../fs';
import { cyan } from 'picocolors';
import { getFilePath, getHashFromFile, getStorePath } from '../utils';
import { glob } from 'glob';
import logger from '../log';
import { Database } from 'src/db';

export async function add(filePaths: string[], options) {
    const storePath = getStorePath(options.cwd);

    if (!await fileExists(storePath) && !options.force) {
        logger.fatalError('Directory not found.');
    }

    const db = new Database(options);
    await db.load();

    const filePattern = await glob(filePaths, {
        cwd: options.cwd
    });

    await Promise.all(
        filePattern.map(async (filePath) => {
            const fileHash = await getHashFromFile(filePath);
            const targetPath = getFilePath(fileHash);

            if (await fileExists(targetPath) && !options.force) {
                logger.warn(`Skipping ${cyan(basename(filePath))}. Use --force to overwrite.`);
                return;
            }

            const message = `Copying ${cyan(basename(filePath))}.`;

            logger.time(message);
                await copy(filePath, targetPath);
                db.update({
                    [fileHash]: await getStats(filePath)
                });
            logger.timeEnd(message);
        })
    );

    await db.save();
}