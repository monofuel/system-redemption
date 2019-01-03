import { EventKinds, Events, FrontendEvent, ServerEvent } from '../events';
import { EventQueue } from '../events/queues';
import { info } from '../logging';
import { delay } from '../util';
import { UpdateLoop } from './threeScene';
import { GameState, newGameState, applyEvent } from '../events/state';

interface LoggedEvent {
  event: ServerEvent | FrontendEvent;
  timestamp: number;
  listeners: number;
}

interface EventContextOpts {
  autoStart: boolean;
}

export class EventContextElement extends HTMLElement {
  public queue: EventQueue<EventKinds, Events>;

  public events: LoggedEvent[] = [];

  public gameState: GameState;
  private flushLoop: UpdateLoop;

  constructor({ autoStart }: EventContextOpts = { autoStart: true }) {
    super();
    (window as any).ctx = this;
    this.gameState = newGameState();

    this.queue = new EventQueue({
      postSyncronous: false,
      preHandler: (event) => {
        applyEvent(this.gameState, event);
      },
      logger: (event, timestamp, listeners) => {
        this.events.push({ event, timestamp, listeners });
        info('event posted', {
          event: JSON.stringify(event),
          timestamp,
          listeners,
        });
      },
    });


    this.flushLoop = new UpdateLoop(
      'queueFlush',
      (delta: number) => {
        this.queue.flushAll();
        return false;
      },
      30,
    );
    if (autoStart) {
      this.flushLoop.start();
    }
  }

  public start() {
    this.flushLoop.start();
  }

  public async replayLog(title: string, repeat: boolean, events: Array<ServerEvent | FrontendEvent>) {
    do {
      this.gameState = newGameState();
      info('starting event log', { title });
      for (const event of events) {

        this.queue.post(event);
        this.queue.flushAll();
        await delay(500);
      }
      info('completed event log', { title });
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
      if (realtime) {
        while (log.timestamp > Date.now() - offset) {
          await delay(100);
        }
      }
      this.queue.post(log.event);
      // await delay(100);
    }
  }
}
