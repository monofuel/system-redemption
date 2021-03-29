import { GameEvent } from "../actions/dualfront";
import { ServerEvent } from "../actions/game";

// NB. undo could use more work!
export function undo(event: ServerEvent) {
    const events: ServerEvent[] = [];
    switch(event.kind) {
        case 'mapEdit':
            // TODO implement biome change undo
            events.push({
                kind: 'mapEdit',
                edit: [event.edit[0] * -1,event.edit[1] * -1,event.edit[2] * -1,event.edit[3] * -1],
                loc: event.loc,
            })
            break;
        case 'waterChange':
            events.push({
                kind: 'waterChange',
                amount: event.amount * -1
            })
            break;
        case 'newEntity':
            events.push({
                kind: 'destroyUnit',
                uuid: event.unit.uuid,
            })
            break;
        default:
            console.log(`undo not implemented for event: ${event.kind}`);
    }

    return events;
}
