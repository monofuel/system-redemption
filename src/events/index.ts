import { FiniteMap } from '../types/SR';

// ----------------------
// UI events

export enum EditorSelection {
  raiselower = 'raiselower',
  clear = 'clear',
  lowerWater = 'lowerWater',
  raiseWater = 'raiseWater',
}
export interface EditorMode {
  kind: 'editorMode';
  selection: EditorSelection;
}

export interface ToggleLogViewer {
  kind: 'toggleLogViewer';
  state: 'open' | 'closed';
}

export interface FrontendEvents {
  editorMode: EditorMode;
  toggleLogViewer: ToggleLogViewer;
}
export type FrontendEventKinds = keyof FrontendEvents;
export type FrontendEvent = FrontendEvents[FrontendEventKinds];

// ----------------------
// server events

export interface NewFiniteMap {
  kind: 'newFiniteMap';
  map: FiniteMap;
}

export enum MapEditType {
  raise = 'raise',
  lower = 'lower',
}

export interface MapEdit {
  kind: 'mapEdit';
  mapName: string;
  editType: MapEditType;
  x: number;
  y: number;
}

export enum WaterChangeType {
  raise = 'raise',
  lower = 'lower',
}

export interface WaterChange {
  kind: 'waterChange';
  mapName: string;
  changeType: WaterChangeType;
  amount: number;
}

export interface ServerEvents {
  newFiniteMap: NewFiniteMap;
  mapEdit: MapEdit;
  waterChange: WaterChange;
}
export type ServerEventKinds = keyof ServerEvents;
export type ServerEvent = ServerEvents[ServerEventKinds];

export type EventKinds = ServerEventKinds | FrontendEventKinds;
export type Events = ServerEvents & FrontendEvents;
