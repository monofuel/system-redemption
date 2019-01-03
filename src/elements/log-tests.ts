
import { logs } from '../test/eventLogs';
import { EventContextElement } from './eventContext';
import { LogPlayerElement } from './logPlayer';
import { delay } from '../util';

export class LogTestElement extends HTMLElement {

    constructor() {
        super();
        const repeat = true;
        for (const key of Object.keys(logs)) {
            const log = (logs as any)[key];
            const context = new EventContextElement({ autoStart: false });
            const logPlayer = new LogPlayerElement(context);
            context.classList.add('fill');
            logPlayer.classList.add('fill');
            this.appendChild(context);
            context.appendChild(logPlayer);

            delay(0).then(async () => {
                await context.replayLog(key, repeat, log);
            }).catch((err) => {
                console.error(err);
            });
        }
    }
}
