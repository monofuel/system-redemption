import { EntityType } from "../../types/planefront";
import { UnitType, GameColors, LocHash } from "../../types/SR";

export enum EditorSelection {
    raiselower = 'raiselower',
    clear = 'clear',
    lowerWater = 'lowerWater',
    raiseWater = 'raiseWater',
    newEntity = 'newEntity',
    removeUnit = 'removeUnit'
}
export interface EditorMode {
    kind: 'editorMode';
    selection: EditorSelection;
    smoothMode: boolean;
    user?: GameColors;
    entityType?: UnitType | EntityType;
}

export interface ToggleLogViewer {
    kind: 'toggleLogViewer';
    state: 'open' | 'closed';
}

export interface HilightUpdate {
    kind: 'hilightUpdate';
    loc?: LocHash;
    color?: number;
    corner?: Array<0 | 1 | 2 | 3>;
}

export interface SelectUnits {
    kind: 'selectUnits',
    uuids: string[],
}

export interface FrontendEvents {
    editorMode: EditorMode;
    toggleLogViewer: ToggleLogViewer;
    hilightUpdate: HilightUpdate;
    selectUnits: SelectUnits;
}
export type FrontendEventKinds = keyof FrontendEvents;
export type FrontendEvent = FrontendEvents[FrontendEventKinds];

export const frontendEventList = ['editorMode', 'toggleLogViewer', 'hilightUpdate', 'selectUnits'];
