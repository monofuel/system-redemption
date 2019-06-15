import { logs } from "../test/eventLogs";
import { EventContextElement } from "./eventContext";
import { LogPlayerElement } from "./logPlayer";
import { delay } from "../util";
import _ from "lodash";
import { FrontendEvent, ServerEvent } from "../events";

export class LogTestElement extends HTMLElement {
  constructor() {
    super();
    const repeat = true;
    this.style.display = "flex";
    this.style.overflowY = "auto";
    this.style.flexWrap = "wrap";
    for (const key of Object.keys(logs)) {
      const iframe = document.createElement("iframe");
      iframe.src = `/test/chunk/logTest.html?replay=${key}`;
      this.appendChild(iframe);
      /* 
      const log: Array<ServerEvent | FrontendEvent> = (logs as any)[key];
      const context = new EventContextElement({ autoStart: false });
      const logPlayer = new LogPlayerElement(context, false);

      context.style.display = "block";
      context.style.margin = "0";
      context.style.width = "500px";
      context.style.height = "500px";
      context.style.borderColor = "grey";
      context.style.borderStyle = "solid";
      context.style.marginBottom = "auto";
      context.style.marginTop = "auto";

      logPlayer.classList.add("fill");
      this.appendChild(context);
      context.appendChild(logPlayer);

      delay(0)
        .then(async () => {
          await context.replayLog(key, repeat, log);
        })
        .catch(err => {
          console.error(err);
        });
        */
    }
  }
}
