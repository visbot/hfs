#!/usr/bin/env node

import { program } from 'commander';

export function main() {
    console.log(/* let it breathe */);

    program
        .command('init [path]')
        .description('initializes the virtual file-system')
        .option('-D, --debug', 'print additional debug information', false)
        .option('-f, --force', '')
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
        .option('-D, --debug', 'print additional debug information', false)
        .option('-w, --cwd <path>', 'specify current work directory', process.cwd())
        .option('-f, --force', '')
        .action(async (args, options) => {
            if (options.debug) {
                console.log('add', { args, options });
            }
            const { add } = await import('./actions/add');

            await add(args, options)
        });
        
    program
        .command('serve [path]')
        // .description('adds one of more files to the virtual file-system')
        .option('-D, --debug', 'print additional debug information', false)
        .option('-p, --port <port>', 'specifies the port', '3000')
        // .option('-f, --force', '')
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