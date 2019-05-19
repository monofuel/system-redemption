import { LogEditorElement } from "./logEditor";
import { CustomElement } from "./CustomElement";
const events: { [key: string]: new () => CustomElement } = {
  "log-editor": LogEditorElement
};

export default events;
