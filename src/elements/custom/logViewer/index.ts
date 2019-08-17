import { getParentContext, loadTemplate } from "../../";
import { EventContextElement } from "../../eventContext";

import templateStr from "./index.html";
import { CustomElement } from "../CustomElement";
import { ToggleLogViewer } from "../../../events/actions/frontend";

export class LogViewerElement extends CustomElement {
  private buttonMap: { [key: string]: Element } = {};
  private ctx: EventContextElement;
  constructor() {
    super(templateStr);
    this.ctx = getParentContext(this);
    this.ctx.frontendQueue.addListener(
      "toggleLogViewer",
      this.toggle.bind(this)
    );

    const close: HTMLSpanElement = document.querySelector(
      "log-viewer #close"
    ) as any;
    close.onclick = () => {
      this.ctx.post({
        kind: "toggleLogViewer",
        state: "closed"
      });
    };
  }

  private toggle(event: ToggleLogViewer) {
    if (event.state === "open") {
      this.onOpen();
    } else {
      this.onClose();
    }
  }
  private onOpen() {
    const popup = this.querySelector("log-viewer .ui-popup");
    if (!popup) {
      return;
    }
    popup.classList.add("open");

    const logText: HTMLTextAreaElement | null = this.querySelector(
      "log-viewer textarea"
    );
    if (logText) {
      logText.textContent = JSON.stringify(
        this.ctx.events.map(e => e.event),
        undefined,
        2
      );
    }
  }
  private onClose() {
    const popup = this.querySelector("log-viewer .ui-popup");
    if (!popup) {
      return;
    }
    popup.classList.remove("open");
  }
}
