import templateStr from "./index.html";
import { CustomElement } from "../CustomElement";

export class UITestElement extends CustomElement {
  constructor() {
    super(templateStr);
  }
}
