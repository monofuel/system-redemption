import { info } from '../logging';

interface EventQueueOpts {
  postSyncronous: boolean; // post event syncronously to listeners, or wait until flush
}

const defaultOpts: EventQueueOpts = {
  postSyncronous: true,
};

export class EventQueue<
  Kinds extends keyof EventMap,
  EventMap extends Record<Kinds, { kind: Kinds }>
> {
  public opts: EventQueueOpts;
  private listenerMap: Partial<
    Record<Kinds, Array<(event: EventMap[Kinds]) => void>>
  > = {};

  constructor(opts: Partial<EventQueueOpts> = {}) {
    this.opts = {
      ...defaultOpts,
      ...opts,
    };
  }

  public post(event: EventMap[Kinds]) {
    const kind = event.kind;
    const listeners: Array<(event: EventMap[Kinds]) => void> | undefined = this
      .listenerMap[kind];
    info('event posted', {
      kind: kind as string,
      listeners: listeners ? listeners.length : 0,
    });
    if (!listeners) {
      return;
    }
    for (const fn of listeners) {
      fn(event);
    }
  }
  public flush(kind?: Kinds) {
    // TODO
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
}
