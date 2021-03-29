import { LitElement, html, css } from "lit-element";
import * as THREE from "three";
import {
  GameEvent,
  EventKinds,
  NewMapEvent,
  Events,
  BuildEvent,
  MoveEvent,
  AttackEvent,
  DestroyUnitEvent
} from "../../../../events/actions/dualfront";
import { gameReducer } from "../../../../events/reducers/dualfront";
import { createNewMapEvent, unitStats } from "../../../../events/util/dualfront";
import uuid from "uuid";
import { getUnitObj } from "../../../../mesh/dualfront";
import { attackUnit } from "../../../../events/commands/dualfront";
import { GameState, newGameState, UnitType, GameUnit } from "../../../../events/store/dualfront";

type EventMap = Record<EventKinds, Events[EventKinds]>;

export class DualfrontUITestElement extends LitElement {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public events: GameEvent[] = [];

  public state: GameState;
  private listenerMap: Partial<
    Record<
      EventKinds,
      Array<(event: any, oldState: GameState, newState: GameState) => void>
    >
  > = {};

  constructor() {
    super();
    this.state = newGameState();
    this.scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    this.camera.zoom = 15;
    this.camera.translateZ(5);
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer();

    this.addListener("newMapEvent", (e: NewMapEvent) => {
      console.log(this.state.backgroundColor);
      this.renderer.setClearColor(this.state.backgroundColor, 1);

      this.camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
      );
      const zoom = 8;
      this.camera.translateZ(5);
      this.camera.translateX(width / (zoom * 2));
      this.camera.translateY(height / (zoom * 2));
      this.camera.zoom = zoom;
      this.camera.updateProjectionMatrix();

      for (const unit of this.state.units) {
        this.addUnit(unit);
      }
    });
    this.addListener("buildEvent", (e: BuildEvent) => {
      this.addUnit(e.unit);

      // update currency amounts on ui
      this.update(new Map());
    });

    this.addListener(
      "attackEvent",
      (e: AttackEvent, oldState: GameState, newState: GameState) => {
        // TODO draw a line between units for a laser
      }
    );

    this.addListener(
      "destroyUnitEvent",
      (e: DestroyUnitEvent, oldState: GameState, newState: GameState) => {
        const obj = this.scene.children.find(obj => obj.userData.id === e.unit);
        if (!obj) {
          return;
        }
        this.scene.remove(obj);

        const unit = oldState.units.find(u => u.id === e.unit);
        if (unit!.type === "base") {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    );
    console.log("foo4");
    this.addListener(
      "moveEvent",
      (e: MoveEvent, oldState: GameState, newState: GameState) => {
        const oldUnit = oldState.units.find(u => u.id === e.unit);
        const newEntity = newState.units.find(u => u.id === e.unit);
        const obj = this.scene.children.find(obj => obj.userData.id === e.unit);
        if (!obj) {
          return;
        }
        if (newEntity && oldUnit) {
          let angle = Math.atan2(oldUnit.y - newEntity.y, oldUnit.x - newEntity.x);
          angle += Math.PI / 2;

          obj.rotation.z = angle;
        }
        // TODO interpolate to location over time
        obj.position.x = e.x;
        obj.position.y = e.y;
      }
    );

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.translateX(1);
    axesHelper.translateY(1);

    this.scene.add(axesHelper);

    this.events.push(createNewMapEvent());
    this.draw();
    this.tick();

    for (const unit of this.state.units) {
      if (unit.type !== UnitType.base) {
        continue;
      }
      this.events.push({
        kind: "buildEvent",
        unit: {
          id: uuid.v4(),
          x: unit.x,
          y: unit.y + 4,
          factory: true,
          health: 50,
          type: UnitType.triangle,
          owner: unit.owner,
          cooldown: 0
        }
      });

      this.events.push({
        kind: "buildEvent",
        unit: {
          id: uuid.v4(),
          x: unit.x,
          y: unit.y - 4,
          factory: true,
          health: 50,
          type: UnitType.triangle,
          owner: unit.owner,
          cooldown: 0
        }
      });

      // build a second one for one user
      if (this.state.players[0].id === unit.owner) {
        this.events.push({
          kind: "buildEvent",
          unit: {
            id: uuid.v4(),
            x: unit.x + 4,
            y: unit.y,
            factory: true,
            health: 50,
            type: UnitType.triangle,
            owner: unit.owner,
            cooldown: 0
          }
        });
      }
    }
  }

  addUnit(unit: GameUnit) {
    const obj = getUnitObj(this.state, unit);
    obj.position.x = unit.x;
    obj.position.y = unit.y;
    obj.userData.id = unit.id;
    this.scene.add(obj);
  }

  render() {
    const player1CSS = css`
      position: absolute;
      font-size: 2em;
      top: 1em;
      left: 1em;
    `;
    const player2CSS = css`
      position: absolute;
      font-size: 2em;
      top: 1em;
      right: 1em;
    `;

    return html`
      <div>
        <span style=${player1CSS}>${this.state.players[0].currency}</span>
        <span style=${player2CSS}>${this.state.players[1].currency}</span>
        ${this.renderer.domElement}
      </div>
    `;
  }

  draw() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.draw());
  }

  public addListener<Kind extends EventKinds>(
    kind: Kind,
    fn: (event: any, oldState: GameState, newState: GameState) => void
  ) {
    let listeners:
      | Array<(event: any, oldState: GameState, newState: GameState) => void>
      | undefined = this.listenerMap[kind];
    if (!listeners) {
      listeners = this.listenerMap[kind] = [] as any;
    }
    (listeners as any).push(fn);
  }
  public removeListener<Kind extends EventKinds>(
    kind: Kind,
    fn: (event: EventMap[Kind]) => void
  ) {
    const listeners = this.listenerMap[kind];
    if (!listeners) {
      throw new Error(`no listener for ${kind}`);
    }
    const idx = listeners.findIndex(fn2 => fn === fn2);
    if (idx < 0) {
      throw new Error(`listener not found for ${kind}`);
    }
    listeners.splice(idx, 1);
  }

  tick() {
    this.events.push({
      kind: "tickEvent",
      id: this.state.tick + 1
    });

    for (const unit of this.state.units) {
      if (!unit.factory || unit.cooldown !== 0) {
        continue;
      }
      // factory build unit
      this.events.push({
        kind: "buildEvent",
        factory: unit.id,
        unit: {
          id: uuid.v4(),
          x: unit.x,
          y: unit.y,
          factory: false,
          type: unit.type,
          owner: unit.owner,
          health: 2,
          cooldown: 0
        }
      });
    }
    for (const unit of this.state.units) {
      const stats = unitStats[unit.type];
      if (unit.factory || unit.type === UnitType.base) {
        continue;
      }

      // if close to another unit, push away
      const loc = new THREE.Vector2(unit.x, unit.y);

      const closestUnit = nearbyUnit(this.state, unit);
      if (closestUnit) {
        const nearbyLoc = new THREE.Vector2(closestUnit.x, closestUnit.y);
        const distance = loc.distanceTo(nearbyLoc);

        if (distance < 1) {
          const lerp = loc.lerp(nearbyLoc, -0.4);
          // Add some noise, in case the units are on the same location
          lerp.x += Math.random() / 10;
          lerp.y += Math.random() / 10;

          this.events.push({
            kind: "moveEvent",
            unit: unit.id,
            x: lerp.x,
            y: lerp.y
          });
        }
      }

      // move to attack enemy
      if (!stats.attackRange) {
        continue;
      }

      const closestEnemy = findEnemy(this.state, unit);
      if (!closestEnemy) {
        continue;
      }

      const enemyLoc = new THREE.Vector2(closestEnemy.x, closestEnemy.y);
      const distance = loc.distanceTo(enemyLoc);

      if (distance < stats.attackRange) {
        this.events.push(...attackUnit(unit, closestEnemy));

        continue;
      } else {
        // otherwise, move closer to enemy
        const lerp = loc.lerp(enemyLoc, stats.speed / distance);
        this.events.push({
          kind: "moveEvent",
          unit: unit.id,
          x: lerp.x,
          y: lerp.y
        });
      }
    }

    while (this.events.length > 0) {
      const event = this.events.shift();
      if (!event) {
        break;
      }

      const reducer: any = gameReducer[event.kind];
      const oldState = this.state;
      if (event.kind !== "tickEvent") {
        // console.log(event);
      }
      this.state = reducer(oldState, event);
      const listeners: Array<
        (
          event: EventMap[EventKinds],
          oldState: GameState,
          newState: GameState
        ) => void
      > = this.listenerMap[event.kind] || [];
      for (const fn of listeners) {
        fn(event, oldState, this.state);
      }
    }

    setTimeout(() => this.tick(), 1000 / 8);
  }
}

function findEnemy(state: GameState, unit: GameUnit): GameUnit | undefined {
  const enemies = state.units.filter(u => u.owner !== unit.owner);
  const loc = new THREE.Vector2(unit.x, unit.y);
  enemies.sort((a, b) => {
    const vecA = new THREE.Vector2(a.x, a.y);
    const vecB = new THREE.Vector2(b.x, b.y);
    return loc.distanceTo(vecA) - loc.distanceTo(vecB);
  });
  return enemies.shift();
}

function nearbyUnit(state: GameState, unit: GameUnit): GameUnit | undefined {
  // ignore self
  const units = state.units.filter(u => u.id !== unit.id);
  const loc = new THREE.Vector2(unit.x, unit.y);
  units.sort((a, b) => {
    const vecA = new THREE.Vector2(a.x, a.y);
    const vecB = new THREE.Vector2(b.x, b.y);
    return loc.distanceTo(vecA) - loc.distanceTo(vecB);
  });
  return units.shift();
}
