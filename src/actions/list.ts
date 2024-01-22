import { Database } from 'src/db';
import { fileExists } from '../fs';
import { getStorePath, modeToString } from '../utils';
import { table, getBorderCharacters } from 'table';
import colors from 'picocolors';
import logger from '../log';
import prettyBytes from 'pretty-bytes';

export async function list(hashes: string[] = [], options) {
	const storePath = getStorePath(options.cwd);

	if (!await fileExists(storePath) && !options.force) {
		logger.fatalError('Directory not found.');
	}

	const db = new Database(options);
	await db.open();

	const data = db.get();
	let totalFileCount = 0;
	let totalFileCountize = 0;

	const border = options.border ? 'norc' : 'void';
	const tableRows = options.border
		? [
			['Mode', 'UID', 'Size', 'Date', 'Hash'],
		]
		: [];

	Object.keys(data).map(fileHash => {
		const fileProps = data[fileHash];

		if ((hashes.length && !hashes.includes(fileHash))) {
			return;
		}

		const size = prettyBytes(fileProps.size);

		totalFileCountize += fileProps.size;

		tableRows.push([
			modeToString(fileProps.mode),
			options.colors ? colors.magenta(fileProps.uid) : fileProps.uid,
			options.colors ? colors.magenta(size) : size,
			options.colors ? colors.yellow(fileProps.modified) : fileProps.modified,
			options.colors ? colors.cyan(fileHash) : fileHash,
		]);

		totalFileCount++;
	});

	console.log(
		table(tableRows, {
			border: getBorderCharacters(border),
			drawVerticalLine: () => false,
			drawHorizontalLine: () => options.border,
		}),
	);

	console.log(`Total: ${totalFileCount} file${totalFileCount > 1 ? 's' : ''} (${prettyBytes(totalFileCountize)})`);
}
