#!/usr/bin/env node

import { program } from 'commander';

export function main() {
    console.log(/* let it breathe */);

    program
        .command('init [path]')
        .description('initializes the virtual file-system')
        .option('-D, --debug', 'prints additional debug information', false)
        .option('-f, --force', 'forces overwriting existing files/folders')
        .action(async (args, options) => {
            if (options.debug) {
                console.log('init', { args, options });
            }

            const { init } = await import('./actions/init');

            await init(args, options)
        });

    program
        .command('add <file...>')
        .description('adds one of more files to the virtual file-system')
        .option('-D, --debug', 'prints additional debug information', false)
        .option('-w, --cwd <path>', 'specifies current work directory', process.cwd())
        .option('-f, --force', 'forces overwriting existing files')
        .action(async (args, options) => {
            if (options.debug) {
                console.log('add', { args, options });
            }
            const { add } = await import('./actions/add');

            await add(args, options)
        });

    program
        .command('remove <file...>')
        .description('removes one of more file-hashes from the virtual file-system')
				.alias('rm')
        .option('-D, --debug', 'prints additional debug information', false)
        .option('-w, --cwd <path>', 'specifies current work directory', process.cwd())
        .option('-f, --force', '')
        .action(async (args, options) => {
            if (options.debug) {
                console.log('remove', { args, options });
            }
            const { remove } = await import('./actions/remove');

            await remove(args, options)
        });

    program
        .command('serve [path]')
        .description('serves file-hashes on the virtual file-system')
        .option('-D, --debug', 'prints additional debug information', false)
        .option('-p, --port <port>', 'specifies the port', '3000')
        .action(async (args, options) => {
            if (options.debug) {
                console.log('serve', { args, options });
            }

            const { serve } = await import('./actions/serve');

            await serve(args, options)
        });

    program.parse();
}

main();
