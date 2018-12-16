import express from 'express';
import http from 'http';
import path from 'path';
import { info } from './logging';

const hostname = process.env.SR_INTERFACE || '127.0.0.1';
const port = 3000;

let server: http.Server;

export async function initWeb() {

    const app = express();
    app.use(
        express.static(path.join(__dirname, '../public')),
    );
    app.use('/scripts/',
        express.static(path.join(__dirname, '../build/client')),
    );
    return new Promise((resolve, reject) => {
        server = app.listen(port, hostname, (err?: Error) => {
            if (err) {
                return reject(err);
            }
            info('express is up', { url: getURL() });
            resolve();
        });
    });

}

export function getURL() {
    return `http://${hostname}:${port}/`;
}

export async function shutdownWeb() {
    return new Promise((resolve, reject) => {
        server.close((err?: Error) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
