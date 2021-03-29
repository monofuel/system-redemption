import { ThreeSceneElement } from './threeScene';
import { EventContextElement } from './eventContext';
import { HemisphereLight, DirectionalLight, Vector2, Raycaster, Vector3, Group, Mesh } from 'three';
import { Entity, LocHash } from '../types/SR';
import { info } from '../logging';
import { getPlanetObject, invalidateChunkCache, clearChunkCache } from '../mesh/tiles';
import { ECS } from './components';
import { unitGraphicalComp, hilightGraphicalComp, GraphicalType } from './components/graphical';
import { getChunkForTile } from '../planet';
import { getHilightMesh } from '../mesh/hilight';
import { getHash } from '../services/hash';
import { mouseToVec } from '.';
import _ from 'lodash';
import { UpdateLoop } from '../events/serverContext';
import { getExplosionGroup } from '../mesh/particles';
import { HilightUpdate, EditorSelection } from '../events/actions/frontend';

export class PlanetElement extends ThreeSceneElement {
  protected ecsLoop: UpdateLoop;

  protected ecs: ECS;
  protected usePlanetCache: boolean = false;

  constructor(ctx?: EventContextElement, useDatGui?: boolean) {
    super(ctx, useDatGui);

    this.ecs = new ECS(this);
    this.ecsLoop = new UpdateLoop(
      'ecs',
      (delta: number): boolean => {
        this.ecs.update(delta);
        return false;
      },
      40,
    );
    this.ecsLoop.start();

    this.camera.position.set(6, 9, 6);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(new HemisphereLight(0xffffff, undefined, 0.6));

    const sun = new DirectionalLight(0xffffff, 1);
    sun.translateY(5);
    sun.translateX(-5);
    sun.translateZ(-3);
    sun.lookAt(0, 0, 0);

    this.scene.add(sun);

    this.ctx.gameQueue.addListener('newFiniteMap', (event) => {
      for (const key in this.ecs.graphical) {
        this.ecs.removeGraphicalComponent(key);
      }
      clearChunkCache();
      this.loadMap();
    });
    this.ctx.gameQueue.addListener('waterChange', (event) => {
      this.loadMap();
    });
    this.ctx.gameQueue.addListener('mapEdit', (event) => {
      invalidateChunkCache(getChunkForTile(this.ctx.gameContext.state.planet!, event.loc));
      this.loadMap();

      const hilight = this.ctx.frontendContext.state.hilight;
      if (hilight && hilight.loc) {
        const key = 'hilight';
        const comp = hilightGraphicalComp(this, key, hilight.loc, hilight.color, hilight.corner);
        this.ecs.addGraphicalComponent(comp);
      }
    });

    this.ctx.gameQueue.addListener('moveUnit', (event) => {
      console.log(event);
      console.log(this.ctx.gameContext.state.units[event.uuid]);
    });

    this.ctx.frontendQueue.addListener('hilightUpdate', (event: HilightUpdate) => {
      const key = 'hilight';
      if (!event.loc) {
        this.ecs.removeGraphicalComponent(key);
      } else {
        const comp = hilightGraphicalComp(this, key, event.loc, event.color, event.corner);
        this.ecs.addGraphicalComponent(comp);
      }
    });

    this.ctx.frontendQueue.addListener('selectUnits', (event) => {
      const planet = this.ctx.gameContext.state.planet!;
      const uuids = event.uuids;
      const hilightColor = 0xba2b0e;

      for (const uuid of uuids) {
        const comp = this.ecs.graphical[uuid];
        if (!comp || comp.type !== GraphicalType.unit) {
          continue;
        }
        const hilight = getHilightMesh({
          planet,
          zScale: planet.zScale,
          color: hilightColor,
        });
        hilight.name = 'selection';
        hilight.scale.set(1.7, 1.7, 1.7);
        hilight.position.y += 0.2;
        comp.mesh.add(hilight);
      }

      for (const uuid in this.ecs.graphical) {
        const comp = this.ecs.graphical[uuid];
        const selection = comp.mesh.getObjectByName('selection');
        if (selection && !event.uuids.includes(comp.key)) {
          comp.mesh.remove(selection);
        }
      }
    });

    this.onAssetsLoaded = () => {
      this.ctx.gameQueue.addListener('destroyUnit', (event) => {
        this.ecs.removeGraphicalComponent(event.uuid);
      });
      this.ctx.gameQueue.addListener('damageUnit', (e) => {
        const comp = this.ecs.graphical[e.uuid];
        if (comp) {
          comp.speGroup = getExplosionGroup();
          const mesh = comp.speGroup!.mesh;
          comp.mesh.add(mesh);
        }
      });
      this.ctx.gameQueue.addListener('newEntity', (event) => {
        this.addUnit(this.ctx.gameContext.state.units[event.unit.uuid]);
      });
      for (const unit of Object.values(this.ctx.gameContext.state.units)) {
        this.addUnit(unit);
      }
    };
  }

  protected getUnitAtMouse(ev: MouseEvent): string | null {
    const vec = mouseToVec(ev, this.offsetWidth, this.offsetHeight);
    if (!vec) {
      return null;
    }
    const raycaster = new Raycaster();
    raycaster.setFromCamera(vec, this.camera);

    const units: Mesh[] = [];
    for (const key in this.ecs.graphical) {
      const comp = this.ecs.graphical[key];
      if (comp.type === GraphicalType.unit) {
        units.push(comp.mesh);
      }
    }
    const intersects = raycaster.intersectObjects(units, true);
    if (intersects.length > 0) {
      return intersects[0].object.userData.uuid;
    }
    return null;
  }

  protected hilightAtMouse(ev: MouseEvent) {
    const mode = this.ctx.frontendContext.state.editorMode;

    const vec = this.getPointAtRay(mouseToVec(ev, this.offsetWidth, this.offsetHeight), true);
    if (!vec) {
      if (this.ctx.frontendContext.state.hilight && this.ctx.frontendContext.state.hilight.loc) {
        this.ctx.post({
          kind: 'hilightUpdate',
        });
      }
      return;
    }

    const loc: [number, number] = [Math.floor(vec.x), Math.floor(vec.z)];

    const corners: Array<0 | 1 | 2 | 3> = [];
    if (mode && mode.selection === EditorSelection.raiselower) {
      const deltaX = vec.x - loc[0];
      const deltaY = vec.z - loc[1];
      const lb = 0.13;
      const ub = 1 - lb;
      if (deltaX < lb) {
        if (deltaY < lb) {
          corners.push(3);
        } else if (deltaY > ub) {
          corners.push(0);
        } else {
          corners.push(0, 3);
        }
      } else if (deltaX > ub) {
        if (deltaY < lb) {
          corners.push(2);
        } else if (deltaY > ub) {
          corners.push(1);
        } else {
          corners.push(1, 2);
        }
      } else {
        if (deltaY < lb) {
          corners.push(3, 2);
        } else if (deltaY > ub) {
          corners.push(1, 0);
        } else {
          corners.push(0, 1, 2, 3);
        }
      }
    }

    const existing = this.ctx.frontendContext.state.hilight;
    const newState: HilightUpdate = {
      kind: 'hilightUpdate',
      loc: getHash(loc[0], loc[1]),
      corner: corners.length > 0 ? corners : undefined,
    };

    if (_.isEqual(existing, newState)) {
      return;
    }

    this.ctx.post(newState);
  }

  private addUnit(unit: Entity) {
    const comp = unitGraphicalComp(this, unit);
    this.ecs.addGraphicalComponent(comp);
  }

  protected getTileAtRay(screenLoc: Vector2, ignoreWater: boolean): LocHash | null {
    const vec = this.getPointAtRay(screenLoc, ignoreWater);
    if (!vec) {
      return null;
    }
    let x = Math.floor(vec.x);
    let y = Math.floor(vec.z);
    return getHash(x, y);
  }

  protected getPointAtRay(screenLoc: Vector2, ignoreWater: boolean): Vector3 | null {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(screenLoc, this.camera);

    const mapGroup = this.scene.getObjectByName(this.ctx.gameContext.state.planet!.name);
    if (!mapGroup) {
      return null;
    }

    const intersects = raycaster.intersectObjects(mapGroup.children, true);
    let intersection = intersects.length > 0 ? intersects[0] : null;
    // HACK for ignoring water, ignore transparent faces
    if (ignoreWater) {
      for (const inter of intersects) {
        const face = inter.face;
        if (face && face.materialIndex === 2) {
          intersection = null;
          continue;
        } else {
          intersection = inter;
          break;
        }
      }
    }
    if (intersection) {
      const vec = intersection.point.applyMatrix4(mapGroup.matrix);
      // fudge the number over a little to prevent flickering over cliffs
      vec.add(new Vector3(0.001, 0.001, 0.001));
      let { x, y } = vec;
      const maxSize = this.ctx.gameContext.state.planet!.size * this.ctx.gameContext.state.planet!.chunkSize;
      if (x < 0) {
        vec.x = 0;
      }
      if (y < 0) {
        vec.z = 0;
      }
      if (x > maxSize - 0.002) {
        vec.x = maxSize - 0.002;
      }
      if (y > maxSize - 0.002) {
        vec.z = maxSize - 0.002;
      }
      return vec;
    } else {
      return null;
    }
  }

  private loadMap() {
    const gameMap = this.ctx.gameContext.state.planet;
    if (!gameMap) {
      throw new Error('game map not loaded');
    }
    info('loading map', { name: gameMap.name });
    const sun = new DirectionalLight(gameMap.sunColor, 0.8);
    sun.name = 'gameMap-sun';
    sun.translateY(40);
    sun.translateX(50);
    sun.lookAt(0, 0, 0);
    let existingSun = this.scene.getObjectByName(sun.name);
    if (existingSun) {
      this.scene.remove(existingSun);
    }
    this.scene.add(sun);

    let mapGroup = this.scene.getObjectByName(gameMap.name);
    const mapObj = getPlanetObject({
      gameMap,
      cache: this.usePlanetCache,
      wireframe: false,
    });
    mapObj.name = 'map';

    if (!mapGroup) {
      mapGroup = new Group();
      mapGroup.name = gameMap.name;
      mapGroup.rotateY(Math.PI);
      const offset = (gameMap.size * gameMap.chunkSize) / 2;

      mapGroup.position.set(offset, 0, offset);
      this.scene.add(mapGroup);
    } else {
      const oldMap = mapGroup.getObjectByName('map')!;
      mapGroup.remove(oldMap);
    }
    mapGroup.add(mapObj);
    const hilight = this.ctx.frontendContext.state.hilight;
    if (hilight && hilight.loc) {
      const comp = hilightGraphicalComp(this, 'hilight', hilight.loc, hilight.color, hilight.corner);
      this.ecs.addGraphicalComponent(comp);
    }
  }
}
