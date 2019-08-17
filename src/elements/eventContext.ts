import { EventQueue } from "../events/queues";
import { info } from "../logging";
import { delay } from "../util";
import { LoggedEvent } from "../matchMaker";
import { UpdateLoop } from "../events/serverContext";
import { logs } from "../test/eventLogs";
import {
  ServerEvents,
  ServerEventKinds,
  ServerEvent
} from "../events/actions/game";
import { FrontendState, newFrontendState } from "../events/store/frontend";
import {
  FrontendEventKinds,
  FrontendEvents,
  FrontendEvent,
  frontendEventList
} from "../events/actions/frontend";
import { GameState, newGameState } from "../events/store/game";
import { Context } from "../events";
import {
  gameReducer,
  GameReducer,
  GameReducerMap
} from "../events/reducers/game";
import {
  frontendReducer,
  FrontendReducerMap,
  FrontendReducer
} from "../events/reducers/frontend";

interface EventContextOpts {
  autoStart: boolean;
}

export class EventContextElement extends HTMLElement {
  public gameQueue: EventQueue<ServerEventKinds, ServerEvents>;
  public frontendQueue: EventQueue<FrontendEventKinds, FrontendEvents>;

  // TODO probably shouldn't store events during 'play' mode
  public events: LoggedEvent[] = [];

  public gameContext: Context<
    GameState,
    ServerEventKinds,
    GameReducerMap,
    ServerEvent,
    GameReducer
  >;
  public frontendContext: Context<
    FrontendState,
    FrontendEventKinds,
    FrontendReducerMap,
    FrontendEvent,
    FrontendReducer
  >;
  private flushLoop: UpdateLoop;

  public onGameEvent?: (event: LoggedEvent) => void;
  public post: (event: ServerEvent | FrontendEvent) => void;

  constructor({ autoStart }: EventContextOpts = { autoStart: true }) {
    super();

    const autostartAttr = this.getAttribute("autostart");
    if (autostartAttr === "false") {
      autoStart = false;
    }
    if ((window as any).ctx) {
      (window as any).ctx = [(window as any).ctx, this];
    } else {
      (window as any).ctx = this;
    }
    this.gameContext = new Context(gameReducer, newGameState());
    this.frontendContext = new Context(frontendReducer, newFrontendState());

    this.post = event => {
      if (frontendEventList.includes(event.kind)) {
        this.frontendQueue.post(event as FrontendEvent);
      } else {
        this.gameQueue.post(event as ServerEvent);
      }
    };

    this.gameQueue = new EventQueue<ServerEventKinds, ServerEvents>({
      postSyncronous: false,
      preHandler: (event: ServerEvent) => {
        this.gameContext.apply(event);
      },
      logger: (event, timestamp, listeners) => {
        this.events.push({ event, timestamp, listeners });
        if (event.kind !== "gameTick") {
          info("game event posted", {
            event: JSON.stringify(event),
            timestamp,
            listeners
          });
        }
        if (this.onGameEvent) {
          // TODO could pass in previous state and next state
          this.onGameEvent(event);
        }
      }
    });

    this.frontendQueue = new EventQueue<FrontendEventKinds, FrontendEvents>({
      postSyncronous: false,
      preHandler: (event: FrontendEvent) => {
        this.frontendContext.apply(event);
      },
      logger: (event, timestamp, listeners) => {
        this.events.push({ event, timestamp, listeners });

        // TODO probably shouldn't log these
        info("frontend event posted", {
          event: JSON.stringify(event),
          timestamp,
          listeners
        });

        if (this.onGameEvent) {
          this.onGameEvent(event);
        }
      }
    });

    this.flushLoop = new UpdateLoop(
      "queueFlush",
      (delta: number) => {
        this.frontendQueue.flushAll();
        this.gameQueue.flushAll();
        return false;
      },
      30
    );
    if (autoStart) {
      this.flushLoop.start();
    }

    // HACK load a test replay
    const url = new URL(window.location.href);
    const key = url.searchParams.get("replay");
    if (key) {
      const log = (logs as any)[key as any];
      delay(0)
        .then(async () => {
          await this.replayLog(key, true, log);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  public start() {
    this.flushLoop.start();
  }

  public loadLog(events: Array<ServerEvent | FrontendEvent>) {
    this.gameContext.resetState();
    this.frontendContext.resetState();
    this.events = [];

    for (const event of events) {
      if (event.kind === "assertion") {
        continue;
      }
      if (frontendEventList.includes(event.kind)) {
        this.frontendQueue.post(event as FrontendEvent);
        this.frontendQueue.flushAll();
      } else {
        this.gameQueue.post(event as ServerEvent);
        this.gameQueue.flushAll();
      }
    }
  }

  public async replayLog(
    title: string,
    repeat: boolean,
    events: Array<ServerEvent | FrontendEvent>,
    realtime: boolean = true
  ) {
    do {
      this.gameContext.resetState();
      this.events = [];

      info("starting event log", { title });
      const mapEvent = events[0];
      let tps = 2;
      if (mapEvent.kind === "newFiniteMap") {
        tps = mapEvent.map.tps;
      }

      for (const event of events) {
        if (frontendEventList.includes(event.kind)) {
          this.frontendQueue.post(event as FrontendEvent);
          this.frontendQueue.flushAll();
        } else {
          this.gameQueue.post(event as ServerEvent);
          this.gameQueue.flushAll();
        }
        // TODO use TPS to rate limit with game tick events
        // TODO figure out how to handle replays with game ticks and normal events
        if (
          event.kind !== "gameTick" &&
          event.kind !== "defineUnit" &&
          realtime
        ) {
          await delay(400);
        }
      }
      info("completed event log", { title });
    } while (repeat);
  }

  public async replayFromFile(url: string, realtime: boolean) {
    const resp = await fetch(url);
    const eventLog: LoggedEvent[] = JSON.parse(await resp.text());
    if (eventLog.length === 0) {
      return;
    }
    const startTime = Date.now();
    const offset = startTime - eventLog[0].timestamp;

    for (const log of eventLog) {
      if (realtime && frontendEventList.includes(log.event.kind)) {
        while (log.timestamp > Date.now() - offset) {
          await delay(100);
        }
      }
      const event = log.event;
      if (frontendEventList.includes(event.kind)) {
        this.frontendQueue.post(event as FrontendEvent);
        this.frontendQueue.flushAll();
      } else {
        this.gameQueue.post(event as ServerEvent);
        this.gameQueue.flushAll();
      }
      // await delay(100);
    }
  }
}
