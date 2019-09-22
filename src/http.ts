import express from 'express';
import http from 'http';
import path from 'path';
import * as ws from 'ws';
import ExpressWS from 'express-ws';
import { info } from './logging';
import { parseQueryOpts, newGameMatch, getMatch } from './matchMaker';

const hostname = process.env.SR_INTERFACE || '0.0.0.0';
const port = process.env.SR_PORT ? Number(process.env.SR_PORT) : 3000;

let server: http.Server;

export async function initWeb() {
  const filename = path.basename(__filename);
  // HACK ts path and built js path are in different directories when executed
  let basePath = filename.endsWith('.js') ? path.join(__dirname, '../../') : path.join(__dirname, '../');

  const app = express();
  ExpressWS(app);
  app.use(express.static(path.join(basePath, 'public')));
  app.use('/scripts/static/', express.static(path.join(basePath, 'build/client'), { maxAge: 1000 * 60 * 60 }));
  app.use('/scripts/', express.static(path.join(basePath, 'build/client')));

  // @ts-ignore
  app.ws('/ws', (w: ws, req: Request) => {
    console.log('new socket');
    console.log(req.url);
    const opts = parseQueryOpts(req.url);
    console.log(opts);
    if (opts.matchId) {
      const match = getMatch(opts.matchId);
      match.addPlayer(w);
    } else {
      newGameMatch(w);
    }
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
