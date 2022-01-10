import * as ws from "ws";
import * as uuid from "uuid";
import { ServerContext } from "../events/serverContext";
import _ from "lodash";
import { GameColors } from "../types/SR";
import { delay } from "../util";
import { ClientRequest } from "http";
import { FrontendEvent, frontendEventList } from "../events/actions/frontend";
import { ServerEvent, GameStageChange } from "../events/actions/game";

export interface LoggedEvent {
  event: ServerEvent | FrontendEvent;
  timestamp: number;
  listeners: number;
}

const matches: { [key: string]: GameMatch } = {};

export function removeMatch(id: string) {
  const match = matches[id];
  delete matches[id];
  match.dispose();
}

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

    const gameReadyHandler = (e: GameStageChange) => {
      this.ctx.onGameEvent = this.onGameEvent.bind(this);
      delay(0).then(() => {
        this.ctx.queue.post({ kind: "createMatch", id: this.id });
      });
    };
    this.ctx.queue.addListener("gameStageChange", gameReadyHandler);
  }

  onGameEvent(e: ServerEvent | FrontendEvent) {
    if (this.clients.length === 0) {
      removeMatch(this.id);
      return;
    }
    for (const client of this.clients) {
      if (!frontendEventList.includes(e.kind)) {
        client.send([e as ServerEvent]);
      }
    }
  }

  addPlayer(ws: ws) {
    const client = new ClientConnection(ws);
    this.clients.push(client);

    console.log("adding player");

    ws.addEventListener("close", () => {
      _.remove(this.clients, client);
    });
    ws.addEventListener("message", e => {
      const payload: ServerEvent[] = JSON.parse(String(e.data));
      for (const event of payload) {
        this.ctx.queue.post(event);
      }
    });
    console.log(`events: ${this.ctx.events.length}`);
    client.send(this.ctx.events
      .filter(e => !frontendEventList.includes(e.event.kind))
      .map(e => e.event) as any);
  }

  public dispose() {
    console.log(`disposing match ${this.id}`);
    delete this.ctx.onGameEvent;
    this.ctx.dispose();
  }
}

class ClientConnection {
  public ws: ws;
  constructor(ws: ws) {
    this.ws = ws;
  }
  send(e: ServerEvent[]) {
    this.ws.send(JSON.stringify(e), err => {
      if (err) {
        console.error(err);
      }
    });
  }
}

export interface QueryOpts {
  mode: "single" | "multi";
  matchId?: string;
  color?: GameColors;
}

export function parseQueryOpts(str: string): QueryOpts {
  const queryOpts: QueryOpts = {
    mode: "single",
    color: GameColors.blue
  };
  const split = str.split("?");
  if (split.length < 2) {
    return queryOpts;
  }
  for (const s of split[1].split("&")) {
    const [key, value] = s.split("=");
    switch (key) {
      case "mode":
        queryOpts.mode = value === "multi" ? "multi" : "single";
        break;
      case "matchId":
        // TODO validate uuid?
        queryOpts.matchId = value;
        break;
      case "color":
        // TODO validate color
        queryOpts.color = value as GameColors;
        break;
    }
  }

  return queryOpts;
}
