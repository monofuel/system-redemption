import { FiniteMap } from '../types/SR';

// ----------------------
// UI events

export enum EditorSelection {
  raiselower = 'raiselower',
  clear = 'clear',
  raiseWater = 'raiseWater',
  lowerWater = 'lowerWater',
}
export interface EditorMode {
  selection: EditorSelection;
}

export interface UIEvents {
  editorMode: EditorMode;
}

export type UIEventType = keyof UIEvents;

// ----------------------
// server events

export interface NewFiniteMap {
  map: FiniteMap;
}

export enum MapEditType {
  raise = 'raise',
  lower = 'lower',
}

export interface MapEdit {
  mapName: string;
  editType: MapEditType;
  x: number;
  y: number;
}

export interface ServerEvents {
  newFiniteMap: NewFiniteMap;
  editMap: MapEdit;
}
export type ServerEventType = keyof ServerEvents;
