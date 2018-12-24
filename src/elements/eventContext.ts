import {
  ServerEventKinds,
  ServerEvents,
  FrontendEventKinds,
  FrontendEvents
} from "../events";
import { EventQueue } from "../events/queues";

export class EventContextElement extends HTMLElement {
  public uiQueue: EventQueue<FrontendEventKinds, FrontendEvents>;
  public serverQueue: EventQueue<ServerEventKinds, ServerEvents>;
  constructor() {
    super();
    this.uiQueue = new EventQueue();
    this.serverQueue = new EventQueue();
  }
}
