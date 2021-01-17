import { GameState, GameUnit, UnitType } from "../events/store/dualfront";
import { getRandomColor } from "../util";
import * as THREE from "three";

export function getUnitObj(state: GameState, unit: GameUnit) {
  if (unit.type === UnitType.base) {
    return getBaseMesh(getPlayerColor(state, unit.owner));
  }

  if (unit.type === UnitType.triangle) {
    return getTriangleMesh(state, unit);
  }

  return new THREE.Object3D();
}

function getTriangleMesh(state: GameState, unit: GameUnit) {
  const color = getPlayerColor(state, unit.owner);
  const triangleShape = new THREE.Shape();

  triangleShape.moveTo(0, 0.5);
  triangleShape.lineTo(-1, -0.5);
  triangleShape.lineTo(1, -0.5);

  const geometry = new THREE.ShapeGeometry(triangleShape);
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  const ringGeometry = new THREE.RingGeometry(1.1, 1.5, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (unit.factory) {
    obj.add(ringMesh);
  }
  // obj.add(new AxesHelper(5));
  return obj;
}

function getBaseMesh(color: number) {
  const geometry = new THREE.PlaneGeometry(1, 1, 32);
  const material = new THREE.MeshBasicMaterial({
    color
  });
  const boxMesh = new THREE.Mesh(geometry, material);

  const ringGeometry = new THREE.RingGeometry(1.1, 1.5, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  const obj = new THREE.Object3D();
  obj.add(boxMesh);
  obj.add(ringMesh);
  return obj;
}

export function getPlayerColor(state: GameState, id: string) {
  for (const player of state.players) {
    if (player.id === id) {
      return player.color;
    }
  }
  return getRandomColor();
}
