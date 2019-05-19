import { LogEditorElement } from "./logEditor";
import { CustomElement } from "./CustomElement";
import { LandControlsElement } from "./landControls";

const events: { [key: string]: new () => CustomElement } = {
  "log-editor": LogEditorElement,
  "land-controls": LandControlsElement
};

export default events;
