import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { getURL, initWeb, shutdownWeb } from '../http';
describe('validate client files', () => {

    before(async () => {
        await initWeb();
    });
    after(async function() {
        this.timeout(20000);
        await shutdownWeb();
    });

    it('load main page', async () => {
        const dom = await JSDOM.fromURL(`${getURL()}/sr`, { runScripts: 'dangerously' });
        const helloWorld = dom.window.document.body.getElementsByTagName('chunk-test');
        assert.exists(helloWorld);

    });
});
