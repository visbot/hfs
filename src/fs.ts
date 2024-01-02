import { access, copyFile, mkdir, stat } from 'fs/promises';
import { constants } from 'fs';
import { dirname } from 'node:path';

export async function mkDir(path: string) {
	try {
		await mkdir(path, { recursive: true });
	} catch (error) {
	}
}

export async function copy(sourcePath: string, targetPath: string) {
	const targetDir = dirname(targetPath);

	await mkDir(targetDir);
	await copyFile(sourcePath, targetPath);
}

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath, constants.F_OK);
	} catch {
		return false;
	}

	return true;
}

export async function getStats(filePath: string) {
	let fileStats;

	try {
		fileStats = await stat(filePath);
	} catch {
		return null;
	}

	return {
		uid: fileStats.uid,
		mode: fileStats.mode,
		size: fileStats.size,
		created: fileStats.birthtime,
		modified: fileStats.mtime,
	}
}
