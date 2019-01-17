import * as ws from 'ws';
import * as uuid from 'uuid';
import { ServerContext } from '../events/serverContext';
import _ from 'lodash';
import { ServerEvent, FrontendEvent, frontendEventList } from '../events';
import { GameColors } from '../types/SR';

export interface LoggedEvent {
    event: ServerEvent | FrontendEvent;
    timestamp: number;
    listeners: number;
}

const matches: { [key: string]: GameMatch } = {};

export function getMatch(id: string) {
    if (!matches[id]) {
        throw new Error(`no such match for ${id}`);
    }
    return matches[id];
}

export function newGameMatch(ws: ws) {
    const match = new GameMatch(ws);
    matches[match.id] = match;
}

class GameMatch {
    adminWS: ws;
    id: string;
    ctx: ServerContext;

    clients: ClientConnection[] = [];

    constructor(adminWS: ws) {
        this.adminWS = adminWS;
        this.id = uuid.v4();

        this.ctx = new ServerContext();

        this.addPlayer(adminWS);

        this.ctx.onGameEvent = (e: ServerEvent | FrontendEvent) => {
            for (const client of this.clients) {
                if (!frontendEventList.includes(e.kind)) {
                    client.send(e as ServerEvent);
                }
            }
        }
    }

    addPlayer(ws: ws) {
        const client = new ClientConnection(ws);
        this.clients.push(client);

        ws.addEventListener('close', () => {
            _.remove(this.clients, client);
        });
        ws.addEventListener('message', (e) => {
            const payload: ServerEvent = JSON.parse(e.data);
            this.ctx.queue.post(payload);
        });
    }
}

class ClientConnection {
    public ws: ws;
    constructor(ws: ws) {
        this.ws = ws;
    }
    send(e: ServerEvent) {
        this.ws.send(JSON.stringify(e), (err) => {
            console.error(err);
        });
    }
}

export interface QueryOpts {
    mode: 'single' | 'multi';
    matchId?: string;
    color?: GameColors;
}

export function parseQueryOpts(str: string): QueryOpts {

    const queryOpts: QueryOpts = {
        mode: 'single'
    }
    const split = str.split("?");
    if (split.length < 2) {
        return queryOpts;
    }
    for (const s of split[1].split("&")) {
        const [key, value] = s.split('=');
        console.log(value);
        switch (key) {
            case 'mode':
                queryOpts.mode = value === 'multi' ? 'multi' : 'single';
                break;
            case 'matchId':
                // TODO validate uuid?
                queryOpts.matchId = value;
                break;
            case 'color':
                // TODO validate color
                queryOpts.color = value as GameColors;
                break;

        }
    }



    return queryOpts;
}