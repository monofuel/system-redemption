import { loadTemplate, getParentContext } from ".";
import { EventContextElement } from "./eventContext";
import { parseQueryOpts } from "../matchMaker";

export async function getAdminControlsElement() {
    const template = await loadTemplate('adminControls');

    return class AdminControlsElement extends HTMLElement {
        private ctx: EventContextElement;
        constructor() {
            super();
            const opts = parseQueryOpts(window.location.href);
            this.ctx = getParentContext(this);
            this.appendChild(template.content.cloneNode(true));
            const playerLabel = document.getElementById('player-label') as HTMLInputElement;
            playerLabel.innerText = `Color: ${opts.color}`;
            if (this.ctx.gameState.match) {
                this.updateLinks(this.ctx.gameState.match.id);
            }
            this.ctx.queue.addListener('createMatch', (e) => {
                this.updateLinks(e.id);
            })
        }
        private updateLinks(id: string) {
            const { protocol, hostname, port } = window.location;
            const baseLink = `${protocol}//${hostname}:${port}/test/play/?mode=multi&matchId=${id}`;

            const blueLink = document.getElementById('link-blue') as HTMLInputElement;
            blueLink.onclick = () => setTimeout(() => blueLink.select(), 0);
            blueLink.value = baseLink + '&color=blue';

            const redLink = document.getElementById('link-red') as HTMLInputElement;
            redLink.onclick = () => redLink.select();
            redLink.value = baseLink + '&color=red';
        }
    }
}