import { EventContextElement } from "../../eventContext";
import { getParentContext } from "../..";
import LogEditorTemplate from "./index.html";
import { CustomElement } from "../CustomElement";

export class LogEditorElement extends CustomElement {
  private ctx: EventContextElement;
  constructor() {
    super(LogEditorTemplate);
    this.ctx = getParentContext(this);
  }
}
