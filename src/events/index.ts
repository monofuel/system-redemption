import { ServerEvent, ServerEventKinds } from "./actions/game";
import { FrontendEvent, FrontendEventKinds } from "./actions/frontend";
import { GameState } from "./store/game";
import { FrontendState } from "./store/frontend";

export interface EventTypes {
  game: ServerEvent;
  frontend: FrontendEvent;
}

export interface EventKindTypes {
  game: ServerEventKinds;
  frontend: FrontendEventKinds;
}

export interface StateTypes {
  game: GameState;
  frontend: FrontendState;
}

export type ContextKinds = keyof EventTypes;

export class Context<
  State,
  Kinds extends keyof Reducers,
  Reducers extends Record<Kinds, Reducer>,
  Action extends { kind: Kinds },
  Reducer extends (state: State, action: Action) => State
> {
  state: State;
  initialState: State;
  reducers: Reducers;
  constructor(reducers: Reducers, initialState: State) {
    this.state = initialState;
    this.initialState = initialState;
    this.reducers = reducers;
  }

  apply(action: Action) {
    const kind = action.kind;
    const reducer: Reducer = this.reducers[kind];
    this.state = reducer(this.state, action);
  }
  resetState() {
    this.state = this.initialState;
  }
}
