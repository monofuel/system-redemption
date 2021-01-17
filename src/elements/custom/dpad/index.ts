import templateStr from "./index.html";
import './index.scss';
import { CustomElement } from "../CustomElement";

enum DPAD_DIR {
  'u' = 'u',
  'd' = 'd',
  'l' = 'l',
  'r' = 'r'
}
const selectorMap: Record<DPAD_DIR, string> = {
  'u': '#up',
  'd': '#down',
  'l': '#left',
  'r': '#right'
}
export class DPadElement extends CustomElement {
  
  constructor() {
    super(templateStr);
    console.log("DPAD loaded");

    // attach default handlers
    for (const d in DPAD_DIR) {
      this.setHandler(d, () => {
        console.log(`dpad dir ${d}`)
      })
    }
  }

  setHandler(d: DPAD_DIR, handler: (ev: MouseEvent) => any) {
    const selector = selectorMap[d]

    const e = this.querySelector(selector)! as HTMLElement;
    e.onmouseup = handler;

  }
}
