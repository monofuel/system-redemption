import { EventContextElement } from "../eventContext";
import { getParentContext } from "..";
import LogEditorTemplate from "./index.html";

export class LogEditorElement extends HTMLElement {
  private ctx: EventContextElement;
  constructor() {
    super();
    this.ctx = getParentContext(this);
    const template = this.template();
    this.appendChild(template.content.cloneNode(true));
  }

  template() {
    console.log(LogEditorTemplate);
    const parser = new DOMParser();
    const document = parser.parseFromString(LogEditorTemplate, "text/html");
    const head = document.head;
    const el = head.querySelector("template");
    if (!el) {
      throw new Error(`missing template for ${name}`);
    }
    return el;
  }
}
