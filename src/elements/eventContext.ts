import { json } from 'body-parser';
import {
  FrontendEvent,
  FrontendEventKinds,
  FrontendEvents,
  ServerEventKinds,
  ServerEvents,
} from '../events';
import { EventQueue } from '../events/queues';
import { info } from '../logging';
import { UpdateLoop } from './threeScene';

export class EventContextElement extends HTMLElement {
  public uiQueue: EventQueue<FrontendEventKinds, FrontendEvents>;
  public serverQueue: EventQueue<ServerEventKinds, ServerEvents>;

  private uiFlushLoop: UpdateLoop;
  private serverFlushLoop: UpdateLoop;

  private uiEvents: Array<{
    event: FrontendEvent;
    timestamp: number;
    listeners: number;
  }> = [];
  private serverEvents: Array<{
    event: ServerEvents;
    timestamp: number;
    listeners: number;
  }> = [];

  constructor() {
    super();
    (window as any).ctx = this;
    this.uiQueue = new EventQueue({
      postSyncronous: false,
      logger: (event, timestamp, listeners) => {
        this.uiEvents.push({ event, timestamp, listeners });
        info('ui event posted', {
          event: JSON.stringify(event),
          timestamp,
          listeners,
        });
      },
    });
    this.serverQueue = new EventQueue({
      postSyncronous: false,
      logger: (event, timestamp, listeners) => {
        this.serverEvents.push({ event, timestamp, listeners });
        info('server event posted', {
          event: JSON.stringify(event),
          timestamp,
          listeners,
        });
      },
    });
    this.uiFlushLoop = new UpdateLoop(
      'uiQueueFlush',
      (delta: number) => {
        this.uiQueue.flushAll();
        return false;
      },
      30,
    );
    this.serverFlushLoop = new UpdateLoop(
      'uiQueueFlush',
      (delta: number) => {
        this.serverQueue.flushAll();
        return false;
      },
      30,
    );
    this.uiFlushLoop.start();
    this.serverFlushLoop.start();
  }
}
