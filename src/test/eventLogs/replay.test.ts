import { logs } from ".";
import { newGameState } from "../../events/store/game";
import { Context } from "../../events";
import { gameReducer } from "../../events/reducers/game";
import { frontendReducer } from "../../events/reducers/frontend";
import { newFrontendState } from "../../events/store/frontend";
import { frontendEventList } from "../../events/actions/frontend";

describe("replay tests", () => {
  // TODO
  // test on tick logic like pathfinding
  // the event log should eventually 'settle'

  for (const key of Object.keys(logs)) {
    const log = (logs as any)[key];
    it(`replay event log ${key}`, () => {
      const gameContext = new Context(gameReducer, newGameState());
      const frontendContext = new Context(frontendReducer, newFrontendState());
      for (const event of log) {
        if (frontendEventList.includes(event.kind)) {
          frontendContext.apply(event);
        } else {
          gameContext.apply(event);
        }
      }
    });
    it(`replay event log twice ${key}`, () => {
      const gameContext = new Context(gameReducer, newGameState());
      const frontendContext = new Context(frontendReducer, newFrontendState());
      for (const event of log) {
        if (frontendEventList.includes(event.kind)) {
          frontendContext.apply(event);
        } else {
          gameContext.apply(event);
        }
      }
    });
  }
});
