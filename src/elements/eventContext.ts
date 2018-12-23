import {
  ServerEvents,
  ServerEventType,
  UIEvents,
  UIEventType,
} from '../events';
import { EventQueue } from '../events/queues';

export class EventContextElement extends HTMLElement {
  public uiQueue: EventQueue<UIEventType, UIEvents>;
  public serverQueue: EventQueue<ServerEventType, ServerEvents>;
  constructor() {
    super();
    this.uiQueue = new EventQueue();
    this.serverQueue = new EventQueue();
  }
}
