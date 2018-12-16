/* tslint:disable:no-console */
export interface LogDetails {
    [key: string]: number | string;
}

export type LogLevels = 'info' | 'warn' | 'error';

export function info(msg: string, details?: LogDetails) {
    log('info', msg, details);
}

export function error(msg: string, details?: LogDetails) {
    log('error', msg, details);
}

export function log(level: LogLevels, msg: string, details?: LogDetails) {
    console.log(`${level}: ${msg}${details ? ' | ' + JSON.stringify(details) : ''}`);
}
