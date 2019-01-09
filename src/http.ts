import express from 'express';
import http from 'http';
import path from 'path';
import * as ws from 'ws';
import ExpressWS from 'express-ws';
import { info } from './logging';

const hostname = process.env.SR_INTERFACE || '0.0.0.0';
const port = 3000;

let server: http.Server;

export async function initWeb() {

    const app = express();
    ExpressWS(app);
    app.use(
        express.static(path.join(__dirname, '../public')),
    );
    app.use('/scripts/static/',
        express.static(path.join(__dirname, '../build/client'), { maxAge: 1000 * 60 * 60 }),
    );
    app.use('/scripts/',
        express.static(path.join(__dirname, '../build/client')),
    );

    // @ts-ignore
    app.ws('/ws', (w: ws, req: Request) => {
        console.log('new socket');
        w.on('message', (msg) => {
            console.log('foo');
        })
    });


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
