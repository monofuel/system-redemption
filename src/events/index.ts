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
  kind: 'editorMode';
  selection: EditorSelection;
}

export enum WaterChangeType {
  raise = 'raise',
  lower = 'lower',
}

export interface WaterChange {
  kind: 'waterChange';
  changeType: WaterChangeType;
}
export interface ToggleLogViewer {
  kind: 'toggleLogViewer';
  state: 'open' | 'closed';
}

export interface FrontendEvents {
  editorMode: EditorMode;
  waterChange: WaterChange;
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

export interface ServerEvents {
  newFiniteMap: NewFiniteMap;
  mapEdit: MapEdit;
}
export type ServerEventKinds = keyof ServerEvents;
export type ServerEvent = ServerEvents[ServerEventKinds];

export type EventKinds = ServerEventKinds | FrontendEventKinds;
export type Events = ServerEvents & FrontendEvents;
