import { EventContextElement } from "./eventContext";
import { getParentContext, loadTemplate } from ".";

export async function getLogEditorElement() {
    const template = await loadTemplate('logEditor');

    return class LogEditorElement extends HTMLElement {
        private ctx: EventContextElement;
        constructor() {
            super();
            this.ctx = getParentContext(this);
            this.appendChild(template.content.cloneNode(true));

        }
    }
}