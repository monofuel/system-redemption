import { logs } from '../../../test/eventLogs';
import { LitElement, html } from 'lit-element';

export class TestMenuElement extends LitElement {
  render() {
    return html`
    <aside class="menu"></aside>
    <ul class="menu-list">
        ${Object.keys(logs).map((logKey) => {
          return html`
            <li>
              <a href="/test/chunk/logTest.html?replay=${logKey}">${logKey}</a>
            </li>
          `;
        })}
      </ul>
      </aside>
    `;
  }
}
