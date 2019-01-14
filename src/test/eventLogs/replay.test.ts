import { logs } from '.';
import { applyEvent, newGameState } from '../../events/state';

describe('replay tests', () => {


    // TODO
    // test on tick logic like pathfinding
    // the event log should eventually 'settle'

    for (const key of Object.keys(logs)) {
        const log = (logs as any)[key];
        it(`replay event log ${key}`, () => {
            const state = newGameState();
            for (const event of log) {
                applyEvent(state, event);
            }
        });
        it(`replay event log twice ${key}`, () => {
            const state = newGameState();
            for (const event of log) {
                applyEvent(state, event);
            }
        });
    }
});
