import { GameUnit } from "../store/dualfront";
import { unitStats } from "../util/dualfront";
import { AttackEvent, GameEvent } from "../actions/dualfront";

export function attackUnit(attacker: GameUnit, defender: GameUnit) {
  const attackerStats = unitStats[attacker.type];

  const defenderStats = unitStats[defender.type];
  if (!attackerStats.attackDamage) {
    return [];
  }
  const events: GameEvent[] = [];

  const attackEvent: AttackEvent = {
    kind: "attackEvent",
    attacker: attacker.id,
    defender: defender.id,
    damage: attackerStats.attackDamage
  };
  events.push(attackEvent);

  if (defender.health <= attackerStats.attackDamage) {
    events.push({
      kind: "destroyUnitEvent",
      unit: defender.id
    });
    events.push({
      kind: "currencyChangeEvent",
      amount: defenderStats.reward,
      player: attacker.owner
    });
  }

  return events;
}
