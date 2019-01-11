interface EventQueueOpts {
  // post event syncronously to listeners, or wait until flush
  postSyncronous: boolean;
  // maximum number of events to publish per queue when flushing (0 for unlimited)
  flushLength: number;
  // function to run before processing the event
  preHandler: (event: any, timestamp: number, listenerCount: number) => void;
  // function to log events after they have been processed
  logger: (event: any, timestamp: number, listenerCount: number) => void;
}

const defaultOpts: EventQueueOpts = {
  postSyncronous: true,
  flushLength: 0,
  preHandler: () => {
    return;
  },
  logger: () => {
    return;
  },
};

export class EventQueue<
  Kinds extends keyof EventMap,
  EventMap extends Record<Kinds, { kind: Kinds }>
  > {
  private opts: EventQueueOpts;
  private listenerMap: Partial<
    Record<Kinds, Array<(event: EventMap[Kinds]) => void>>
  > = {};
  private eventLog: Partial<
    Record<Kinds, Array<{ event: EventMap[Kinds]; timestamp: number }>>
  > = {};

  private processing: boolean = false;

  constructor(opts: Partial<EventQueueOpts> = {}) {
    this.opts = {
      ...defaultOpts,
      ...opts,
    };
  }

  public post(event: EventMap[Kinds]) {
    if (this.opts.postSyncronous) {
      this.publishEvent(event, Date.now());
    } else {
      this.appendToLog(event);
    }
  }

  /**
   * flush all events of a given kind
   * if onlyBefore is not provided, be careful of event posting cycles!
   *
   * @param kind kind of event to flush
   * @param onlyBefore optional only flush events before the given time
   */
  public flush(kind: Kinds, onlyBefore?: number) {
    const eventLog = this.eventLog[kind];
    if (!eventLog) {
      return;
    }
    while (eventLog.length > 0) {
      const log = eventLog.shift();
      if (!log) {
        continue;
      }
      if (onlyBefore && log.timestamp > onlyBefore) {
        eventLog.unshift(log);
        return;
      }
      this.publishEvent(log.event, log.timestamp);
    }
  }

  /**
   * flush all events that were posted before calling `flushAll()`
   */
  public flushAll() {
    const flushTimestamp = Date.now();
    const kinds: Kinds[] = Object.keys(this.eventLog) as any;
    for (const kind of kinds) {
      this.flush(kind, flushTimestamp);
    }
  }

  /**
   * Attach a new listening function for kind
   * @param kind enum value for kind
   * @param fn function to handle events of that kind
   */
  public addListener<Kind extends Kinds>(
    kind: Kind,
    fn: (event: EventMap[Kind]) => void,
  ) {
    let listeners: Array<(event: EventMap[Kinds]) => void> | undefined = this
      .listenerMap[kind];
    if (!listeners) {
      listeners = this.listenerMap[kind] = [] as any;
    }
    (listeners as any).push(fn);
  }
  public removeListener<Kind extends Kinds>(
    kind: Kind,
    fn: (event: EventMap[Kind]) => void,
  ) {
    const listeners = this.listenerMap[kind];
    if (!listeners) {
      throw new Error(`no listener for ${kind}`);
    }
    const idx = listeners.findIndex((fn2) => fn === fn2);
    if (idx < 0) {
      throw new Error(`listener not found for ${kind}`);
    }
    listeners.splice(idx, 1);
  }

  private appendToLog(event: EventMap[Kinds]) {
    const kind = event.kind;
    let eventLog:
      | Array<{ event: EventMap[Kinds]; timestamp: number }>
      | undefined = this.eventLog[kind];
    if (!eventLog) {
      eventLog = this.eventLog[kind] = [] as any;
    }
    (eventLog as any).push({
      event,
      timestamp: Date.now(),
    });
  }

  private publishEvent(event: EventMap[Kinds], timestamp: number) {
    const kind = event.kind;
    const listeners: Array<(event: EventMap[Kinds]) => void> | undefined = this
      .listenerMap[kind];

    if (this.processing) {
      // events should only be published by onTick() or async tasks
      // events must not enqueue other events as that would break replayability
      throw new Error("Do not publish events syncronously in the handler of other events");
    }

    this.processing = true;
    try {
      this.opts.preHandler(event, timestamp, listeners ? listeners.length : 0);
      if (listeners) {
        for (const fn of listeners) {
          fn(event);
        }
      }
      this.opts.logger(event, timestamp, listeners ? listeners.length : 0);
    } catch (err) {
      console.error(err);
    } finally {
      this.processing = false;
    }
  }
}
