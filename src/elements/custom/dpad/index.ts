import templateStr from "./index.html";
import './index.scss';
import { CustomElement } from "../CustomElement";

export class DPadElement extends CustomElement {
  
  constructor() {
    super(templateStr);
    console.log("DPAD loaded");
  }
}
