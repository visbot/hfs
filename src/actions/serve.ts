import { createReadStream } from 'node:fs';
import { fileExists } from '../fs';
import { getFilePath, getStorePath } from '../utils';
import colors from 'picocolors';
import { Database } from '../db';
import logger from '../log';
import polka from 'polka';

export async function serve(pathName: string = process.cwd(), options) {
	const storePath = getStorePath(pathName);

	if (!await fileExists(storePath)) {
		logger.fatalError('Directory not found.');
	}

	polka({
		onNoMatch(req, res) {
			res.statusCode = 404;
			res.end('File not found.');
		}
	})
		.get('/:hash', async (req, res) => {
			const sha256Regex = /\b[A-Fa-f0-9]{64}\b/;

			if (req.params.hash?.length !== 64 || !sha256Regex.test(req.params.hash)) {
				res.statusCode = 404;
				res.end('File not found.');

				return;
			}

			const filePath = getFilePath(req.params.hash);

			if (!await fileExists(filePath)) {
				logger.error(`File ${colors.cyan(req.params.hash)} not found.`);
				return;
			}

			const successMessage = `Serving ${colors.cyan(req.params.hash)}.`

			logger.time(successMessage);
			const readStream = createReadStream(filePath);

			readStream.on('open', () => {
				res.setHeader('Content-Type', 'text/plain');
				readStream.pipe(res);
			});

			readStream.on('error', (err) => {
				res.end(err);
			});

			readStream.on('close', () => {
				logger.timeEnd(successMessage);
			});
		})

		.get('/', async (req, res) => {
			if (!options.public) {
				res.statusCode = 403;
				res.end('Access denied.');

				return;
			}

			const db = new Database(options);

			await db.load();
			const files = db.get();

			const listItems = Object.keys(files).map(element => `<li><a href="${element}">${element}</a></li>`);

			res.end(`
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<title>files | @visbot/hfs</title>
					</head>
					<body>
						<h1>Files</h1>
						<ul>${listItems.join('')}</ul>
					</body>
				</html>
			`.replace(/(\t|\r?\n)/g, ''));

		})

		.listen(options.port, err => {
			if (err) {
				throw err;
			}

			logger.info(`Running on ${colors.cyan('http://localhost:' + options.port)}.`);
		});
}
