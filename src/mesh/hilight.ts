import { DoubleSide, Face3, FrontSide, Geometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3 } from 'three';
import { TileHeights } from '../types/SR';

interface HilightOpts {
    corners: TileHeights;
    color: number;
    cornerColors?: [number, number, number, number];

    zScale?: number;
}

export function getHilightMesh({ corners, color, cornerColors, zScale = 0.4}: HilightOpts): Mesh {
    cornerColors = cornerColors || [color, color, color, color];
    const geom = new Geometry();
    const heightOffset = 0.01;
    geom.vertices.push(
        new Vector3(0, 0, heightOffset + corners[0] * zScale), // 0
        new Vector3(0, 1, heightOffset + corners[1] *  zScale), // 1
        new Vector3(1, 0, heightOffset + corners[2] *  zScale), // 2
        new Vector3(1, 1, heightOffset + corners[3] * zScale), // 3
        );

    geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
    geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));

    const hilightMaterial = new MeshBasicMaterial({
        side: DoubleSide,
        color,
        flatShading: true,
      });
    geom.rotateX(-Math.PI / 2);
    const mesh = new Mesh(geom, [hilightMaterial]);
    return mesh;
}

/*
export function tileSquareMesh(loc: PlanetLoc, color: THREE.Color): THREE.Mesh {
  const corners = [
    new THREE.Vector3(-0.5, loc.corners[2] - loc.real_z, -0.5),
    new THREE.Vector3(0.5, loc.corners[3] - loc.real_z, -0.5),
    new THREE.Vector3(-0.5, loc.corners[0] - loc.real_z, 0.5),
    new THREE.Vector3(0.5, loc.corners[1] - loc.real_z, 0.5),
  ];
  const center = new THREE.Vector3(0, 0, 0);

  const edges = [[0, 1], [1, 3], [2, 0], [3, 2]];
  // create a trapezoid for each edge
  const thickness = 0.15;
  const selectedGeom = new THREE.Geometry();
  for (let i = 0; i < edges.length; i++) {
    const [j, k] = edges[i];
    selectedGeom.vertices.push(corners[j]);
    selectedGeom.vertices.push(corners[k]);
    selectedGeom.vertices.push(corners[j].clone().lerp(center, thickness));
    selectedGeom.vertices.push(corners[k].clone().lerp(center, thickness));
    const offset = i * 4;
    selectedGeom.faces.push(new THREE.Face3(offset, offset + 2, offset + 1));
    selectedGeom.faces.push(new THREE.Face3(offset + 1, offset + 2, offset + 3));
  }
*/
