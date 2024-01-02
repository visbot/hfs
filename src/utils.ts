import { createHash } from 'node:crypto';
import { constants, createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export async function getHashFromStream(stream, algorithm = 'sha256') {
    const hashingFunction = createHash(algorithm);

    return new Promise((resolve, reject) => {
        stream
            .pipe(hashingFunction)
            .on('error', error => reject(error))
            .on('data', buffer => resolve(buffer.toString('hex').toLowerCase()));
    });
}

export async function getHashFromFile(inputFile, algorithm = 'sha256'): Promise<string> {
    return (await getHashFromStream(createReadStream(inputFile), algorithm)).toString();
}

export async function fileExists(filePath) {
    try {
        await access(filePath, constants.F_OK);
    } catch {
        return false;
    }

    return true;
}

export function getStorePath(pathName: string): string {
    return join(pathName || process.cwd(), '.hfs');
}

export function getFilePath(hashValue: string, pathName: string = process.cwd()): string {
    const storePath = getStorePath(pathName);

    return join(storePath, `${hashValue[0]}${hashValue[1]}`.toLowerCase(), hashValue.toLowerCase());
}

// export function modeToString(mode) {
//     const result = Buffer.from('drwxrwxrwx', 'ascii');

//     if (!(mode & 0o4_0000)) {
//         result[0] = 45;
//     }

//     for (let index = 1, bit = 0o400; bit; index++, bit >>= 1) {
//         if (!(mode & bit)) {
//             result[index] = 45;
//         }
//     }

//     return result.toString();
// }
