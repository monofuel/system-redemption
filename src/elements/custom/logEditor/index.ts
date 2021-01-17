import { EventContextElement } from "../../eventContext";
import { getParentContext } from "../..";
import templateStr from "./index.html";
import { CustomElement } from "../CustomElement";

export class LogEditorElement extends CustomElement {
  private ctx: EventContextElement;
  constructor() {
    super(templateStr);
    this.ctx = getParentContext(this);
  }
}
