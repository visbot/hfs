import { createReadStream } from 'node:fs';
import { cyan } from 'picocolors';
import { fileExists } from '../fs';
import { getFilePath, getStorePath } from '../utils';
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
                logger.error(`File ${cyan(req.params.hash)} not found.`);
                return;
            }

            const successMessage = `Serving ${cyan(req.params.hash)}.`

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
        .listen(options.port, err => {
            if (err) {
                throw err;
            }

            logger.info(`Running on ${cyan('http://localhost:' + options.port)}.`);
        });
        ;
}