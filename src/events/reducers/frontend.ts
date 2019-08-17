import { FrontendEventKinds, FrontendEvents, SelectUnits, EditorMode, HilightUpdate, ToggleLogViewer, FrontendEvent } from "../actions/frontend";
import { FrontendState } from "../store/frontend";

// TODO figure out how to type event
export type FrontendReducer = (state: FrontendState, event: any) => FrontendState;
export type FrontendReducerMap = Record<FrontendEventKinds, FrontendReducer>;
export const frontendReducer: FrontendReducerMap = {
    editorMode: editorModeChange,
    toggleLogViewer: toggleLogViewerChange,
    hilightUpdate: applyHilightUpdate,
    selectUnits: applySelectUnits,
}

export function applySelectUnits(state: FrontendState, event: SelectUnits): FrontendState {
    state.selectedUnits = event.uuids;
    return {
        ...state,
        selectedUnits: event.uuids,
    }
}

export function editorModeChange(state: FrontendState, event: EditorMode): FrontendState {
    return {
        ...state,
        editorMode: event,
    }
}

export function applyHilightUpdate(state: FrontendState, event: HilightUpdate): FrontendState {
    return {
        ...state,
        hilight: event,
    }
}

export function toggleLogViewerChange(
    state: FrontendState,
    event: ToggleLogViewer
): FrontendState {
    return state;
}
