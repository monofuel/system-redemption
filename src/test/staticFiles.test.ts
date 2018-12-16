import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { getURL, initWeb, shutdownWeb } from '../http';
describe('validate static files', () => {

    before(async () => {
        await initWeb();
    });
    after(async () => {
        await shutdownWeb();
    });

    it('load main page', async () => {
        const dom = await JSDOM.fromURL(getURL(), { runScripts: 'dangerously' });
        const helloWorld = dom.window.document.body.getElementsByTagName('h1');
        assert.equal(helloWorld.length, 1);

    });
});
