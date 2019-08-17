import { EditorMode, HilightUpdate } from "../actions/frontend";

export interface FrontendState {
    editorMode?: EditorMode;
    hilight?: HilightUpdate;
    selectedUnits: string[];
}

export function newFrontendState(): FrontendState {
    return {
        selectedUnits: [],
    };
}
