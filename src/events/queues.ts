import { ServerEvents, ServerEventType, UIEvents, UIEventType } from '.';
import { info } from '../logging';

export class EventQueue<Type extends keyof Events, Events> {
  private listenerMap: {
    [type: string]: Array<(event: Events[Type]) => void>;
  } = {};

  public post(eventType: Type, event: Events[Type]) {
    const listeners = this.listenerMap[eventType as any];
    info('event posted', {
      eventType: eventType as string,
      listeners: listeners ? listeners.length : 0,
    });
    if (!listeners) {
      return;
    }
    for (const fn of listeners) {
      fn(event);
    }
  }
  public addListener(eventType: Type, fn: (event: Events[Type]) => void) {
    let listeners = this.listenerMap[eventType as any];
    if (!listeners) {
      listeners = this.listenerMap[eventType as any] = [];
    }
    listeners.push(fn);
  }
  public removeListener(eventType: Type, fn: (event: Events[Type]) => void) {
    const listeners = this.listenerMap[eventType as any];
    if (!listeners) {
      throw new Error(`no listener for ${eventType}`);
    }
    const idx = listeners.findIndex((fn2) => fn === fn2);
    if (idx < 0) {
      throw new Error(`listener not found for ${eventType}`);
    }
    listeners.splice(idx, 1);
  }
}
