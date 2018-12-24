import {
  ServerEventKinds,
  ServerEvents,
  UIEventKinds,
  UIEvents,
} from '../events';
import { EventQueue } from '../events/queues';

export class EventContextElement extends HTMLElement {
  public uiQueue: EventQueue<UIEventKinds, UIEvents>;
  public serverQueue: EventQueue<ServerEventKinds, ServerEvents>;
  constructor() {
    super();
    this.uiQueue = new EventQueue();
    this.serverQueue = new EventQueue();
  }
}
