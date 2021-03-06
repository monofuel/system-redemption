import { Component } from ".";
import { ThreeSceneElement } from "../threeScene";
import { Mesh, Vector3, Object3D, Geometry, Face3, Matrix4 } from "three";
import {
  Unit,
  GameColors,
  ModelType,
  FiniteMap,
  TileHeights,
  LocHash
} from "../../types/SR";
import { SkinnedAsset, coloredModel } from "../../mesh/models";
import { getTile } from "../../planet";
import _ from "lodash";
import { getHilightMesh } from "../../mesh/hilight";
import { unHash } from "../../services/hash";
import { SPEGroup } from "../../mesh/particles";

export enum GraphicalType {
  unit = "unit",
  hilight = "hilight"
}
export interface GraphicalComponent extends Component {
  mesh: Mesh;
  type: GraphicalType;
  prevLoc: string;
  nextLoc?: string;
  lerp?: number;

  speGroup?: SPEGroup;
  speTime?: number;
}

export function updateGraphicalComponent(
  sceneElement: ThreeSceneElement,
  comp: GraphicalComponent,
  delta: number
) {
  const map = getMap(sceneElement);
  if (!map.getObjectByName(comp.key)) {
    map.add(comp.mesh);
  }
  const planet = sceneElement.ctx.gameContext.state.planet!;

  if (comp.speGroup) {
    if (!comp.speTime) {
      comp.speTime = 0;
    }
    comp.speGroup.tick(delta / 1000);
    comp.speTime! += delta;
    if (comp.speTime > 1000) {
      comp.mesh.remove(comp.speGroup.mesh);
      // @ts-ignore
      for (const emitter of comp.speGroup.emitters) {
        // @ts-ignore
        comp.speGroup.removeEmitter(emitter);
      }
      comp.speGroup.dispose();
      delete comp.speTime;
    }
  }

  if (comp.type === GraphicalType.unit) {
    const { loc, facing, type } = sceneElement.ctx.gameContext.state.units[
      comp.key
    ];
    const unitDef = sceneElement.ctx.gameContext.state.unitDefinitions[type]!;

    if (loc !== comp.prevLoc && !comp.nextLoc) {
      comp.nextLoc = loc;
      comp.lerp = delta;
    }

    if (comp.nextLoc) {
      const length = unitDef.move!.cooldown * (1000 / planet.tps);
      comp.lerp! += delta;
      const lerp = comp.lerp! / length;
      const start = vecForTile(planet, comp.prevLoc);
      const next = vecForTile(planet, comp.nextLoc);
      comp.mesh.position.copy(start.lerp(next, lerp));

      if (comp.lerp! >= length) {
        delete comp.lerp;
        comp.prevLoc = comp.nextLoc;
        delete comp.nextLoc;
      }
    }
    if (!comp.nextLoc) {
      placeOnMap(planet, comp.mesh, comp.prevLoc, true);
    }
    switch (facing) {
      case "N":
        comp.mesh.rotation.y = 0;
        break;
      case "S":
        comp.mesh.rotation.y = -Math.PI;
        break;
      case "E":
        comp.mesh.rotation.y = Math.PI / 2;
        break;
      case "W":
        comp.mesh.rotation.y = -Math.PI / 2;
    }
  } else if (comp.type === GraphicalType.hilight) {
    const loc = sceneElement.ctx.frontendContext.state.hilight!.loc;
    if (loc) {
      placeOnMap(planet, comp.mesh, loc, false, true);
    }
  }
}

export function dispose(
  sceneElement: ThreeSceneElement,
  comp: GraphicalComponent
) {
  const map = getMap(sceneElement);
  map.remove(comp.mesh);
}

export function getMap(sceneElement: ThreeSceneElement): Object3D {
  return sceneElement.scene.getObjectByName(
    sceneElement.ctx.gameContext.state.planet!.name
  )!;
}

export function unitGraphicalComp(
  sceneElement: ThreeSceneElement,
  unit: Unit
): GraphicalComponent {
  const unitDef = sceneElement.ctx.gameContext.state.unitDefinitions[unit.type];
  if (!unitDef) {
    throw new Error(`missing definition for unit type ${unit.type}`);
  }
  if (!unitDef.graphical) {
    throw new Error(`missing definition for unit type ${unit.type}`);
  }
  const mesh = assetForEntity(
    sceneElement.assets,
    unitDef.graphical.model,
    unit.color || randomColor()
  );
  mesh.name = unit.uuid;
  mesh.userData.uuid = unit.uuid;
  return {
    key: unit.uuid,
    type: GraphicalType.unit,
    mesh,
    prevLoc: unit.loc
  };
}

export function hilightGraphicalComp(
  sceneElement: ThreeSceneElement,
  key: string,
  loc: LocHash,
  defaultColor: number = 0xffffff,
  corners?: Array<0 | 1 | 2 | 3>
): GraphicalComponent {
  const planet = sceneElement.ctx.gameContext.state.planet!;

  const hilightColor = 0xf4eb42;

  let cornerColors: [number, number, number, number] | undefined;
  if (corners) {
    cornerColors = [
      corners.includes(0) ? hilightColor : defaultColor,
      corners.includes(1) ? hilightColor : defaultColor,
      corners.includes(2) ? hilightColor : defaultColor,
      corners.includes(3) ? hilightColor : defaultColor
    ];
  }

  const mesh = getHilightMesh({
    planet,
    loc,
    zScale: planet.zScale,
    color: defaultColor,
    cornerColors
  });
  mesh.name = "hilight";
  return {
    key,
    type: GraphicalType.hilight,
    mesh,
    prevLoc: loc
  };
}

function assetForEntity(
  assets: Record<ModelType, SkinnedAsset>,
  modelType: ModelType,
  color: GameColors
): Mesh {
  const model = coloredModel(assets[modelType], color);
  switch (modelType) {
    default:
      model.scale.copy(new Vector3(0.6, 0.6, 0.6));
      break;
  }
  return model;
}

export function randomColor(): GameColors {
  const num = Math.floor(Math.random() * Object.keys(GameColors).length);
  return (GameColors as any)[Object.keys(GameColors)[num]];
}
function placeOnMap(
  map: FiniteMap,
  obj: Object3D,
  loc: LocHash,
  orient: boolean,
  min: boolean = false
) {
  obj.position.copy(vecForTile(map, loc, min));
  if (orient) {
    // orientToNormal(normal, obj);
  }
}

function vecForTile(
  map: FiniteMap,
  loc: LocHash,
  min: boolean = false
): Vector3 {
  const [x, y] = unHash(loc);
  const tile = getTile(map, loc);
  const avgHeight = ((tile[0] + tile[1] + tile[2] + tile[3]) / 4) * map.zScale;
  const minHeight = _.min(tile)! * map.zScale;

  const normal = getTileNormal(tile, map.zScale);
  const up = new Vector3(0, 0, 1);
  let height = minHeight;
  if (!min && up.equals(normal)) {
    height = avgHeight;
  }

  return new Vector3(x + 0.5, height, y + 0.5);
}

function getTileNormal(corners: TileHeights, zScale: number): Vector3 {
  const geom = new Geometry();

  geom.vertices.push(
    new Vector3(0, 0, corners[0] * zScale), // 0
    new Vector3(0, 1, corners[1] * zScale), // 1
    new Vector3(1, 0, corners[2] * zScale), // 2
    new Vector3(1, 1, corners[3] * zScale) // 3
  );

  // 1 - 2
  // 0 - 3

  if (corners[0] - corners[3] === 0) {
    // left handed
    geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
    geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));
  } else {
    // right handed
    geom.faces.push(new Face3(1, 0, 2, undefined, undefined, 0));
    geom.faces.push(new Face3(2, 3, 1, undefined, undefined, 0));
  }

  geom.computeFaceNormals();

  const normal1 = geom.faces[0].normal;
  const normal2 = geom.faces[1].normal;
  const up = new Vector3(0, 0, 1);
  if (normal1.equals(up) || normal2.equals(up)) {
    return up;
  }

  return normal1
    .clone()
    .add(normal2)
    .divide(new Vector3(2, 2, 2))
    .normalize();
}
function orientToNormal(normal: Vector3, obj: Object3D) {
  const up = obj.up.clone();
  let axis = new Vector3(0, 0, 1);
  if (normal.y !== -1 && normal.y !== 1) {
    axis = up.cross(normal);
  }

  const radians = Math.acos(normal.dot(up));
  const mat = new Matrix4().makeRotationAxis(axis, radians);

  obj.rotation.setFromRotationMatrix(mat);
  obj.rotateX(-Math.PI / 2);
}
