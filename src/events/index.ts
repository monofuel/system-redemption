import { FiniteMap } from '../types/SR';

// UI events

export enum EditorSelection {
  raise = 'raise',
  lower = 'lower',
  clear = 'clear',
}
export interface EditorMode {
  selection: EditorSelection;
}

export interface UIEvents {
  editorMode: EditorMode;
}

export type UIEventType = keyof UIEvents;
// server events

export interface NewFiniteMap {
  map: FiniteMap;
}

export interface ServerEvents {
  newFiniteMap: NewFiniteMap;
}
export type ServerEventType = keyof ServerEvents;
