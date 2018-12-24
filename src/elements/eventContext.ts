import { EventKinds, Events, FrontendEvent, ServerEvent } from '../events';
import { EventQueue } from '../events/queues';
import { info } from '../logging';
import { delay } from '../util';
import { UpdateLoop } from './threeScene';

interface LoggedEvent {
  event: ServerEvent | FrontendEvent;
  timestamp: number;
  listeners: number;
}

export class EventContextElement extends HTMLElement {
  public queue: EventQueue<EventKinds, Events>;

  public events: LoggedEvent[] = [];

  private flushLoop: UpdateLoop;

  constructor() {
    super();
    (window as any).ctx = this;

    this.queue = new EventQueue({
      postSyncronous: false,
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
    this.flushLoop.start();
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
