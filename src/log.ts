import logSymbols from 'log-symbols';

export default {
    log(message: string) {
        console.log(`${logSymbols.success} ${message}`);
    },

    info(message: string) {
        console.info(`${logSymbols.info} ${message}`);
    },

    warn(message: string) {
        console.warn(`${logSymbols.warning} ${message}`);
    },

    error(message: string) {
        console.error(`${logSymbols.error} ${message}`);
    },

    fatalError(message: string) {
        console.error(`${logSymbols.error} ${message}`);
        process.exit(1);
    },

    time(message: string) {
        console.time(`${logSymbols.success} ${message}`);
    },

    timeEnd(message: string) {
        console.timeEnd(`${logSymbols.success} ${message}`);
    }
}
