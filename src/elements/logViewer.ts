import { getParentContext, loadTemplate } from '.';
import { ToggleLogViewer } from '../events';
import { EventContextElement } from './eventContext';

export async function getLogViewerElement() {
  const template = await loadTemplate('logViewer');

  return class LogViewerElement extends HTMLElement {
    private buttonMap: { [key: string]: Element } = {};
    private ctx: EventContextElement;
    constructor() {
      super();
      this.ctx = getParentContext(this);
      this.appendChild(template.content.cloneNode(true));
      this.ctx.queue.addListener('toggleLogViewer', this.toggle.bind(this));

      const close: HTMLSpanElement = document.querySelector(
        'log-viewer #close',
      ) as any;
      close.onclick = () => {
        this.ctx.post({
          kind: 'toggleLogViewer',
          state: 'closed',
        });
      };
    }

    private toggle(event: ToggleLogViewer) {
      if (event.state === 'open') {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
    private onOpen() {
      const popup = this.querySelector('log-viewer .ui-popup');
      if (!popup) {
        return;
      }
      popup.classList.add('open');

      const logText: HTMLTextAreaElement | null = this.querySelector(
        'log-viewer textarea',
      );
      if (logText) {
        logText.textContent = JSON.stringify(this.ctx.events, undefined, 2);
      }
    }
    private onClose() {
      const popup = this.querySelector('log-viewer .ui-popup');
      if (!popup) {
        return;
      }
      popup.classList.remove('open');
    }
  };
}
