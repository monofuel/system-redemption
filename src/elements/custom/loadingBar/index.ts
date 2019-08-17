import { EventContextElement } from "../../eventContext";
import { getParentContext } from "../..";
import templateStr from "./index.html";
import { CustomElement } from "../CustomElement";

export class LoadingBarElement extends CustomElement {
  public progress: HTMLProgressElement;
  constructor() {
    super(templateStr);
    this.progress = this.querySelector("#loading-progress") as any;
  }
}
