import { LogEditorElement } from "./logEditor";
import { CustomElement } from "./CustomElement";
import { LandControlsElement } from "./landControls";
import { LogViewerElement } from "./logViewer";
import { AdminControlsElement } from "./adminControls";
import { UITestElement } from "./uiTest";

const events: { [key: string]: new () => CustomElement } = {
  "log-editor": LogEditorElement,
  "land-controls": LandControlsElement,
  "log-viewer": LogViewerElement,
  "admin-controls": AdminControlsElement,
  "ui-test": UITestElement
};

export default events;
