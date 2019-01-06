
import { logs } from '../test/eventLogs';
import { EventContextElement } from './eventContext';
import { LogPlayerElement } from './logPlayer';
import { delay } from '../util';

export class LogTestElement extends HTMLElement {

    constructor() {
        super();
        const repeat = false;
        this.style.display = 'flex';
        this.style.flexWrap = 'wrap';
        for (const key of Object.keys(logs)) {
            const log = (logs as any)[key];
            const context = new EventContextElement({ autoStart: false });
            const logPlayer = new LogPlayerElement(context);
            context.style.display = 'block';
            context.style.margin = '0';
            context.style.width = '500px';
            context.style.height = '500px';
            context.style.borderColor = 'grey';
            context.style.borderStyle = 'solid';

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
