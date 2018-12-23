import { FiniteMap } from '../types/SR';

// UI events

export type EditorSelection = 'raise' | 'lower';
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
